import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Clock,
  Filter,
  Check,
  Eye,
} from 'lucide-react';

// Import background image (same as DeliveryRequests.jsx)
import backgroundImage from '../../assets/storage-vegetation.jpg';

const DriverNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  // Mock API fetch (replace with real endpoint)
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        // Replace with actual API call, e.g.:
        // const response = await axios.get('/api/notifications', {
        //   headers: { 'Authorization': `Bearer ${token}` },
        //   withCredentials: true,
        // });
        // Mock data for now
        const mockNotifications = [
          {
            id: 1,
            message: 'New delivery request #1234 assigned to you.',
            type: 'new',
            isRead: false,
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            deliveryId: '1234',
          },
          {
            id: 2,
            message: 'Delivery #5678 has been accepted by you.',
            type: 'info',
            isRead: true,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            deliveryId: '5678',
          },
          {
            id: 3,
            message: 'Delivery #9012 status updated to "In Transit".',
            type: 'update',
            isRead: false,
            createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            deliveryId: '9012',
          },
        ];
        setNotifications(mockNotifications);
        setFilteredNotifications(mockNotifications);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        let errorMessage = 'Failed to load notifications';
        if (error.response) {
          errorMessage = `Server error: ${error.response.status} - ${error.response.data.message || 'Internal Server Error'}`;
        } else if (error.request) {
          errorMessage = 'No response from server. Please check if the backend is running at http://localhost:5000.';
        } else {
          errorMessage = `Request error: ${error.message}`;
        }
        setError(errorMessage);
        toast.error(errorMessage);
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  // Filter notifications based on type
  useEffect(() => {
    if (filter === 'all') {
      setFilteredNotifications(notifications);
    } else if (filter === 'unread') {
      setFilteredNotifications(notifications.filter((n) => !n.isRead));
    } else if (filter === 'read') {
      setFilteredNotifications(notifications.filter((n) => n.isRead));
    }
  }, [filter, notifications]);

  // Handle marking a notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      // Replace with actual API call, e.g.:
      // await axios.patch(`/api/notifications/${notificationId}/read`, {}, {
      //   headers: { 'Authorization': `Bearer ${token}` },
      //   withCredentials: true,
      // });
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
      toast.success('Notification marked as read', { position: 'top-right' });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      toast.error(`Failed to mark as read: ${error.message}`, {
        position: 'top-right',
      });
    }
  };

  // Handle viewing delivery details (mock navigation)
  const handleViewDelivery = (deliveryId) => {
    // Replace with actual navigation or action
    toast('Navigating to delivery #' + deliveryId, { position: 'top-right' });
    // Example: navigate(`/drivers/delivery/${deliveryId}`);
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 mb-4"></div>
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-800 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-xl font-bold mb-2">Notifications Loading Failed</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative p-6">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-6 text-white flex items-center">
            <Bell className="mr-3" /> Driver Notifications
          </h1>

          {/* Filter Section */}
          <div className="mb-6 bg-white/90 shadow-md rounded-lg p-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="text-green-500" />
              <label htmlFor="filter" className="font-semibold text-gray-700">
                Filter Notifications
              </label>
            </div>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded px-2 py-1 bg-white"
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
            <button
              onClick={() => setFilter('all')}
              className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
            >
              Reset
            </button>
          </div>

          {filteredNotifications.length === 0 ? (
            <div className="bg-white/90 shadow-md rounded-lg p-8 text-center">
              <Bell className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600 text-lg">No notifications available</p>
              <p className="text-gray-500 mt-2">
                Check back later for updates
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white/90 border border-gray-100 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-xl ${
                    !notification.isRead ? 'border-l-4 border-green-500' : ''
                  }`}
                >
                  <div className="p-6">
                    {/* Notification Header */}
                    <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                          {notification.type === 'new' && (
                            <CheckCircle className="mr-2 text-green-500" size={20} />
                          )}
                          {notification.type === 'info' && (
                            <AlertCircle className="mr-2 text-blue-500" size={20} />
                          )}
                          {notification.type === 'update' && (
                            <Clock className="mr-2 text-yellow-500" size={20} />
                          )}
                          {notification.message}
                        </h2>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock className="mr-2 text-gray-400" size={16} />
                          {new Date(notification.createdAt).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </div>
                      </div>
                      {!notification.isRead && (
                        <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                          Unread
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
                        >
                          <Check className="mr-2" size={16} />
                          Mark as Read
                        </button>
                      )}
                      <button
                        onClick={() =>
                          handleViewDelivery(notification.deliveryId)
                        }
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                      >
                        <Eye className="mr-2" size={16} />
                        View Delivery
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverNotifications;