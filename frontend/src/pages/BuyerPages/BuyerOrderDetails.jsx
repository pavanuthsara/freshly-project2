import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaMoneyBillWave, FaBan, FaCheck, FaTimes } from 'react-icons/fa';

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
        const { data } = await axios.get(`/api/v1/orders/${id}`, {
          withCredentials: true
        });
        setOrder(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError(err.response?.data?.message || 'Could not fetch order details');
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR'
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

  // Check if order can be cancelled
  const canBeCancelled = () => {
    return order && !order.isPaid && order.status === 'Pending';
  };

  // Check if order can be refunded
  const canBeRefunded = () => {
    return order && 
           order.isPaid && 
           !order.refundRequested && 
           order.status !== 'Cancelled' && 
           order.status !== 'Refunded';
  };

  // Get status badge class
  const getStatusClass = (status) => {
    switch(status) {
      case 'Pending': return 'bg-amber-500';
      case 'Processing': return 'bg-blue-500';
      case 'Shipped': return 'bg-indigo-500';
      case 'Delivered': return 'bg-emerald-500';
      case 'Cancelled': return 'bg-rose-500';
      case 'Refunded': return 'bg-violet-500';
      default: return 'bg-slate-500';
    }
  };

  // Get refund status badge class
  const getRefundStatusClass = (status) => {
    switch(status) {
      case 'Pending': return 'bg-amber-500';
      case 'Processing': return 'bg-blue-500';
      case 'Approved': return 'bg-emerald-500';
      case 'Rejected': return 'bg-rose-500';
      default: return 'bg-slate-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-4">
            <p className="text-red-700">{error}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Header Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Top Navigation Bar */}
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => navigate('/buyer/profile/orders')}
                className="flex items-center gap-2 text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
              >
                <FaArrowLeft size={18} />
                <span className="font-medium">Back to Orders</span>
              </button>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-teal-100">Order Status:</span>
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {order.status}
                  </span>
                </div>
                
                {order.refundRequested && (
                  <div className="flex items-center gap-2">
                    <span className="text-teal-100">Refund Status:</span>
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Refund {order.refundStatus}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Header Content */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Order #{order._id}</h1>
                <p className="text-gray-600 mt-2">Placed on {formatDate(order.createdAt)}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-2xl font-bold text-teal-600">{formatCurrency(order.totalPrice)}</p>
                </div>
              </div>
            </div>

            {/* Order Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {/* Payment Status */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-500">Payment Status</h3>
                  <span className={`${order.isPaid ? 'bg-emerald-500' : 'bg-amber-500'} text-white px-2 py-1 rounded-full text-xs font-medium`}>
                    {order.isPaid ? 'Paid' : 'Pending'}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-gray-600 text-sm">Method: {order.paymentMethod}</p>
                  {order.isPaid && (
                    <p className="text-gray-600 text-sm">Paid on: {formatDate(order.paidAt)}</p>
                  )}
                </div>
              </div>

              {/* Delivery Status */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-500">Delivery Status</h3>
                  <span className={`${order.isDelivered ? 'bg-emerald-500' : 'bg-amber-500'} text-white px-2 py-1 rounded-full text-xs font-medium`}>
                    {order.isDelivered ? 'Delivered' : 'In Transit'}
                  </span>
                </div>
                <div className="mt-2">
                  {order.isDelivered ? (
                    <p className="text-gray-600 text-sm">Delivered on: {formatDate(order.deliveredAt)}</p>
                  ) : (
                    <p className="text-gray-600 text-sm">Estimated delivery: {formatDate(new Date(order.createdAt).setDate(new Date(order.createdAt).getDate() + 7))}</p>
                  )}
                  {order.trackingNumber && (
                    <p className="text-gray-600 text-sm">Tracking: {order.trackingNumber}</p>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Order Summary</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items:</span>
                    <span className="text-gray-800">{formatCurrency(order.itemsPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="text-gray-800">{formatCurrency(order.shippingPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax:</span>
                    <span className="text-gray-800">{formatCurrency(order.taxPrice)}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex justify-between font-medium">
                      <span className="text-gray-800">Total:</span>
                      <span className="text-teal-600">{formatCurrency(order.totalPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Shipping Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-gray-800">{order.shippingAddress.fullName}</p>
                  <p className="text-gray-600">{order.shippingAddress.address}</p>
                  <p className="text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                  <p className="text-gray-600">{order.shippingAddress.country}</p>
                </div>
                <div>
                  {order.shippingAddress.phone && (
                    <p className="text-gray-600">Phone: {order.shippingAddress.phone}</p>
                  )}
                  {order.shippingAddress.email && (
                    <p className="text-gray-600">Email: {order.shippingAddress.email}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.orderItems.map((item, index) => (
              <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="font-medium text-gray-800">{item.name}</h4>
                  <p className="text-gray-600 text-sm">
                    {item.qty} x {formatCurrency(item.price)} = {formatCurrency(item.qty * item.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 mt-6">
            {canBeCancelled() && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <FaBan className="mr-2" /> Cancel Order
              </button>
            )}
            
            {canBeRefunded() && (
              <button
                onClick={() => setShowRefundModal(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <FaMoneyBillWave className="mr-2" /> Request Refund
              </button>
            )}
          </div>

          {/* Order cancelled info */}
          {order.status === 'Cancelled' && (
            <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-lg mt-6">
              <h3 className="text-rose-700 font-medium">Order Cancelled</h3>
              {order.cancellationReason && (
                <p className="text-rose-700 mt-1">Reason: {order.cancellationReason}</p>
              )}
            </div>
          )}

          {/* Refund info */}
          {order.refundRequested && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mt-6">
              <h3 className="text-blue-700 font-medium">Refund {order.refundStatus}</h3>
              {order.refundReason && (
                <p className="text-blue-700 mt-1">Reason: {order.refundReason}</p>
              )}
              {order.refundProcessedAt && (
                <p className="text-blue-700 mt-1">
                  Processed on: {formatDate(order.refundProcessedAt)}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerOrderDetails;