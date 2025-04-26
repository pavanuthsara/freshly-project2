import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import { FaSearch, FaPrint, FaEye, FaLeaf } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import BuyerSidebar from './BuyerSidebar';
// Removed CSS import

const BuyerOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const printComponentRef = useRef();

  // Helper to format currency to LKR
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  };

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/v1/orders/my-orders', {
          withCredentials: true,
        });
        setOrders(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Print functionality
  const handlePrint = useReactToPrint({
    content: () => printComponentRef.current,
    documentTitle: 'Order History',
  });

  // Filter orders based on search term
  const filteredOrders = orders.filter(order => 
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(order.createdAt).toLocaleDateString().includes(searchTerm)
  );

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get status color
  const getStatusClass = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-500';
      case 'Processing': return 'bg-blue-400';
      case 'Shipped': return 'bg-blue-600';
      case 'Delivered': return 'bg-green-500';
      case 'Cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex bg-green-50 min-h-screen">
      <BuyerSidebar activeTab="orders" />
      
      {/* Main content */}
      <div className="flex-1 p-6 relative overflow-hidden">
        {/* Decorative leaf elements */}
        <div className="absolute -top-6 -right-6 opacity-10 z-0 transform rotate-45">
          <FaLeaf size={80} className="text-green-600" />
        </div>
        <div className="absolute bottom-10 left-10 opacity-10 z-0 transform -rotate-12">
          <FaLeaf size={100} className="text-green-600" />
        </div>
        <div className="absolute top-1/2 right-1/4 opacity-10 z-0">
          <FaLeaf size={60} className="text-green-600" />
        </div>
        
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Order History</h1>
          
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full md:w-auto flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by order ID, status, or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <button 
              className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-green-700 transition-colors w-full md:w-auto justify-center"
              onClick={handlePrint}
            >
              <FaPrint className="mr-2" /> Print
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mb-4"></div>
              <p className="text-gray-600">Loading your orders...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 rounded-md">{error}</div>
          ) : (
            <>
              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center text-gray-500">
                  {searchTerm ? 'No orders match your search.' : 'You have no orders yet.'}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" ref={printComponentRef}>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivered</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOrders.map((order) => (
                          <tr key={order._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order._id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{formatCurrency(order.totalPrice)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {order.isPaid ? (
                                <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs">
                                  {formatDate(order.paidAt)}
                                </span>
                              ) : (
                                <span className="text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs">Not Paid</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {order.isDelivered ? (
                                <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs">
                                  {formatDate(order.deliveredAt)}
                                </span>
                              ) : (
                                <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs">Not Delivered</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span 
                                className={`${getStatusClass(order.status)} text-white px-2 py-1 rounded-full text-xs`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <Link 
                                to={`/order/${order._id}`} 
                                className="text-blue-600 hover:text-blue-900 flex items-center"
                              >
                                <FaEye className="mr-1" /> Details
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerOrderHistory;