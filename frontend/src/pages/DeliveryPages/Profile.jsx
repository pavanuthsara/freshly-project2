import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Truck,
  Edit,
  Loader2,
  AlertCircle,
  Save,
  X,
} from 'lucide-react';

// Import background image
import backgroundImage from '../../assets/delivery_dashboard.jpg';

// List of Sri Lankan districts from driver.model.js
const districts = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Galle', 'Matara', 'Hambantota',
  'Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu', 'Batticaloa',
  'Ampara', 'Trincomalee', 'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa',
  'Badulla', 'Monaragala', 'Ratnapura', 'Kegalle', 'Matale', 'Nuwara Eliya'
];

const Profile = () => {
  const [driverDetails, setDriverDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions from DriverSignInSignUp.jsx
  const validateName = (name) => /^[a-zA-Z\s-]+$/i.test(name);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/.test(password);
  const validateContactNumber = (phone) => /^(\+\d{1,3}[- ]?)?\d{10}$/.test(phone);
  const validateVehicleNumber = (vehicleNumber) => /^[A-Z]{2,4}\d{4}$/.test(vehicleNumber);

  // Fetch driver profile
  useEffect(() => {
    const fetchDriverProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        const response = await axios.get('/api/drivers/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          withCredentials: true,
        });
        const driver = response.data.driver || response.data;
        setDriverDetails(driver);
        setFormData({
          name: driver.name || '',
          email: driver.email || '',
          district: driver.district || '',
          contactNumber: driver.contactNumber || '',
          vehicleNumber: driver.vehicleNumber || '',
          vehicleCapacity: driver.vehicleCapacity || '',
          password: '',
          confirmPassword: '',
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError(error.response?.data?.message || error.message || 'Failed to load profile');
        setLoading(false);
      }
    };
    fetchDriverProfile();
  }, []);

  // Handle input changes with sanitization
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    switch (name) {
      case 'name':
        processedValue = value.replace(/[^a-zA-Z\s-]/g, '').slice(0, 100);
        break;
      case 'district':
        processedValue = value; // No sanitization needed as it's a dropdown
        break;
      case 'contactNumber':
        processedValue = value.replace(/[^0-9]/g, '').slice(0, 10);
        break;
      case 'vehicleNumber':
        processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (!/\d/.test(processedValue)) {
          processedValue = processedValue.slice(0, 3);
        } else {
          const letters = processedValue.match(/[A-Z]{0,3}/)?.[0] || '';
          const numbers = processedValue.match(/\d{0,4}$/)?.[0] || '';
          if (letters.length >= 2 && letters.length <= 3) {
            processedValue = letters + numbers;
          } else {
            processedValue = letters.slice(0, 3) + numbers;
          }
        }
        break;
      case 'vehicleCapacity':
        processedValue = value.replace(/[^0-9]/g, '').slice(0, 5);
        break;
      default:
        processedValue = value;
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim() || !validateName(formData.name)) {
      errors.name = 'Please enter a valid name (letters, spaces, or hyphens only)';
    }
    if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!districts.includes(formData.district)) {
      errors.district = 'Please select a valid district';
    }
    if (!formData.contactNumber || !validateContactNumber(formData.contactNumber)) {
      errors.contactNumber = 'Please enter a valid 10-digit contact number';
    }
    if (!formData.vehicleNumber || !validateVehicleNumber(formData.vehicleNumber)) {
      errors.vehicleNumber = 'Please enter a valid vehicle number (e.g., ABC1234)';
    }
    if (
      !formData.vehicleCapacity ||
      isNaN(formData.vehicleCapacity) ||
      parseInt(formData.vehicleCapacity) < 100 ||
      parseInt(formData.vehicleCapacity) > 30000
    ) {
      errors.vehicleCapacity = 'Vehicle capacity must be between 100 and 30,000 kg';
    }
    if (formData.password) {
      if (!validatePassword(formData.password)) {
        errors.password =
          'Password must be at least 8 characters with one uppercase, one lowercase, one number, and one special character';
      }
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form', { position: 'top-right' });
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const payload = { ...formData };
      // Remove password and confirmPassword from payload if empty
      if (!payload.password) {
        delete payload.password;
        delete payload.confirmPassword;
      } else {
        delete payload.confirmPassword;
      }

      const response = await axios.put('/api/drivers/profile', payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setDriverDetails(response.data.driver);
      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
      setIsEditing(false);
      toast.success('Profile updated successfully', { position: 'top-right' });
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile';
      toast.error(errorMessage, { position: 'top-right' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setFormErrors({});
    setFormData({
      name: driverDetails.name || '',
      email: driverDetails.email || '',
      district: driverDetails.district || '',
      contactNumber: driverDetails.contactNumber || '',
      vehicleNumber: driverDetails.vehicleNumber || '',
      vehicleCapacity: driverDetails.vehicleCapacity || '',
      password: '',
      confirmPassword: '',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat relative flex justify-center items-center">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative flex items-center space-x-2 text-white animate-pulse">
          <Loader2 className="animate-spin text-green-500" size={32} />
          <span className="text-lg">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative bg-white/90 p-8 rounded-xl shadow-lg text-center max-w-md">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!driverDetails) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat relative flex justify-center items-center">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative flex items-center space-x-2 text-white bg-white/90 p-6 rounded-xl shadow-lg">
          <AlertCircle className="text-yellow-500" size={32} />
          <span className="text-lg">No driver details available</span>
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
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/95 shadow-xl rounded-xl p-8 animate-fade-in">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-green-700 flex items-center">
                <User className="mr-3 text-green-500" size={32} />
                Driver Profile
              </h1>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors transform hover:scale-105"
                >
                  <Edit className="mr-2" size={20} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-4">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors transform hover:scale-105 ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Save className="mr-2" size={20} />
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors transform hover:scale-105"
                  >
                    <X className="mr-2" size={20} />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center font-semibold text-gray-700 mb-1">
                      <User className="mr-2 text-green-500" size={20} />
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                        formErrors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your name"
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center font-semibold text-gray-700 mb-1">
                      <Mail className="mr-2 text-blue-500" size={20} />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                        formErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email"
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center font-semibold text-gray-700 mb-1">
                      <Phone className="mr-2 text-purple-500" size={20} />
                      Contact Number
                    </label>
                    <input
                      type="text"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                        formErrors.contactNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your contact number"
                    />
                    {formErrors.contactNumber && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.contactNumber}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="flex items-center font-semibold text-gray-700 mb-1">
                      <MapPin className="mr-2 text-red-500" size={20} />
                      District
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                        formErrors.district ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select a district</option>
                      {districts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                    {formErrors.district && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.district}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center font-semibold text-gray-700 mb-1">
                      <Truck className="mr-2 text-orange-500" size={20} />
                      Vehicle Number
                    </label>
                    <input
                      type="text"
                      name="vehicleNumber"
                      value={formData.vehicleNumber}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                        formErrors.vehicleNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter vehicle number"
                    />
                    {formErrors.vehicleNumber && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.vehicleNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center font-semibold text-gray-700 mb-1">
                      <Truck className="mr-2 text-teal-500" size={20} />
                      Vehicle Capacity (kg)
                    </label>
                    <input
                      type="number"
                      name="vehicleCapacity"
                      value={formData.vehicleCapacity}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                        formErrors.vehicleCapacity ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter vehicle capacity"
                      min="100"
                    />
                    {formErrors.vehicleCapacity && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.vehicleCapacity}</p>
                    )}
                  </div>
                </div>

                <div className="col-span-2 space-y-4">
                  <div>
                    <label className="flex items-center font-semibold text-gray-700 mb-1">
                      <User className="mr-2 text-gray-500" size={20} />
                      New Password (optional)
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                        formErrors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter new password (leave blank to keep current)"
                    />
                    {formErrors.password && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center font-semibold text-gray-700 mb-1">
                      <User className="mr-2 text-gray-500" size={20} />
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                        formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Confirm new password"
                    />
                    {formErrors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </form>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="flex items-start group hover:bg-green-50 p-3 rounded-lg transition-colors">
                    <User className="mr-3 mt-1 text-green-500 flex-shrink-0 group-hover:text-green-600" size={24} />
                    <div>
                      <p className="font-semibold text-gray-700">Name</p>
                      <p className="text-gray-600">{driverDetails.name || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-start group hover:bg-green-50 p-3 rounded-lg transition-colors">
                    <Mail className="mr-3 mt-1 text-blue-500 flex-shrink-0 group-hover:text-blue-600" size={24} />
                    <div>
                      <p className="font-semibold text-gray-700">Email</p>
                      <p className="text-gray-600">{driverDetails.email || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-start group hover:bg-green-50 p-3 rounded-lg transition-colors">
                    <User className="mr-3 mt-1 text-gray-500 flex-shrink-0 group-hover:text-gray-600" size={24} />
                    <div>
                      <p className="font-semibold text-gray-700">NIC</p>
                      <p className="text-gray-600">{driverDetails.NIC || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-start group hover:bg-green-50 p-3 rounded-lg transition-colors">
                    <Phone className="mr-3 mt-1 text-purple-500 flex-shrink-0 group-hover:text-purple-600" size={24} />
                    <div>
                      <p className="font-semibold text-gray-700">Contact Number</p>
                      <p className="text-gray-600">{driverDetails.contactNumber || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start group hover:bg-green-50 p-3 rounded-lg transition-colors">
                    <MapPin className="mr-3 mt-1 text-red-500 flex-shrink-0 group-hover:text-red-600" size={24} />
                    <div>
                      <p className="font-semibold text-gray-700">District</p>
                      <p className="text-gray-600">{driverDetails.district || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-start group hover:bg-green-50 p-3 rounded-lg transition-colors">
                    <Truck className="mr-3 mt-1 text-orange-500 flex-shrink-0 group-hover:text-orange-600" size={24} />
                    <div>
                      <p className="font-semibold text-gray-700">Vehicle Number</p>
                      <p className="text-gray-600">{driverDetails.vehicleNumber || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-start group hover:bg-green-50 p-3 rounded-lg transition-colors">
                    <Truck className="mr-3 mt-1 text-teal-500 flex-shrink-0 group-hover:text-teal-600" size={24} />
                    <div>
                      <p className="font-semibold text-gray-700">Vehicle Capacity</p>
                      <p className="text-gray-600">{driverDetails.vehicleCapacity ? `${driverDetails.vehicleCapacity} kg` : 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;