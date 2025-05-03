import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ShoppingCart, 
  User, 
  LogOut, 
  Leaf, 
  HelpCircle, 
  Briefcase, 
  Search, 
  Menu,
  BarChart2,
  Package,
  CreditCard,
  Truck,
  Star,
  Bell,
  Settings,
  Heart,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  MessageSquare
} from 'lucide-react';
import ComplaintForm from '../../components/ComplaintForm';

const BuyerDashboard = ({ setUser }) => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    favoriteProducts: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching dashboard data...');
        
        const [ordersRes, statsRes] = await Promise.all([
          axios.get('/api/v1/orders/my-orders', { withCredentials: true }),
          axios.get('/api/v1/buyers/stats', { withCredentials: true })
        ]);

        console.log('Orders response:', ordersRes.data);
        console.log('Stats response:', statsRes.data);

        if (ordersRes.data && statsRes.data) {
          setRecentOrders(ordersRes.data.slice(0, 5));
          setStats(statsRes.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        console.error('Error response:', error.response);
        if (error.response?.status === 401) {
          setError('Your session has expired. Please log in again.');
          setTimeout(() => {
            setUser(null);
            navigate('/buyer/login');
          }, 2000);
        } else {
          setError('Failed to load dashboard data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate, setUser]);

  const handleLogout = () => {
    setUser(null);
    navigate('/buyer/login');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* New Sidebar */}
      <div className={`bg-gradient-to-b from-emerald-900 to-teal-900 text-white transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'} shadow-xl flex-shrink-0`}>
        <div className="flex flex-col h-full">
          {/* Logo and Toggle */}
          <div className="p-4 flex items-center justify-between border-b border-emerald-800">
            {!isSidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <Leaf className="h-8 w-8 text-emerald-300" />
                <h2 className="text-xl font-bold text-white">Farm Fresh</h2>
              </div>
            )}
            {isSidebarCollapsed && <Leaf className="h-8 w-8 text-emerald-300 mx-auto" />}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-emerald-800 transition-colors"
            >
              {isSidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4">
            <ul className="space-y-2 px-2">
              <li>
                <NavLink
                  to="/buyer/dashboard"
                  className={({ isActive }) => 
                    `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-800 text-white'
                        : 'text-emerald-200 hover:bg-emerald-800'
                    }`
                  }
                >
                  <BarChart2 className="h-5 w-5" />
                  {!isSidebarCollapsed && <span className="ml-3">Dashboard</span>}
                </NavLink>
              </li>
              
              <li>
                <NavLink
                  to="/buyer/orders"
                  className={({ isActive }) => 
                    `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-800 text-white'
                        : 'text-emerald-200 hover:bg-emerald-800'
                    }`
                  }
                >
                  <Package className="h-5 w-5" />
                  {!isSidebarCollapsed && <span className="ml-3">My Orders</span>}
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/buyer/wishlist"
                  className={({ isActive }) => 
                    `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-800 text-white'
                        : 'text-emerald-200 hover:bg-emerald-800'
                    }`
                  }
                >
                  <Heart className="h-5 w-5" />
                  {!isSidebarCollapsed && <span className="ml-3">Wishlist</span>}
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/buyer/complaints"
                  className={({ isActive }) => 
                    `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-800 text-white'
                        : 'text-emerald-200 hover:bg-emerald-800'
                    }`
                  }
                >
                  <MessageSquare className="h-5 w-5" />
                  {!isSidebarCollapsed && <span className="ml-3">Complaints</span>}
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/buyer/notifications"
                  className={({ isActive }) => 
                    `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-800 text-white'
                        : 'text-emerald-200 hover:bg-emerald-800'
                    }`
                  }
                >
                  <Bell className="h-5 w-5" />
                  {!isSidebarCollapsed && <span className="ml-3">Notifications</span>}
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/buyer/settings"
                  className={({ isActive }) => 
                    `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-800 text-white'
                        : 'text-emerald-200 hover:bg-emerald-800'
                    }`
                  }
                >
                  <Settings className="h-5 w-5" />
                  {!isSidebarCollapsed && <span className="ml-3">Settings</span>}
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-emerald-800">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 rounded-lg text-emerald-200 hover:bg-emerald-800 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              {!isSidebarCollapsed && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Top Bar */}
        <div className="bg-white/80 backdrop-blur-sm shadow-sm p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          {error && (
            <div className="mb-8 bg-red-50 text-red-700 p-4 rounded-lg border-l-4 border-red-600 flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Orders</p>
                      <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.totalOrders}</h3>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-full">
                      <Package className="h-6 w-6 text-emerald-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Spent</p>
                      <h3 className="text-2xl font-bold text-gray-800 mt-1">
                        LKR {stats.totalSpent.toLocaleString()}
                      </h3>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-full">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Pending Orders</p>
                      <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.pendingOrders}</h3>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-full">
                      <Truck className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Favorite Products</p>
                      <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.favoriteProducts}</h3>
                    </div>
                    <div className="p-3 bg-red-50 rounded-full">
                      <Heart className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Orders and Complaint Form */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                          <th className="pb-3 font-medium">Order ID</th>
                          <th className="pb-3 font-medium">Date</th>
                          <th className="pb-3 font-medium">Status</th>
                          <th className="pb-3 font-medium">Total</th>
                          <th className="pb-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {recentOrders.length > 0 ? (
                          recentOrders.map((order) => (
                            <tr key={order._id} className="text-sm hover:bg-gray-50/50 transition-colors">
                              <td className="py-4 text-gray-600">#{order._id.slice(-6)}</td>
                              <td className="py-4 text-gray-600">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  order.status === 'Delivered' 
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : order.status === 'Processing'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="py-4 text-gray-600">
                                LKR {order.totalPrice.toLocaleString()}
                              </td>
                              <td className="py-4">
                                <Link
                                  to={`/order/${order._id}`}
                                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                                >
                                  View Details
                                </Link>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="py-8 text-center text-gray-500">
                              No recent orders found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Complaint Form */}
                <ComplaintForm />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard; 