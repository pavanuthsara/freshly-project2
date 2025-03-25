import React, { useEffect, useState, useRef } from 'react';
import api from '../../api';
import { useReactToPrint } from 'react-to-print';
import { FaSearch, FaPrint, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import BuyerSidebar from './BuyerSidebar';
//import './BuyerOrderHistory.css';

const BuyerOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const printComponentRef = useRef();

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Updated endpoint to match backend routing
        const res = await api.get('/orders/my-orders');
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
  const filteredOrders = orders.filter((order) =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(order.createdAt).toLocaleDateString().includes(searchTerm)
  );

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return '#f0ad4e';
      case 'Processing':
        return '#5bc0de';
      case 'Shipped':
        return '#428bca';
      case 'Delivered':
        return '#5cb85c';
      case 'Cancelled':
        return '#d9534f';
      default:
        return '#777';
    }
  };

  return (
    <div className="buyer-order-history-container">
      <div className="order-history-content">
        <h2>My Order History</h2>

        <div className="order-actions">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by order ID, status, or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <button className="print-button" onClick={handlePrint}>
            <FaPrint /> Print
          </button>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            {filteredOrders.length === 0 ? (
              <div className="no-orders-message">
                {searchTerm
                  ? 'No orders match your search.'
                  : 'You have no orders yet.'}
              </div>
            ) : (
              <div className="orders-table-container" ref={printComponentRef}>
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Paid</th>
                      <th>Delivered</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order._id}>
                        <td>{order._id}</td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td>${order.totalPrice.toFixed(2)}</td>
                        <td>
                          {order.isPaid ? (
                            <span className="status-indicator paid">
                              {formatDate(order.paidAt)}
                            </span>
                          ) : (
                            <span className="status-indicator not-paid">
                              Not Paid
                            </span>
                          )}
                        </td>
                        <td>
                          {order.isDelivered ? (
                            <span className="status-indicator delivered">
                              {formatDate(order.deliveredAt)}
                            </span>
                          ) : (
                            <span className="status-indicator not-delivered">
                              Not Delivered
                            </span>
                          )}
                        </td>
                        <td>
                          <span
                            className="order-status"
                            style={{ backgroundColor: getStatusColor(order.status) }}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <Link to={`/order/${order._id}`} className="view-details-button">
                            <FaEye /> Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BuyerOrderHistory;
