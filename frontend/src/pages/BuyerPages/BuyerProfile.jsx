import React, { useEffect, useState } from 'react'; 
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'; 
import axios from 'axios'; 
import { Edit, User, Mail, Phone, MapPin, Camera, Loader2, CheckCircle, X, Calendar, ShoppingBag, Clock } from 'lucide-react';
import BuyerSidebar from './BuyerSidebar'; 
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
  const [errorMsg, setErrorMsg] = useState(''); 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState(null);
  const location = useLocation();
  
  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const paymentSuccess = queryParams.get('success');
  const orderId = queryParams.get('orderId');
 
  useEffect(() => { 
    const fetchProfile = async () => { 
      try { 
        setIsLoading(true);
        const res = await axios.get('/api/buyers/profile', { 
          withCredentials: true, 
        }); 
        setUser(res.data);
        setErrorMsg('');
      } catch (error) { 
        const msg = error.response?.data?.message || 'Failed to load profile'; 
        setErrorMsg(msg); 
      } finally {
        setIsLoading(false);
      }
    }; 
 
    fetchProfile(); 
  }, []); 
 
  // Check for payment success parameters
  useEffect(() => {
    if (paymentSuccess === 'true' && orderId) {
      setShowPaymentSuccess(true);
      setSuccessOrderId(orderId);
      
      // Clear the URL params after showing notification
      window.history.replaceState({}, document.title, '/buyer/profile');
      
      // Auto-hide notification after 8 seconds
      const timer = setTimeout(() => {
        setShowPaymentSuccess(false);
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [paymentSuccess, orderId]);

  const getActiveTab = () => { 
    if (!location || !location.pathname) return 'profile';
    if (location.pathname.includes('/orders')) return 'orders';
    return 'profile';
  };
 
  return ( 
    <div className="flex bg-gradient-to-br from-emerald-50 to-teal-50 min-h-screen"> 
      <BuyerSidebar activeTab={getActiveTab()} /> 
      
      {/* Payment Success Notification */}
      {showPaymentSuccess && (
        <SuccessNotification 
          orderId={successOrderId} 
          onClose={() => setShowPaymentSuccess(false)} 
        />
      )}
       
      <div className="flex-1 p-4 md:p-6"> 
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mr-3 shadow-sm">
              <User size={20} className="text-white" />
            </div>
            {user ? `Welcome, ${user.name.split(' ')[0]}!` : 'Welcome!'}
          </h1>
        </div>

        <Routes> 
          <Route  
            path="/"  
            element={
              <ProfileInfo 
                user={isLoading ? null : user} 
                errorMsg={errorMsg} 
                onEditProfile={() => setIsEditModalOpen(true)}
              />
            }  
          /> 
          <Route
            path="/orders"
            element={<BuyerOrders />}
          />
          <Route  
            path="*"  
            element={<Navigate to="/buyer/profile" replace />}  
          /> 
        </Routes>

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
  ); 
}; 
 
export default BuyerProfile;