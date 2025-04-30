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
        
        // More detailed logging
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="animate-spin text-green-500" size={32} />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-800 flex items-center justify-center min-h-screen">
        <div className="text-center flex items-center">
          <AlertCircle className="mr-2 text-red-500" size={32} />
          <div>
            <h2 className="text-2xl font-bold mb-2">Error Loading Profile</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Additional null check before rendering
  if (!driverDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex items-center space-x-2 text-gray-600">
          <AlertCircle className="text-yellow-500" size={32} />
          <span>No driver details available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-700 flex items-center">
            <User className="mr-3 text-green-500" size={32} />
            Driver Profile
          </h1>
          <button 
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
          >
            <Edit className="mr-2" size={20} />
            Edit Profile
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <User className="mr-3 text-green-500" size={24} />
              <div>
                <p className="font-semibold text-gray-700">Name</p>
                <p className="text-gray-600">{driverDetails.name || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center">
              <Mail className="mr-3 text-blue-500" size={24} />
              <div>
                <p className="font-semibold text-gray-700">Email</p>
                <p className="text-gray-600">{driverDetails.email || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center">
              <Phone className="mr-3 text-purple-500" size={24} />
              <div>
                <p className="font-semibold text-gray-700">Contact Number</p>
                <p className="text-gray-600">{driverDetails.contactNumber || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <MapPin className="mr-3 text-red-500" size={24} />
              <div>
                <p className="font-semibold text-gray-700">District</p>
                <p className="text-gray-600">{driverDetails.district || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center">
              <Truck className="mr-3 text-orange-500" size={24} />
              <div>
                <p className="font-semibold text-gray-700">Vehicle Number</p>
                <p className="text-gray-600">{driverDetails.vehicleNumber || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center">
              <Truck className="mr-3 text-teal-500" size={24} />
              <div>
                <p className="font-semibold text-gray-700">Vehicle Capacity</p>
                <p className="text-gray-600">{driverDetails.vehicleCapacity ? `${driverDetails.vehicleCapacity} kg` : 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;