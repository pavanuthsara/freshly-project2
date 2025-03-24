import React, { useEffect, useState } from 'react'; 
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'; 
import axios from 'axios'; 
import { Edit, LogOut } from 'lucide-react';
import BuyerSidebar from './BuyerSidebar'; 
import './BuyerProfile.css'; 

const ProfileInfo = ({ user, errorMsg, onEditProfile }) => { 
  return ( 
    <div className="profile-info-container"> 
      <div className="profile-header">
        <h2>Buyer Profile</h2>
        {user && (
          <button 
            onClick={onEditProfile} 
            className="edit-profile-btn"
          >
            <Edit size={20} /> Edit Profile
          </button>
        )}
      </div>

      {errorMsg && <p className="error-message">{errorMsg}</p>} 
      
      {user ? ( 
        <div className="profile-details"> 
          {user.profilePicture && (
            <div className="profile-avatar">
              <img 
                src={user.profilePicture} 
                alt={`${user.name}'s profile`} 
                className="avatar-image" 
              />
            </div>
          )}

          <div className="profile-grid">
            <div className="profile-field"> 
              <span className="field-label">Name:</span> 
              <span className="field-value">{user.name}</span> 
            </div> 
            <div className="profile-field"> 
              <span className="field-label">Email:</span> 
              <span className="field-value">{user.email}</span> 
            </div> 
            {user.phoneNumber && (
              <div className="profile-field"> 
                <span className="field-label">Phone:</span> 
                <span className="field-value">{user.phoneNumber}</span> 
              </div>
            )}
            {user.address && (
              <div className="profile-field"> 
                <span className="field-label">Address:</span> 
                <span className="field-value">{user.address}</span> 
              </div>
            )}
          </div>
        </div> 
      ) : ( 
        !errorMsg && <div className="loading">Loading profile...</div> 
      )} 
    </div> 
  ); 
}; 

const EditProfileModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber || '',
    address: user.address || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('/api/buyers/profile', formData, {
        withCredentials: true
      });
      onSave(response.data);
    } catch (error) {
      console.error('Update profile error', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="edit-profile-modal">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input 
              type="tel" 
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea 
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Save Changes</button>
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
  const location = useLocation(); 
 
  useEffect(() => { 
    const fetchProfile = async () => { 
      try { 
        const res = await axios.get('/api/buyers/profile', { 
          withCredentials: true, 
        }); 
        setUser(res.data); 
      } catch (error) { 
        const msg = error.response?.data?.message || 'Failed to load profile'; 
        setErrorMsg(msg); 
      } 
    }; 
 
    fetchProfile(); 
  }, []); 
 
  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const getActiveTab = () => { 
    if (!location || !location.pathname) return 'profile';
    return 'profile';
  };
 
  return ( 
    <div className="buyer-profile-container"> 
      <BuyerSidebar activeTab={getActiveTab()} /> 
       
      <div className="profile-content"> 
        <div className="profile-actions">
          <button 
            onClick={handleLogout} 
            className="logout-btn"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>

        <Routes> 
          <Route  
            path="/"  
            element={
              <ProfileInfo 
                user={user} 
                errorMsg={errorMsg} 
                onEditProfile={() => setIsEditModalOpen(true)}
              />
            }  
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
