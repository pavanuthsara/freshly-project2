import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Truck, 
  Edit, 
  Loader2,
  AlertCircle 
} from 'lucide-react';

// Import background image
import backgroundImage from '../../assets/delivery_dashboard.jpg'; // Adjust path if needed

const Profile = () => {
  const [driverDetails, setDriverDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDriverProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token); // Check if token exists
        if (!token) {
          throw new Error('No authentication token found');
        }
        const response = await axios.get('/api/drivers/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Full Response:', response);
        console.log('Response Data:', response.data);
        console.log('Driver Details:', response.data.driver);
        console.log('Direct Driver Data:', response.data);
        setDriverDetails(response.data.driver || response.data);
        setLoading(false);
      } catch (error) {
        console.error('Complete Error Object:', error);
        console.error('Error Response:', error.response);
        console.error('Error Message:', error.message);
        setError(error.response?.data?.message || error.message || 'Failed to load profile');
        setLoading(false);
      }
    };
    fetchDriverProfile();
  }, []);

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
      
      {/* Content with relative positioning */}
      <div className="relative p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/95 shadow-xl rounded-xl p-8 animate-fade-in">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-green-700 flex items-center">
                <User className="mr-3 text-green-500" size={32} />
                Driver Profile
              </h1>
              <button 
                className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors transform hover:scale-105"
              >
                <Edit className="mr-2" size={20} />
                Edit Profile
              </button>
            </div>

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;