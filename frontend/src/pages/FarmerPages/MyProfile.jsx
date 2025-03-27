import React, { useState, useEffect } from 'react';
import { User, MapPin, Edit, Save, X } from 'lucide-react';
import axios from 'axios';

const ProfileSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Validate name (only letters)
  const validateName = (name) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    return nameRegex.test(name);
  };

  // Validate phone number (exactly 10 digits)
  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  // Validate NIC number (10 or 12 digits followed by V or v)
  const validateNIC = (nic) => {
    const nicRegex = /^(\d{10}[Vv]|\d{12})$/;
    return nicRegex.test(nic);
  };

  // Fetch farmer profile on component mount
  useEffect(() => {
    const fetchFarmerProfile = async () => {
      try {
        const response = await axios.get('/api/farmers/profile', {
          withCredentials: true
        });

        setProfileData(response.data.farmer);
        setEditedData(response.data.farmer);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch profile. Please log in again.');
        setLoading(false);
        console.error('Profile fetch error:', err);
      }
    };

    fetchFarmerProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    // Clear previous validation errors
    setValidationErrors({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(profileData);
    // Clear validation errors
    setValidationErrors({});
  };

  const handleSave = async () => {
    // Validate all fields before saving
    const errors = {};

    // Validate name
    if (!validateName(editedData.name)) {
      errors.name = 'Name should contain only letters';
    }

    // Validate phone
    if (!validatePhone(editedData.phone)) {
      errors.phone = 'Phone number must be exactly 10 digits';
    }

    // Validate NIC
    if (!validateNIC(editedData.nic)) {
      errors.nic = 'NIC must be 10 digits followed by V/v or 12 digits';
    }

    // If there are validation errors, set them and prevent saving
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const response = await axios.put('/api/farmers/profile', {
        name: editedData.name,
        phone: editedData.phone,
        nic: editedData.nic,
        farmAddress: editedData.farmAddress
      }, {
        withCredentials: true
      });

      setProfileData(response.data.farmer);
      setIsEditing(false);
      // Clear validation errors
      setValidationErrors({});
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Profile update error:', err);
    }
  };

  const handleInputChange = (e, field, subfield = null) => {
    const value = e.target.value;
    
    // Clear specific validation error when user starts typing
    if (validationErrors[field]) {
      const newErrors = {...validationErrors};
      delete newErrors[field];
      setValidationErrors(newErrors);
    }

    if (subfield) {
      setEditedData(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [subfield]: value
        }
      }));
    } else {
      setEditedData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const renderField = (label, value, field, subfield = null) => {
    const errorMessage = subfield 
      ? validationErrors[field]?.[subfield] 
      : validationErrors[field];

    return (
      <div className="mb-4">
        <h2 className="text-green-700 font-semibold mb-1">{label}</h2>
        {isEditing ? (
          <>
            <input
              type="text"
              value={subfield ? editedData[field][subfield] : editedData[field]}
              onChange={(e) => handleInputChange(e, field, subfield)}
              className={`w-full px-2 py-1 border-b ${
                errorMessage 
                  ? 'border-red-500 focus:border-red-700' 
                  : 'border-green-200 focus:border-green-500'
              } focus:outline-none`}
            />
            {errorMessage && (
              <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
            )}
          </>
        ) : (
          <p className="text-gray-800">{value}</p>
        )}
      </div>
    );
  };
  // (Loading and error handling, return statement, etc.)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-green-600">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold text-green-800 flex items-center">
            <User className="mr-3 text-green-600" size={24} />
            My Profile
          </h1>
          
          {!isEditing ? (
            <button 
              onClick={handleEdit}
              className="flex items-center text-green-600 hover:text-green-800"
            >
              <Edit className="mr-1" size={18} /> Edit
            </button>
          ) : (
            <div className="flex space-x-2">
              <button 
                onClick={handleCancel}
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <X className="mr-1" size={18} /> Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center text-green-600 hover:text-green-800"
              >
                <Save className="mr-1" size={18} /> Save
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {renderField('Full Name', profileData.name, 'name')}
          {renderField('Email Address', profileData.email, 'email')}
          {renderField('Phone Number', profileData.phone, 'phone')}
          {renderField('NIC Number', profileData.nic, 'nic')}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-green-800 flex items-center">
            <MapPin className="mr-3 text-green-600" size={20} />
            Farm Address
          </h2>
          
          <div className="mt-4 space-y-4">
            {profileData.farmAddress && (
              <>
                {renderField('Street Number', profileData.farmAddress.streetNo, 'farmAddress', 'streetNo')}
                {renderField('City', profileData.farmAddress.city, 'farmAddress', 'city')}
                {renderField('District', profileData.farmAddress.district, 'farmAddress', 'district')}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;