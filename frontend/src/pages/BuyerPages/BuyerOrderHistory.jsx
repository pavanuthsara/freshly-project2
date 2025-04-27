import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaMoneyBillWave, FaBan, FaCheck, FaTimes } from 'react-icons/fa';
import BuyerSidebar from '../../components/BuyerSidebar';

const BuyerOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Refund state
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [submittingRefund, setSubmittingRefund] = useState(false);
  const [refundSuccess, setRefundSuccess] = useState(false);
  const [refundError, setRefundError] = useState('');
  
  // Cancel order state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [submittingCancel, setSubmittingCancel] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [cancelError, setCancelError] = useState('');

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/orders/${id}`, {
          withCredentials: true
        });
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not fetch order details');
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  // Format currency - Explicitly set to LKR
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('si-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Check if order can be cancelled (only if not paid and status is Pending)
  const canBeCancelled = () => {
    return order && !order.isPaid && order.status === 'Pending';
  };

  // Check if order can be refunded (only if paid and delivered)
  const canBeRefunded = () => {
    return order && 
           order.isPaid && 
           !order.refundRequested && 
           order.status !== 'Cancelled' && 
           order.status !== 'Refunded';
  };

  // Handle cancel order
  const handleCancelOrder = async () => {
    if (!cancelReason) {
      setCancelError('Please provide a reason for cancellation');
      return;
    }

    try {
      setSubmittingCancel(true);
      setCancelError('');

      await axios.put(`/api/orders/${id}/status`, {
        status: 'Cancelled',
        reason: cancelReason
      }, {
        withCredentials: true
      });

      setCancelSuccess(true);
      // Update the local order status
      setOrder({ ...order, status: 'Cancelled', cancellationReason: cancelReason });
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setShowCancelModal(false);
        setCancelSuccess(false);
      }, 2000);
    } catch (err) {
      setCancelError(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setSubmittingCancel(false);
    }
  };

  // Handle refund request
  const handleRefundRequest = async () => {
    if (!refundReason) {
      setRefundError('Please provide a reason for refund');
      return;
    }

    try {
      setSubmittingRefund(true);
      setRefundError('');

      await axios.post(`/api/orders/${id}/refund-request`, {
        reason: refundReason,
        items: order.orderItems // Request refund for all items
      }, {
        withCredentials: true
      });

      setRefundSuccess(true);
      // Update the local order refund status
      setOrder({ ...order, refundRequested: true, refundStatus: 'Pending' });
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setShowRefundModal(false);
        setRefundSuccess(false);
      }, 2000);
    } catch (err) {
      setRefundError(err.response?.data?.message || 'Failed to submit refund request');
    } finally {
      setSubmittingRefund(false);
    }
  };

  // Get status badge class
  const getStatusClass = (status) => {
    switch(status) {
      case 'Pending': return 'bg-amber-500';
      case 'Processing': return 'bg-sky-500';
      case 'Shipped': return 'bg-indigo-600';
      case 'Delivered': return 'bg-emerald-500';
      case 'Cancelled': return 'bg-rose-500';
      case 'Refunded': return 'bg-violet-600';
      default: return 'bg-slate-500';
    }
  };

  // Get refund status badge class
  const getRefundStatusClass = (status) => {
    switch(status) {
      case 'Pending': return 'bg-amber-500';
      case 'Processing': return 'bg-sky-500';
      case 'Approved': return 'bg-emerald-500';
      case 'Rejected': return 'bg-rose-500';
      default: return 'bg-slate-500';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
        <BuyerSidebar activeTab="orders" />
        <div className="flex-1 p-6 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
        <BuyerSidebar activeTab="orders" />
        <div className="flex-1 p-6">
          <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-md mb-4 shadow-sm">
            <p className="text-rose-700">{error}</p>
          </div>
          <button 
            onClick={() => navigate('/buyer/profile/orders')}
            className="flex items-center text-teal-600 hover:text-teal-800 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
      <BuyerSidebar activeTab="orders" />
      
      <div className="flex-1 p-6">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate('/buyer/profile/orders')}
            className="mr-4 text-teal-600 hover:text-teal-800 transition-colors"
          >
            <FaArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-semibold text-slate-800">Order Details</h1>
        </div>
        
        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md border border-teal-100 p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-medium text-slate-800">Order #{order._id}</h2>
              <p className="text-slate-600">Placed on {formatDate(order.createdAt)}</p>
            </div>
            
            <div className="flex flex-col items-end">
              <span className={`${getStatusClass(order.status)} text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm`}>
                {order.status}
              </span>
              
              {order.refundRequested && (
                <span className={`${getRefundStatusClass(order.refundStatus)} text-white px-3 py-1 rounded-full text-xs mt-2 font-medium shadow-sm`}>
                  Refund {order.refundStatus}
                </span>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-b border-teal-100 pb-6">
            <div className="bg-teal-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-teal-700 mb-1">Shipping Address</h3>
              <p className="text-sm text-slate-700">
                {order.shippingAddress.address},<br />
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                {order.shippingAddress.country}
              </p>
            </div>
            
            <div className="bg-cyan-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-cyan-700 mb-1">Payment Method</h3>
              <p className="text-sm text-slate-700">{order.paymentMethod}</p>
              
              <div className="mt-2">
                <h3 className="text-sm font-medium text-cyan-700 mb-1">Payment Status</h3>
                {order.isPaid ? (
                  <span className="text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full text-xs font-medium">
                    Paid on {formatDate(order.paidAt)}
                  </span>
                ) : (
                  <span className="text-rose-600 bg-rose-100 px-2 py-1 rounded-full text-xs font-medium">
                    Not Paid
                  </span>
                )}
              </div>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-indigo-700 mb-1">Delivery Status</h3>
              {order.isDelivered ? (
                <span className="text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full text-xs font-medium">
                  Delivered on {formatDate(order.deliveredAt)}
                </span>
              ) : (
                <span className="text-slate-600 bg-slate-100 px-2 py-1 rounded-full text-xs font-medium">
                  Not Delivered
                </span>
              )}
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex justify-end gap-3 mb-4">
            {canBeCancelled() && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-md flex items-center shadow-sm transition-colors"
              >
                <FaBan className="mr-2" /> Cancel Order
              </button>
            )}
            
            {canBeRefunded() && (
              <button
                onClick={() => setShowRefundModal(true)}
                className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-md flex items-center shadow-sm transition-colors"
              >
                <FaMoneyBillWave className="mr-2" /> Request Refund
              </button>
            )}
          </div>

          {/* Order cancelled info */}
          {order.status === 'Cancelled' && (
            <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-md mb-4">
              <h3 className="text-rose-700 font-medium">Order Cancelled</h3>
              {order.cancellationReason && (
                <p className="text-rose-700 mt-1">Reason: {order.cancellationReason}</p>
              )}
            </div>
          )}

          {/* Refund info */}
          {order.refundRequested && (
            <div className="bg-sky-50 border-l-4 border-sky-500 p-4 rounded-md mb-4">
              <h3 className="text-sky-700 font-medium">Refund {order.refundStatus}</h3>
              {order.refundReason && (
                <p className="text-sky-700 mt-1">Reason: {order.refundReason}</p>
              )}
              {order.refundProcessedAt && (
                <p className="text-sky-700 mt-1">
                  Processed on: {formatDate(order.refundProcessedAt)}
                </p>
              )}
            </div>
          )}
        </div>
        
        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md border border-teal-100 p-6 mb-6">
          <h2 className="text-lg font-medium mb-4 text-slate-800">Order Items</h2>
          
          <div className="overflow-hidden border border-teal-100 rounded-md">
            {order.orderItems.map((item, index) => (
              <div 
                key={index} 
                className={`flex items-center p-4 hover:bg-teal-50 transition-colors ${
                  index < order.orderItems.length - 1 ? 'border-b border-teal-100' : ''
                }`}
              >
                <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden shadow-sm">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="ml-4 flex-1">
                  <h3 className="font-medium text-slate-800">{item.name}</h3>
                  <p className="text-slate-600 text-sm">
                    {item.qty} x {formatCurrency(item.price)} = {formatCurrency(item.qty * item.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md border border-teal-100 p-6">
          <h2 className="text-lg font-medium mb-4 text-slate-800">Order Summary</h2>
          
          <div className="space-y-2 text-sm bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-md">
            <div className="flex justify-between">
              <span className="text-slate-600">Items Price:</span>
              <span className="text-slate-800 font-medium">{formatCurrency(order.itemsPrice)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-slate-600">Shipping:</span>
              <span className="text-slate-800 font-medium">{formatCurrency(order.shippingPrice)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-slate-600">Tax:</span>
              <span className="text-slate-800 font-medium">{formatCurrency(order.taxPrice)}</span>
            </div>
            
            <div className="flex justify-between font-semibold pt-2 border-t border-teal-200 text-lg">
              <span className="text-teal-800">Total:</span>
              <span className="text-teal-800">{formatCurrency(order.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4 border border-teal-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-slate-800">Cancel Order</h2>
              <button 
                onClick={() => setShowCancelModal(false)}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            
            {cancelSuccess ? (
              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-md mb-4">
                <div className="flex">
                  <FaCheck className="text-emerald-500 mt-0.5 mr-2" />
                  <div>
                    <h3 className="text-emerald-800 font-medium">Order Cancelled</h3>
                    <p className="text-emerald-700">Your order has been cancelled successfully.</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <p className="mb-4 text-slate-600">
                  Are you sure you want to cancel this order? This action cannot be undone.
                </p>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Reason for Cancellation
                  </label>
                  <select
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full border border-teal-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Select a reason</option>
                    <option value="Changed my mind">Changed my mind</option>
                    <option value="Found a better price elsewhere">Found a better price elsewhere</option>
                    <option value="Ordered by mistake">Ordered by mistake</option>
                    <option value="Other">Other</option>
                  </select>
                  
                  {cancelError && (
                    <p className="text-rose-500 text-sm mt-1">{cancelError}</p>
                  )}
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    No, Keep Order
                  </button>
                  <button
                    onClick={handleCancelOrder}
                    className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-md disabled:opacity-50 transition-colors shadow-sm"
                    disabled={submittingCancel || !cancelReason}
                  >
                    {submittingCancel ? 'Cancelling...' : 'Yes, Cancel Order'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Refund Request Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4 border border-teal-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-slate-800">Request Refund</h2>
              <button 
                onClick={() => setShowRefundModal(false)}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            
            {refundSuccess ? (
              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-md mb-4">
                <div className="flex">
                  <FaCheck className="text-emerald-500 mt-0.5 mr-2" />
                  <div>
                    <h3 className="text-emerald-800 font-medium">Refund Requested</h3>
                    <p className="text-emerald-700">Your refund request has been submitted successfully.</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <p className="mb-4 text-slate-600">
                  Please provide a reason for your refund request. Our team will review your request as soon as possible.
                </p>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Reason for Refund
                  </label>
                  <select
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    className="w-full border border-teal-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Select a reason</option>
                    <option value="Item damaged during shipping">Item damaged during shipping</option>
                    <option value="Received wrong item">Received wrong item</option>
                    <option value="Item doesn't match description">Item doesn't match description</option>
                    <option value="Item is defective">Item is defective</option>
                    <option value="Changed my mind">Changed my mind</option>
                    <option value="Other">Other</option>
                  </select>
                  
                  {refundError && (
                    <p className="text-rose-500 text-sm mt-1">{refundError}</p>
                  )}
                </div>
                
                <div className="mb-4 bg-cyan-50 p-3 rounded-md">
                  <p className="text-sm text-slate-700 mb-2">
                    Refund amount: {formatCurrency(order.totalPrice)}
                  </p>
                  <p className="text-sm text-slate-700">
                    Note: This will request a refund for all items in this order.
                  </p>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowRefundModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRefundRequest}
                    className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-md disabled:opacity-50 transition-colors shadow-sm"
                    disabled={submittingRefund || !refundReason}
                  >
                    {submittingRefund ? 'Submitting...' : 'Submit Refund Request'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerOrderDetails;