import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Truck, 
  MapPin, 
  Weight, 
  User, 
  Check,
  AlertCircle,
  Clock,
  Package 
} from 'lucide-react';

const DeliveryRequests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleAcceptRequest = async (deliveryId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/delivery-requests/accept', 
        { deliveryId }, 
        {
          headers: { 
            'Authorization': `Bearer ${token}` 
          }
        }
      );
      
      setPendingRequests(prevRequests => 
        prevRequests.filter(request => request.deliveryId !== deliveryId)
      );
    } catch (error) {
      console.error('Failed to accept request', error);
      // TODO: Add user-friendly error notification
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-green-700 flex items-center">
          <Truck className="mr-3" /> Delivery Requests
        </h1>

        {pendingRequests.length === 0 ? (
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <Package className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600 text-lg">No pending delivery requests</p>
            <p className="text-gray-500 mt-2">Check back later for new requests</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingRequests.map((request) => (
              <div 
                key={request.deliveryId} 
                className="bg-white border border-gray-100 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-xl"
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
                    {/* Pickup Location */}
                    <div className="flex items-start">
                      <MapPin className="mr-3 mt-1 text-green-500 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-700">Pickup Location</h3>
                        <p className="text-gray-600">{request.pickup || 'Not specified'}</p>
                      </div>
                    </div>

                    {/* Drop-off Location */}
                    <div className="flex items-start">
                      <MapPin className="mr-3 mt-1 text-red-500 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-700">Drop-off Location</h3>
                        <p className="text-gray-600">{request.dropOff || 'Not specified'}</p>
                      </div>
                    </div>

                    {/* Package Weight */}
                    <div className="flex items-start">
                      <Weight className="mr-3 mt-1 text-blue-500 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-700">Package Weight</h3>
                        <p className="text-gray-600">{request.weight} kg</p>
                      </div>
                    </div>

                    {/* Farmer Details */}
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
  );
};

export default DeliveryRequests;