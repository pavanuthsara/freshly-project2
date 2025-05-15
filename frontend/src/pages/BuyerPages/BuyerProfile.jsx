import React, { useEffect, useState } from 'react'; 
import { Routes, Route, useLocation, NavLink } from 'react-router-dom'; 
import axios from 'axios'; 
import { 
  Edit, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Loader2, 
  CheckCircle, 
  X, 
  Calendar, 
  ShoppingBag, 
  Clock,
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
  MessageSquare,
  LogOut
} from 'lucide-react';
import BuyerOrders from './BuyerOrders';

// Success notification component for payment success
const SuccessNotification = ({ orderId, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center bg-white rounded-lg shadow-xl p-4 border-l-4 border-emerald-500 max-w-md animate-fade-in-down">
      <div className="shrink-0 mr-3">
        <CheckCircle size={24} className="text-emerald-500" />
      </div>
      <div className="flex-1 mr-2">
        <h4 className="font-medium text-gray-900">Payment Successful!</h4>
        <p className="text-sm text-gray-600">Your order #{orderId} has been placed and is being processed.</p>
      </div>
      <button 
        className="text-gray-400 hover:text-gray-600 transition-colors" 
        onClick={onClose} 
        aria-label="Close notification"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

const ProfileInfo = ({ user, errorMsg, onEditProfile }) => { 
  if (errorMsg) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg p-6 shadow-sm">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-700 mb-2">Something went wrong</h3>
          <p className="text-red-600 mb-4">{errorMsg}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-sm">
        <Loader2 size={32} className="text-emerald-600 animate-spin mb-3" />
        <p className="text-gray-600">Loading your profile...</p>
      </div>
    );
  }
  
  return ( 
    <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden"> 
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium text-white">Buyer Profile</h2>
          <button 
            onClick={onEditProfile} 
            className="flex items-center bg-white text-emerald-700 hover:bg-emerald-50 px-4 py-2 rounded-md transition-colors shadow-sm"
            aria-label="Edit profile"
          >
            <Edit size={16} className="mr-2" />
            Edit Profile
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex flex-col items-center mb-6 md:mb-0 md:mr-8">
            {user.profilePicture ? (
              <img 
                src={user.profilePicture} 
                alt={`${user.name}'s profile`} 
                className="w-28 h-28 rounded-full object-cover border-4 border-emerald-100 shadow-md" 
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center shadow-md">
                <User size={36} className="text-emerald-600" />
              </div>
            )}
            <h3 className="text-xl font-medium text-gray-800 mt-4">{user.name}</h3>
            <div className="bg-emerald-100 text-emerald-700 text-sm px-3 py-1 rounded-full mt-2 shadow-sm">
              Active Buyer
            </div>
          </div>

          <div className="flex-1 divide-y divide-gray-100">
            <div className="py-4">
              <h3 className="text-lg font-medium text-gray-800 mb-4 border-b border-gray-100 pb-2 flex items-center">
                <Mail size={18} className="text-emerald-600 mr-2" />
                Contact Information
              </h3>
              
              <div className="space-y-5">
                <div className="flex items-start"> 
                  <div className="bg-emerald-50 text-emerald-600 p-2 rounded-md mr-4">
                    <Mail size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Email Address</div> 
                    <div className="text-gray-800 font-medium">{user.email}</div>
                  </div> 
                </div> 
                
                <div className="flex items-start"> 
                  <div className="bg-emerald-50 text-emerald-600 p-2 rounded-md mr-4">
                    <Phone size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Phone Number</div> 
                    {user.phoneNumber ? (
                      <div className="text-gray-800 font-medium">{user.phoneNumber}</div>
                    ) : (
                      <div className="flex items-center">
                        <span className="text-gray-400 mr-2">Not provided</span>
                        <button 
                          onClick={onEditProfile} 
                          className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div> 
                </div>
                
                <div className="flex items-start"> 
                  <div className="bg-emerald-50 text-emerald-600 p-2 rounded-md mr-4">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Shipping Address</div> 
                    {user.address ? (
                      <div className="text-gray-800 font-medium">{user.address}</div>
                    ) : (
                      <div className="flex items-center">
                        <span className="text-gray-400 mr-2">Not provided</span>
                        <button 
                          onClick={onEditProfile} 
                          className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div> 
                </div>
              </div>
            </div>

            <div className="py-4">
              <h3 className="text-lg font-medium text-gray-800 mb-4 border-b border-gray-100 pb-2 flex items-center">
                <ShoppingBag size={18} className="text-emerald-600 mr-2" />
                Account Summary
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-emerald-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <ShoppingBag size={18} className="text-emerald-600 mr-2" />
                    <span className="text-sm font-medium text-emerald-700">Total Orders</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {user.totalOrders || '0'}
                  </div>
                </div>
                
                <div className="bg-emerald-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Calendar size={18} className="text-emerald-600 mr-2" />
                    <span className="text-sm font-medium text-emerald-700">Member Since</span>
                  </div>
                  <div className="text-md font-medium text-gray-800">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'N/A'}
                  </div>
                </div>
                
                <div className="bg-emerald-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Clock size={18} className="text-emerald-600 mr-2" />
                    <span className="text-sm font-medium text-emerald-700">Last Order</span>
                  </div>
                  <div className="text-md font-medium text-gray-800">
                    {user.lastOrderDate ? new Date(user.lastOrderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'No orders yet'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> 
  ); 
}; 

const EditProfileModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
    address: user.address || '',
    profilePicture: user.profilePicture || null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(user.profilePicture || null);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (formData.phoneNumber && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({
          ...prev,
          profilePicture: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.put('/api/buyers/profile', formData, {
        withCredentials: true
      });
      onSave(response.data);
    } catch (error) {
      console.error('Update profile error', error);
      const serverErrors = error.response?.data?.errors || {};
      setErrors(prev => ({ ...prev, ...serverErrors }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-auto overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4">
          <h2 className="text-xl font-semibold">Edit Your Profile</h2>
          <button className="text-white hover:text-emerald-100 transition-colors" onClick={onClose} aria-label="Close modal">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="mb-4 relative">
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt="Profile preview" 
                  className="w-28 h-28 rounded-full object-cover border-4 border-emerald-100 shadow-md"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center shadow-md">
                  <User size={42} className="text-emerald-600" />
                </div>
              )}
              
              <div className="absolute bottom-0 right-0">
                <label htmlFor="profile-image" className="h-10 w-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-md cursor-pointer transition-colors">
                  <Camera size={18} />
                </label>
                <input 
                  type="file" 
                  id="profile-image" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
            
            {previewImage && (
              <button 
                type="button" 
                className="text-red-600 hover:text-red-700 text-sm font-medium mt-2"
                onClick={() => {
                  setPreviewImage(null);
                  setFormData(prev => ({ ...prev, profilePicture: null }));
                }}
              >
                Remove photo
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'} rounded-md focus:outline-none focus:ring-2 shadow-sm`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'} rounded-md focus:outline-none focus:ring-2 shadow-sm`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number (optional)</label>
              <input 
                type="tel" 
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className={`w-full px-3 py-2 border ${errors.phoneNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'} rounded-md focus:outline-none focus:ring-2 shadow-sm`}
              />
              {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Shipping Address (optional)</label>
              <textarea 
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your shipping address"
                rows="3"
                className={`w-full px-3 py-2 border ${errors.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'} rounded-md focus:outline-none focus:ring-2 shadow-sm`}
              />
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2 rounded-md transition-colors shadow-md flex items-center justify-center min-w-[120px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" /> 
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
 
const BuyerProfile = () => { 
  const [user, setUser] = useState(null); 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  
  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const paymentSuccess = queryParams.get('success');
  const orderId = queryParams.get('orderId');
 
  useEffect(() => { 
    const fetchProfile = async () => { 
      try { 
        const res = await axios.get('/api/buyers/profile', { 
          withCredentials: true, 
        }); 
        setUser(res.data);
      } catch (error) { 
        console.error('Failed to load profile', error);
      }
    }; 
 
    fetchProfile(); 
  }, []); 
 
  // Check for payment success parameters
  useEffect(() => {
    if (paymentSuccess === 'true' && orderId) {
      setShowPaymentSuccess(true);
      setSuccessOrderId(orderId);
      
      // Auto-hide notification after 8 seconds
      const timer = setTimeout(() => {
        setShowPaymentSuccess(false);
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [paymentSuccess, orderId]);

  return ( 
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Dashboard Sidebar */}
      <div className={`bg-gradient-to-b from-emerald-900 to-teal-900 text-white transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'} shadow-xl flex-shrink-0`}>
        <div className="flex flex-col h-full">
          {/* Logo and Toggle */}
          <div className="p-4 flex items-center justify-between border-b border-emerald-800">
            {!isSidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <User className="h-8 w-8 text-emerald-300" />
                <h2 className="text-xl font-bold text-white">My Profile</h2>
              </div>
            )}
            {isSidebarCollapsed && <User className="h-8 w-8 text-emerald-300 mx-auto" />}
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
                  to="/buyer/profile"
                  className={({ isActive }) => 
                    `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-800 text-white'
                        : 'text-emerald-200 hover:bg-emerald-800'
                    }`
                  }
                >
                  <User className="h-5 w-5" />
                  {!isSidebarCollapsed && <span className="ml-3">Profile</span>}
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
              onClick={() => {
                // Handle logout
                localStorage.removeItem('user');
                window.location.href = '/buyer/login';
              }}
              className="flex items-center w-full px-4 py-3 text-emerald-200 hover:bg-emerald-800 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              {!isSidebarCollapsed && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Payment Success Notification */}
        {showPaymentSuccess && (
          <SuccessNotification 
            orderId={successOrderId} 
            onClose={() => setShowPaymentSuccess(false)} 
          />
        )}
        <div className="w-full max-w-3xl mx-auto">
          <div className="bg-white/90 rounded-2xl shadow-xl p-8 mb-8">
            {/* Profile Picture & Name */}
            <div className="flex flex-col items-center mb-8">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-emerald-100 shadow-md mb-4" />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center shadow-md mb-4">
                  <User size={36} className="text-emerald-600" />
                </div>
              )}
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{user?.name}</h2>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg shadow transition-colors"
              >
                <Edit size={16} className="inline mr-2" />Edit Profile
              </button>
            </div>
            {/* Two-column grid for info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Info */}
              <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4 border border-gray-100">
                <h3 className="text-lg font-semibold text-emerald-700 mb-4 flex items-center"><Mail size={18} className="mr-2" />Contact Information</h3>
                <div className="flex items-center gap-3">
                  <Mail className="text-emerald-500" size={18} />
                  <span className="text-gray-700 font-medium">{user?.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-emerald-500" size={18} />
                  <span className="text-gray-700 font-medium">{user?.phoneNumber || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-emerald-500" size={18} />
                  <span className="text-gray-700 font-medium">{user?.address || 'Not provided'}</span>
                </div>
              </div>
              {/* Account Summary */}
              <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4 border border-gray-100">
                <h3 className="text-lg font-semibold text-emerald-700 mb-4 flex items-center"><ShoppingBag size={18} className="mr-2" />Account Summary</h3>
                <div className="flex items-center gap-3">
                  <ShoppingBag className="text-emerald-500" size={18} />
                  <span className="text-gray-700">Total Orders:</span>
                  <span className="font-bold text-gray-900">{user?.totalOrders || '0'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="text-emerald-500" size={18} />
                  <span className="text-gray-700">Member Since:</span>
                  <span className="font-bold text-gray-900">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="text-emerald-500" size={18} />
                  <span className="text-gray-700">Last Order:</span>
                  <span className="font-bold text-gray-900">{user?.lastOrderDate ? new Date(user.lastOrderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'No orders yet'}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Edit Modal */}
          {isEditModalOpen && user && (
            <EditProfileModal 
              user={user}
              onClose={() => setIsEditModalOpen(false)}
              onSave={(updatedUser) => {
                setUser(updatedUser);
                setIsEditModalOpen(false);
              }}
            />
          )}
        </div>
      </div> 
    </div> 
  ); 
}; 

export default BuyerProfile;