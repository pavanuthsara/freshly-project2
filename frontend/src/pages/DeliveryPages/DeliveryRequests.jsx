import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { 
  Truck, 
  MapPin, 
  Weight, 
  User, 
  Check,
  AlertCircle,
  Clock,
  Package,
  Filter
} from 'lucide-react';

// Import background image
import backgroundImage from '../../assets/storage-vegetation.jpg'; // Adjust path if needed

const DeliveryRequests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [originalRequests, setOriginalRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [driverVehicleCapacity, setDriverVehicleCapacity] = useState(null);
  const [currentTotalWeight, setCurrentTotalWeight] = useState(0);

  // Weight Filter States
  const [weightFilter, setWeightFilter] = useState({
    value: '',
    condition: 'greaterThan'
  });

  // Fetching Capacity
  useEffect(() => {
    const fetchDriverVehicleCapacity = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/deliveryrequest/vehicle-capacity', {
          headers: { 
            'Authorization': `Bearer ${token}` 
          }
        });
        setDriverVehicleCapacity(response.data.vehicleCapacity);
        setCurrentTotalWeight(response.data.currentTotalWeight || 0);
      } catch (error) {
        console.error('Failed to fetch vehicle capacity', error);
        toast.error('Could not retrieve vehicle capacity');
      }
    };
    fetchDriverVehicleCapacity();
  }, []);

  // Fetching pending requests
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/deliveryrequest/pendingrequests', {
          headers: { 
            'Authorization': `Bearer ${token}` 
          }
        });
        const requestsData = Array.isArray(response.data) 
          ? response.data 
          : (response.data.data || []);
        setPendingRequests(requestsData);
        setOriginalRequests(requestsData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch pending requests', error);
        if (error.response) {
          setError(`Failed to load delivery requests: ${error.response.status}`);
        } else if (error.request) {
          setError('No response from server');
        } else {
          setError('Error setting up the request');
        }
        setLoading(false);
      }
    };
    fetchPendingRequests();
  }, []);

  // Weight Filtering Function
  const applyWeightFilter = () => {
    if (!weightFilter.value) {
      setPendingRequests(originalRequests);
      return;
    }
    const filteredRequests = originalRequests.filter(request => {
      const filterValue = parseFloat(weightFilter.value);
      if (isNaN(filterValue)) {
        toast.error('Please enter a valid weight');
        return true;
      }
      switch(weightFilter.condition) {
        case 'greaterThan':
          return request.weight > filterValue;
        case 'lessThan':
          return request.weight < filterValue;
        case 'equalTo':
          return request.weight === filterValue;
        default:
          return true;
      }
    });
    setPendingRequests(filteredRequests);
  };

  const handleAcceptRequest = async (deliveryId) => {
    const request = pendingRequests.find(req => req.deliveryId === deliveryId);
    if (!request) {
      toast.error("Request not found.");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/deliveryrequest/accept', 
        { deliveryId }, 
        {
          headers: { 
            'Authorization': `Bearer ${token}` 
          }
        }
      );
      const capacityResponse = await axios.get('/api/deliveryrequest/vehicle-capacity', {
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });
      setPendingRequests(prevRequests => 
        prevRequests.filter(req => req.deliveryId !== deliveryId)
      );
      setDriverVehicleCapacity(capacityResponse.data.vehicleCapacity);
      setCurrentTotalWeight(capacityResponse.data.currentTotalWeight);
      toast.success('Request Accepted!', { position: "top-center" });
    } catch (error) {
      console.error('Failed to accept request', error);
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        toast.error(
          `Cannot accept request. Total weight (${errorData.proposedTotalWeight} kg) ` +
          `would exceed vehicle capacity (${errorData.vehicleCapacity} kg).`, 
          { 
            position: "top-right",
            autoClose: 5000
          }
        );
      } else {
        toast.error('Failed to accept request', { position: "top-right" });
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 mb-4"></div>
          <p className="text-gray-600">Loading delivery requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-800 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-xl font-bold mb-2">Request Loading Failed</h2>
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
      
      {/* Content with relative positioning */}
      <div className="relative p-6">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-6 text-white flex items-center">
            <Truck className="mr-3" /> Delivery Requests
          </h1>

          {/* Weight Filter Section */}
          <div className="mb-6 bg-white/90 shadow-md rounded-lg p-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="text-green-500" />
              <label htmlFor="weightFilter" className="font-semibold text-gray-700">
                Filter by Weight
              </label>
            </div>
            <select 
              value={weightFilter.condition}
              onChange={(e) => setWeightFilter(prev => ({
                ...prev, 
                condition: e.target.value
              }))}
              className="border rounded px-2 py-1 bg-white"
            >
              <option value="greaterThan">Greater Than</option>
              <option value="lessThan">Less Than</option>
              <option value="equalTo">Equal To</option>
            </select>
            <input 
              type="number" 
              placeholder="Enter weight (kg)"
              value={weightFilter.value}
              onChange={(e) => setWeightFilter(prev => ({
                ...prev, 
                value: e.target.value
              }))}
              className="border rounded px-2 py-1 w-32 bg-white"
            />
            <button 
              onClick={applyWeightFilter}
              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
            >
              Apply Filter
            </button>
            <button 
              onClick={() => {
                setWeightFilter({
                  value: '',
                  condition: 'greaterThan'
                });
                setPendingRequests(originalRequests);
              }}
              className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
            >
              Reset
            </button>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="bg-white/90 shadow-md rounded-lg p-8 text-center">
              <Package className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600 text-lg">No pending delivery requests</p>
              <p className="text-gray-500 mt-2">Check back later for new requests</p>
            </div>
          ) : (
            <div className="space-y-6">
              {pendingRequests.map((request) => (
                <div 
                  key={request.deliveryId} 
                  className="bg-white/90 border border-gray-100 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-xl"
                >
                  <div className="p-6">
                    {/* Request Header */}
                    <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
                      <div>
                        <h2 className="text-xl font-bold text-green-700 flex items-center">
                          <Truck className="mr-2 text-green-500" />
                          Delivery #{request.deliveryId}
                        </h2>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock className="mr-2 text-gray-400" size={16} />
                          Requested on {new Date(request.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-semibold">
                        Pending
                      </span>
                    </div>

                    {/* Delivery Details */}
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-start">
                        <MapPin className="mr-3 mt-1 text-green-500 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-gray-700">Pickup Location</h3>
                          <p className="text-gray-600">{request.pickup || 'Not specified'}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="mr-3 mt-1 text-red-500 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-gray-700">Drop-off Location</h3>
                          <p className="text-gray-600">{request.dropOff || 'Not specified'}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Weight className="mr-3 mt-1 text-blue-500 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-gray-700">Package Weight</h3>
                          <p className="text-gray-600">{request.weight} kg</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <User className="mr-3 mt-1 text-purple-500 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-gray-700">Farmer</h3>
                          <p className="text-gray-600">
                            {request.farmerId?.name || 'Unknown Farmer'}
                          </p>
                          {request.farmerId?.farmName && (
                            <p className="text-xs text-gray-500">
                              Farm: {request.farmerId.farmName}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleAcceptRequest(request.deliveryId)}
                        className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center"
                      >
                        <Check className="mr-2" size={18} />
                        Accept Request
                      </button>
                      <button
                        className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 transition-colors"
                        // TODO: Implement view details functionality
                      >
                        View Details
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

export default DeliveryRequests;