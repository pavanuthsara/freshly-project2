import React, { useEffect, useState } from 'react'; 
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'; 
import axios from 'axios'; 
import { Edit, User, Mail, Phone, MapPin, Camera, Loader2, CheckCircle } from 'lucide-react';
import BuyerSidebar from './BuyerSidebar'; 
import BuyerOrders from './BuyerOrders';
import './BuyerProfile.css'; 

// Success notification component for payment success
const SuccessNotification = ({ orderId, onClose }) => {
  return (
    <div className="success-notification">
      <div className="success-icon">
        <CheckCircle size={24} color="#10b981" />
      </div>
      <div className="success-content">
        <h4>Payment Successful!</h4>
        <p>Your order #{orderId} has been placed and is being processed.</p>
      </div>
      <button className="close-notification" onClick={onClose} aria-label="Close notification">
        &times;
      </button>
    </div>
  );
};

const ProfileInfo = ({ user, errorMsg, onEditProfile }) => { 
  if (errorMsg) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h3>Something went wrong</h3>
          <p>{errorMsg}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="loading-container">
        <Loader2 size={32} className="loading-spinner" />
        <p>Loading your profile...</p>
      </div>
    );
  }
  
  return ( 
    <div className="profile-info-container"> 
      <div className="profile-header">
        <h2>Buyer Profile</h2>
        <button 
          onClick={onEditProfile} 
          className="edit-profile-btn"
          aria-label="Edit profile"
        >
          <Edit size={20} /> <span>Edit Profile</span>
        </button>
      </div>
      
      <div className="profile-content-wrapper">
        <div className="profile-avatar-section">
          {user.profilePicture ? (
            <div className="profile-avatar">
              <img 
                src={user.profilePicture} 
                alt={`${user.name}'s profile`} 
                className="avatar-image" 
              />
              <button 
                className="change-avatar-btn"
                onClick={onEditProfile}
                aria-label="Change profile picture"
              >
                <Camera size={16} />
              </button>
            </div>
          ) : (
            <div className="profile-avatar placeholder-avatar">
              <User size={40} />
              <button 
                className="add-avatar-btn"
                onClick={onEditProfile}
                aria-label="Add profile picture"
              >
                <Camera size={16} />
              </button>
            </div>
          )}
          <h3 className="profile-name">{user.name}</h3>
          <p className="account-status">Active Buyer</p>
        </div>

        <div className="profile-details-section">
          <h3 className="section-title">Contact Information</h3>
          
          <div className="profile-grid">
            <div className="profile-field"> 
              <div className="field-icon">
                <Mail size={18} />
              </div>
              <div className="field-content">
                <span className="field-label">Email Address</span> 
                <span className="field-value">{user.email}</span>
              </div> 
            </div> 
            
            <div className="profile-field"> 
              <div className="field-icon">
                <Phone size={18} />
              </div>
              <div className="field-content">
                <span className="field-label">Phone Number</span> 
                <span className="field-value">
                  {user.phoneNumber || 
                    <span className="missing-info">
                      Not provided <button onClick={onEditProfile} className="add-info-btn">Add</button>
                    </span>
                  }
                </span>
              </div> 
            </div>
            
            <div className="profile-field"> 
              <div className="field-icon">
                <MapPin size={18} />
              </div>
              <div className="field-content">
                <span className="field-label">Shipping Address</span> 
                <span className="field-value">
                  {user.address || 
                    <span className="missing-info">
                      Not provided <button onClick={onEditProfile} className="add-info-btn">Add</button>
                    </span>
                  }
                </span>
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="edit-profile-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Your Profile</h2>
          <button className="close-modal-btn" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="avatar-upload-section">
            <div className="avatar-preview">
              {previewImage ? (
                <img src={previewImage} alt="Profile preview" />
              ) : (
                <div className="avatar-placeholder">
                  <User size={40} />
                </div>
              )}
            </div>
            
            <div className="avatar-upload-controls">
              <label htmlFor="profile-image" className="upload-btn">
                <Camera size={16} /> Choose Image
              </label>
              <input 
                type="file" 
                id="profile-image" 
                accept="image/*" 
                onChange={handleImageChange}
                className="hidden-input"
              />
              {previewImage && (
                <button 
                  type="button" 
                  className="remove-image-btn"
                  onClick={() => {
                    setPreviewImage(null);
                    setFormData(prev => ({ ...prev, profilePicture: null }));
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number (optional)</label>
            <input 
              type="tel" 
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className={errors.phoneNumber ? 'input-error' : ''}
            />
            {errors.phoneNumber && <p className="error-text">{errors.phoneNumber}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Shipping Address (optional)</label>
            <textarea 
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your shipping address"
              rows="3"
              className={errors.address ? 'input-error' : ''}
            />
            {errors.address && <p className="error-text">{errors.address}</p>}
          </div>
          
          <div className="modal-actions">
            <button 
              type="button" 
              onClick={onClose} 
              className="cancel-btn"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="loading-spinner" /> 
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
    <div className="buyer-profile-container"> 
      <BuyerSidebar activeTab={getActiveTab()} /> 
      
      {/* Payment Success Notification */}
      {showPaymentSuccess && (
        <SuccessNotification 
          orderId={successOrderId} 
          onClose={() => setShowPaymentSuccess(false)} 
        />
      )}
       
      <div className="profile-content"> 
        <div className="profile-top-bar">
          <h1 className="welcome-heading">
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