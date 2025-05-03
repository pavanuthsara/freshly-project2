import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaDownload, FaArrowLeft, FaCheck, FaShieldAlt } from 'react-icons/fa';

const ConfirmOrderPage = ({ cartItems, shippingAddress, paymentMethod, setCartItems }) => {
  const navigate = useNavigate();
  const pageRef = useRef();

  useEffect(() => {
    console.log('ConfirmOrderPage received:');
    console.log('- cartItems:', cartItems);
    console.log('- shippingAddress:', shippingAddress);
    console.log('- paymentMethod:', paymentMethod);
  }, [cartItems, shippingAddress, paymentMethod]);

  // Prevent access if required data is missing
  if (!shippingAddress || !paymentMethod || !cartItems.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 py-10">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <div className="bg-white rounded-lg shadow-md border-l-4 border-red-500 p-6">
            <h2 className="text-xl font-bold text-red-700 mb-4">Missing Information</h2>
            <p className="text-red-600 mb-6">Please complete the previous steps before confirming your order.</p>
            <div className="flex flex-wrap gap-3">
              {!cartItems.length && 
                <button 
                  onClick={() => navigate('/cart')}
                  className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition-colors"
                >
                  Go to Cart
                </button>
              }
              {!shippingAddress && 
                <button 
                  onClick={() => navigate('/buyer/shipping')}
                  className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition-colors"
                >
                  Go to Shipping
                </button>
              }
              {!paymentMethod && 
                <button 
                  onClick={() => navigate('/buyer/payment')}
                  className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition-colors"
                >
                  Go to Payment
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * (item.product?.price || 0), 0);
  const taxPrice = subtotal * 0.1;
  const shippingPrice = subtotal > 1000 ? 0 : 150;
  const totalPrice = subtotal + taxPrice + shippingPrice;

  const placeOrder = async () => {
    try {
      const orderItems = cartItems.map((item) => ({
        name: item.product?.name,
        qty: item.qty,
        price: item.product?.price,
        image: item.product?.image,
        product: item.product?._id,
      }));

      const payload = {
        orderItems,
        shippingAddress,
        paymentMethod: typeof paymentMethod === 'object' ? paymentMethod.method : paymentMethod,
        itemsPrice: subtotal,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      console.log('Placing order with payload:', payload);

      const { data } = await axios.post('/api/orders', payload, { withCredentials: true });

      // Save order ID for payment session
      localStorage.setItem('latestOrderId', data._id);

      // ⛔ Don't clear cart yet if using Stripe
      if (
        typeof paymentMethod === 'object' &&
        paymentMethod.method === 'Credit Card' &&
        paymentMethod.provider === 'stripe'
      ) {
        const stripeRes = await axios.post(
          'http://localhost:5000/api/payment/create-checkout-session',
          { 
            orderId: data._id,
            successUrl: `${window.location.origin}/buyer/dashboard`,
            cancelUrl: `${window.location.origin}/buyer/confirm`
          },
          { withCredentials: true }
        );

        // Redirect to Stripe Checkout
        window.location.href = stripeRes.data.url;
        return;
      }

      // For other methods, proceed to final confirmation page
      alert('✅ Order placed successfully!');
      setCartItems([]);
      localStorage.removeItem('cartItems');
      navigate('/buyer/dashboard');
    } catch (err) {
      console.error('Order error:', err);
      alert(err.response?.data?.message || 'Failed to place order');
    }
  };

  const getPaymentMethodDisplay = () => {
    if (typeof paymentMethod === 'object') {
      return paymentMethod.method === 'Credit Card'
        ? `${paymentMethod.method} (${paymentMethod.provider || 'Stripe'})`
        : paymentMethod.method;
    }
    return paymentMethod;
  };

  const downloadPDF = async () => {
    const element = pageRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const imgWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = 0;
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);

    if (imgHeight > pdf.internal.pageSize.getHeight()) {
      let heightLeft = imgHeight - pdf.internal.pageSize.getHeight();
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }
    }

    pdf.save('Order_Confirmation.pdf');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 py-10">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-medium">1</div>
              <span className="text-sm font-medium text-teal-600 mt-1">Cart</span>
            </div>
            <div className="flex-1 h-1 mx-4 bg-teal-600"></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-medium">2</div>
              <span className="text-sm font-medium text-teal-600 mt-1">Delivery</span>
            </div>
            <div className="flex-1 h-1 mx-4 bg-teal-600"></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-medium">3</div>
              <span className="text-sm font-medium text-teal-600 mt-1">Payment</span>
            </div>
            <div className="flex-1 h-1 mx-4 bg-teal-600"></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-medium">4</div>
              <span className="text-sm font-medium text-teal-600 mt-1">Confirm</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md border border-teal-100 overflow-hidden" ref={pageRef}>
          <div className="bg-teal-600 py-4 px-6">
            <h2 className="text-xl font-bold text-white">Review Your Order</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              {/* Shipping Section */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Shipping Address</h3>
                <div className="bg-gray-50 p-3 rounded-md text-gray-600">
                  <p>
                    {shippingAddress.address}, <br />
                    {shippingAddress.city}, {shippingAddress.postalCode}, <br />
                    {shippingAddress.country}
                  </p>
                </div>
              </div>

              {/* Payment Method Section */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Payment Method</h3>
                <div className="bg-gray-50 p-3 rounded-md text-gray-600">
                  <p>{getPaymentMethodDisplay()}</p>
                </div>
              </div>

              {/* Order Items Section */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Order Items</h3>
                <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <li key={item.product?._id || item._id} className="py-3 px-4 flex items-center hover:bg-gray-50">
                        <div className="w-16 h-16 mr-4 flex-shrink-0">
                          {item.product?.image ? (
                            <img 
                              src={item.product.image} 
                              alt={item.product.name} 
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded text-xs text-gray-500">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{item.product?.name || 'Product'}</p>
                          <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                        </div>
                        <div className="text-right font-medium">
                          Rs. {(item.qty * (item.product?.price || 0)).toFixed(2)}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Order Summary Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Order Summary</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Items:</span>
                      <span className="font-medium">Rs. {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-medium">
                        {shippingPrice > 0 ? `Rs. ${shippingPrice.toFixed(2)}` : 'Free'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax:</span>
                      <span className="font-medium">Rs. {taxPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-300 pt-2 mt-2">
                      <span className="font-bold text-gray-900">Total:</span>
                      <span className="font-bold text-teal-700">Rs. {totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Security notice */}
              <div className="flex items-center justify-center text-sm text-gray-600 bg-teal-50 p-3 rounded-md border-l-4 border-teal-400">
                <FaShieldAlt className="text-teal-600 mr-2" />
                <span>Your order information is secure and encrypted</span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <button 
                className="w-full bg-teal-600 text-white py-3 rounded-md hover:bg-teal-700 transition-colors font-medium flex items-center justify-center"
                onClick={placeOrder}
              >
                <FaCheck className="mr-2" /> Place Order
              </button>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button 
                  className="sm:flex-1 border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition-colors text-gray-700 flex items-center justify-center"
                  onClick={() => navigate('/buyer/payment')}
                >
                  <FaArrowLeft className="mr-2" /> Back to Payment
                </button>
                
                <button 
                  className="sm:flex-1 bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900 transition-colors flex items-center justify-center"
                  onClick={downloadPDF}
                >
                  <FaDownload className="mr-2" /> Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrderPage;