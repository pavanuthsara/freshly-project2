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
      {/* Simple Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => navigate('/buyer/profile/orders')}
              className="flex items-center gap-2 text-teal-600 hover:text-teal-800"
            >
              <FaArrowLeft size={16} />
              <span className="text-sm font-medium">Back to Orders</span>
            </button>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Status:</span>
                <span className={`${order.status === 'Delivered' ? 'bg-emerald-500' : 'bg-amber-500'} text-white px-2 py-0.5 rounded-full text-xs font-medium`}>
                  {order.status}
                </span>
              </div>
              
              {order.refundRequested && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Refund:</span>
                  <span className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                    {order.refundStatus}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Order Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">Order #{order._id}</h1>
              <p className="text-gray-600 text-sm mt-1">Placed on {formatDate(order.createdAt)}</p>
            </div>
            
            <div className="text-right">
              <p className="text-gray-500 text-sm">Total Amount</p>
              <p className="text-xl font-bold text-teal-600">{formatCurrency(order.totalPrice)}</p>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Payment Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Payment</h3>
              <span className={`${order.isPaid ? 'bg-emerald-500' : 'bg-amber-500'} text-white px-2 py-0.5 rounded-full text-xs font-medium`}>
                {order.isPaid ? 'Paid' : 'Pending'}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              <p>{order.paymentMethod}</p>
              {order.isPaid && (
                <p className="mt-1">Paid on {formatDate(order.paidAt)}</p>
              )}
            </div>
          </div>

          {/* Delivery Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Delivery</h3>
              <span className={`${order.isDelivered ? 'bg-emerald-500' : 'bg-amber-500'} text-white px-2 py-0.5 rounded-full text-xs font-medium`}>
                {order.isDelivered ? 'Delivered' : 'In Transit'}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {order.isDelivered ? (
                <p>Delivered on {formatDate(order.deliveredAt)}</p>
              ) : (
                <p>Estimated: {formatDate(new Date(order.createdAt).setDate(new Date(order.createdAt).getDate() + 7))}</p>
              )}
              {order.trackingNumber && (
                <p className="mt-1">Tracking: {order.trackingNumber}</p>
              )}
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
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
            </div>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Shipping Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
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

        {/* Order Items Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Order Items</h2>
          <div className="space-y-3">
            {order.orderItems.map((item, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-md">
                <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <h4 className="font-medium text-gray-800">{item.name}</h4>
                  <p className="text-gray-600 text-sm">
                    {item.qty} x {formatCurrency(item.price)} = {formatCurrency(item.qty * item.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 mt-4">
            {canBeCancelled() && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-md flex items-center transition-colors"
              >
                <FaBan className="mr-2" /> Cancel Order
              </button>
            )}
            
            {canBeRefunded() && (
              <button
                onClick={() => setShowRefundModal(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center transition-colors"
              >
                <FaMoneyBillWave className="mr-2" /> Request Refund
              </button>
            )}
          </div>

          {/* Order cancelled info */}
          {order.status === 'Cancelled' && (
            <div className="bg-rose-50 border-l-4 border-rose-500 p-3 rounded-md mt-4">
              <h3 className="text-rose-700 font-medium">Order Cancelled</h3>
              {order.cancellationReason && (
                <p className="text-rose-700 text-sm mt-1">Reason: {order.cancellationReason}</p>
              )}
            </div>
          )}

          {/* Refund info */}
          {order.refundRequested && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-md mt-4">
              <h3 className="text-blue-700 font-medium">Refund {order.refundStatus}</h3>
              {order.refundReason && (
                <p className="text-blue-700 text-sm mt-1">Reason: {order.refundReason}</p>
              )}
              {order.refundProcessedAt && (
                <p className="text-blue-700 text-sm mt-1">
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