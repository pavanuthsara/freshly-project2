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
  Package,
  Map
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Import background image
import backgroundImage from '../../assets/delivery_truck.jpg'; // Adjust path if needed

// Fix Leaflet marker icon issue
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// District-to-coordinates mapping (extend as needed)
const districtCoordinates = {
  Colombo: [6.9271, 79.8612],
  Kandy: [7.2906, 80.6337],
  Galle: [6.0535, 80.2200],
  // Add more districts or use a geocoding API
};

const AcceptedRequests = () => {
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [optimizedRoute, setOptimizedRoute] = useState(null);

  useEffect(() => {
    const fetchAcceptedRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/deliveryrequest/driveraccepted', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const requestsData = Array.isArray(response.data) 
          ? response.data 
          : (response.data.data || []);

        // Mock coordinates if not provided by API
        const requestsWithCoords = requestsData.map((request, index) => ({
          ...request,
          coordinates: request.dropOffCoordinates || [
            districtCoordinates['Colombo'][0] + (index * 0.01),
            districtCoordinates['Colombo'][1] + (index * 0.01)
          ]
        }));
        setAcceptedRequests(requestsWithCoords);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch accepted requests', error);
        setError(error.response?.data?.message || 'Failed to load accepted requests');
        setLoading(false);
      }
    };
    fetchAcceptedRequests();
  }, []);

  // Simple nearest-neighbor route optimization
  const optimizeRoute = () => {
    if (acceptedRequests.length === 0) return null;
    
    const driverLocation = districtCoordinates['Colombo']; // Replace with driver’s actual location
    const stops = acceptedRequests.map(req => req.coordinates);
    let current = driverLocation;
    const orderedStops = [];
    const remainingStops = [...stops];

    while (remainingStops.length > 0) {
      let nearestIndex = 0;
      let nearestDistance = Infinity;
      
      remainingStops.forEach((stop, index) => {
        const distance = Math.sqrt(
          Math.pow(stop[0] - current[0], 2) + Math.pow(stop[1] - current[1], 2)
        );
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      orderedStops.push(remainingStops[nearestIndex]);
      current = remainingStops[nearestIndex];
      remainingStops.splice(nearestIndex, 1);
    }

    return [driverLocation, ...orderedStops];
  };

  // Generate Google Maps URL
  const getGoogleMapsUrl = () => {
    if (acceptedRequests.length === 0) return '';
    const waypoints = acceptedRequests.map(req => encodeURIComponent(req.dropOff)).join('|');
    return `https://www.google.com/maps/dir/?api=1&origin=Colombo&destination=Colombo&waypoints=${waypoints}`;
  };

  // Handle route optimization
  const handleOptimizeRoute = () => {
    const route = optimizeRoute();
    setOptimizedRoute(route);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat relative flex justify-center items-center">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative flex flex-col items-center text-white animate-pulse">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-green mb-4"></div>
          <p className="text-lg">Loading accepted delivery requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative bg-white/90 p-8 rounded-lg shadow-md text-center">
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
            <Truck className="mr-3" /> Accepted Delivery Requests
          </h1>

          {/* Map Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Map className="mr-2 text-primary-green" size={24} />
                Delivery Route Map
              </h2>
              <button
                onClick={() => setShowMap(!showMap)}
                className="bg-primary-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-green"
              >
                {showMap ? 'Hide Map' : 'Show Map'}
              </button>
            </div>
            {showMap && (
              <div className="bg-primary-green/10 border-2 border-primary-green rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-shadow animate-fade-in">
                <MapContainer
                  center={districtCoordinates['Colombo']}
                  zoom={10}
                  style={{ height: '400px', width: '100%' }}
                  className="rounded-xl"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {/* Driver Location Marker */}
                  <Marker position={districtCoordinates['Colombo']}>
                    <Popup>Driver Starting Point</Popup>
                  </Marker>
                  {/* Delivery Markers */}
                  {acceptedRequests.map((request, index) => (
                    <Marker key={request.deliveryId} position={request.coordinates}>
                      <Popup>
                        <div>
                          <p className="font-semibold">{request.farmerId?.name || 'Unknown Farmer'}</p>
                          <p>{request.dropOff || 'No address'}</p>
                          <p>Weight: {request.weight} kg</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                  {/* Optimized Route Polyline */}
                  {optimizedRoute && <Polyline positions={optimizedRoute} color="#22c55e" />}
                </MapContainer>
                <div className="p-4 flex justify-between items-center bg-primary-green/20">
                  <button
                    onClick={handleOptimizeRoute}
                    className="bg-primary-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-green"
                  >
                    View Optimized Route
                  </button>
                  {acceptedRequests.length > 0 && (
                    <a
                      href={getGoogleMapsUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Navigate in Google Maps
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {acceptedRequests.length === 0 ? (
            <div className="bg-white/90 shadow-md rounded-lg p-8 text-center">
              <Package className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600 text-lg">No accepted delivery requests</p>
              <p className="text-gray-500 mt-2">Browse pending requests to get started</p>
            </div>
          ) : (
            <div className="space-y-6">
              {acceptedRequests.map((request) => (
                <div 
                  key={request.deliveryId} 
                  className="bg-white/90 border border-gray-100 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-xl"
                >
                  <div className="p-6">
                    {/* Request Header */}
                    <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
                      <div>
                        <h2 className="text-xl font-bold text-primary-green flex items-center">
                          <Truck className="mr-2 text-primary-green" />
                          Delivery #{request.deliveryId}
                        </h2>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock className="mr-2 text-gray-400" size={16} />
                          Accepted on {new Date(request.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
                        Accepted
                      </span>
                    </div>

                    {/* Delivery Details */}
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-start">
                        <MapPin className="mr-3 mt-1 text-primary-green flex-shrink-0" />
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
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center"
                        // TODO: Implement start delivery functionality
                      >
                        <Check className="mr-2" size={18} />
                        Start Delivery
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

export default AcceptedRequests;