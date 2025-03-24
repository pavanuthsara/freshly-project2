import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ConfirmOrderPage = ({ cartItems, shippingAddress, paymentMethod, setCartItems }) => {
  const navigate = useNavigate();

  // ✅ Corrected subtotal calculation
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.qty * (item.product?.price || 0),
    0
  );
  const taxPrice = 0;
  const shippingPrice = 0;
  const totalPrice = subtotal + taxPrice + shippingPrice;

  // ✅ Corrected orderItems mapping
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
        paymentMethod,
        itemsPrice: subtotal,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      await axios.post('/api/orders', payload, { withCredentials: true });
      alert('✅ Order placed successfully!');
      setCartItems([]);
      navigate('/buyer/profile');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order');
    }
  };

  return (
    <div className="confirm-order-page">
      <h2>Review Your Order</h2>
      <div>
        <p>
          <strong>Shipping Address:</strong>{' '}
          {shippingAddress.address}, {shippingAddress.city},{' '}
          {shippingAddress.postalCode}, {shippingAddress.country}
        </p>
        <p>
          <strong>Payment Method:</strong> {paymentMethod}
        </p>
        <h3>Items:</h3>
        <ul>
          {cartItems.map((item) => (
            <li key={item.product?._id}>
              {item.product?.name} x {item.qty} = Rs.{' '}
              {item.qty * (item.product?.price || 0)}
            </li>
          ))}
        </ul>
        <h3>Total: Rs. {totalPrice.toFixed(2)}</h3>
        <button onClick={placeOrder}>Place Order</button>
      </div>
    </div>
  );
};

export default ConfirmOrderPage;
