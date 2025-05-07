import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Truck,
  MapPin,
  CheckCircle2,
  Clock,
  Coins,
  Leaf,
  Download,
  Filter,
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'react-toastify/dist/ReactToastify.css';
import { generatePDF } from '../../handlers/driverpdfUtils';
import backgroundImage from '../../assets/delivery_dashboard.jpg';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    completedDeliveries: 0,
    pendingDeliveries: 0,
    totalDistance: 0,
    totalEarnings: 0,
  });
  const [cropBreakdown, setCropBreakdown] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from all sources
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        // Fetch Profile
        const profileRes = await axios.get('/api/drivers/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(profileRes.data.driver);

        // Fetch Accepted Requests
        const acceptedRes = await axios.get('/api/deliveryrequest/driveraccepted', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const acceptedData = Array.isArray(acceptedRes.data)
          ? acceptedRes.data
          : acceptedRes.data.data || [];
        setAcceptedRequests(acceptedData);

        // Fetch Pending Requests
        const pendingRes = await axios.get('/api/deliveryrequest/pendingrequests', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const pendingData = Array.isArray(pendingRes.data)
          ? pendingData.data
          : pendingRes.data.data || [];
        setPendingRequests(pendingData);

        // Calculate Stats
        const completed = acceptedData.filter((req) => req.status === 'Completed').length;
        const pending = acceptedData.filter((req) => req.status === 'Pending').length;
        const total = acceptedData.length + pendingData.length;
        const earnings = acceptedData.reduce((sum, req) => sum + (req.earnings || 0), 0);
        const distance = acceptedData.reduce((sum, req) => sum + (req.distance || 0), 0);

        setStats({
          totalDeliveries: total,
          completedDeliveries: completed,
          pendingDeliveries: pending,
          totalDistance: distance,
          totalEarnings: earnings,
        });

        // Calculate Crop Breakdown
        const crops = {};
        acceptedData.forEach((req) => {
          const crop = req.crop || 'Unknown';
          crops[crop] = (crops[crop] || 0) + (req.quantity || 0);
        });
        setCropBreakdown(
          Object.entries(crops).map(([name, quantity]) => ({
            name,
            quantity,
            unit: 'kg',
          }))
        );

        setLoading(false);
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
        setError(error.response?.data?.message || 'Failed to load dashboard data');
        setLoading(false);
        toast.error(error.message || 'Error loading dashboard');
      }
    };

    fetchData();
  }, []);

  const filteredDeliveries = filterStatus === 'All'
    ? acceptedRequests
    : acceptedRequests.filter((req) => req.status === filterStatus);

  const districtCoordinates = {
    Colombo: [6.9271, 79.8612],
    Kandy: [7.2906, 80.6337],
    Galle: [6.0535, 80.2200],
  };

  if (loading) {
    return (
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat relative flex justify-center items-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative flex items-center space-x-2 text-white animate-pulse">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500" />
          <span className="text-xl">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative bg-white/90 p-6 rounded-xl shadow-lg text-center max-w-md">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-2xl font-bold text-gray-800">Error</h2>
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
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative p-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-4xl font-bold text-white flex items-center mb-4 md:mb-0">
              <Truck className="mr-4 h-10 w-10 text-green-500" />
              Driver Dashboard
            </h1>
            <button
              onClick={() => generatePDF(profile, stats, acceptedRequests)}
              className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md hover:shadow-lg ml-auto"
            >
              <Download className="mr-2 h-5 w-5" /> Download Report
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard
              icon={<CheckCircle2 className="text-green-500 h-10 w-10" />}
              title="Completed Deliveries"
              value={stats.completedDeliveries}
            />
            <StatCard
              icon={<Clock className="text-blue-500 h-10 w-10" />}
              title="Pending Deliveries"
              value={stats.pendingDeliveries}
            />
            <StatCard
              icon={<Coins className="text-yellow-500 h-10 w-10" />}
              title="Total Earnings"
              value={`LKR ${stats.totalEarnings.toFixed(2)}`}
            />
            <StatCard
              icon={<MapPin className="text-purple-500 h-10 w-10" />}
              title="Total Distance"
              value={`${stats.totalDistance} km`}
            />
            <StatCard
              icon={<Truck className="text-teal-500 h-10 w-10" />}
              title="Vehicle Capacity"
              value={`${profile?.vehicleCapacity || 0} kg`}
            />
          </div>

          {/* Map Overview */}
          <div className="bg-white/90 shadow-lg rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                <MapPin className="mr-2 text-blue-600 h-6 w-6" /> Delivery Map
              </h2>
            </div>
            <div className="relative overflow-hidden rounded-xl">
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
                <Marker position={districtCoordinates['Colombo']}>
                  <Popup>Your Location</Popup>
                </Marker>
                {acceptedRequests.map((req) => (
                  <Marker
                    key={req.deliveryId}
                    position={req.coordinates || districtCoordinates['Colombo']}
                  >
                    <Popup>
                      <div className="text-sm">
                        <p className="font-bold">{req.farmerId?.name || 'Unknown'}</p>
                        <p>{req.dropOff || 'No address'}</p>
                        <p>Weight: {req.weight} kg</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Crop Breakdown */}
          <div className="bg-white/90 shadow-lg rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-4">
              <Leaf className="mr-2 text-green-600 h-6 w-6" /> Crop Breakdown
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cropBreakdown.map((crop, index) => (
                <div
                  key={index}
                  className="bg-green-50 p-4 rounded-lg border border-green-100 hover:bg-green-100 transition-all cursor-pointer"
                >
                  <h3 className="font-bold text-green-700">{crop.name}</h3>
                  <p className="text-gray-600">{crop.quantity} {crop.unit} Delivered</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Deliveries */}
          <div className="bg-white/90 shadow-lg rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                <Truck className="mr-2 text-teal-600 h-6 w-6" /> Recent Deliveries
              </h2>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-700"
              >
                <option value="All">All</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>
            <div className="space-y-4">
              {filteredDeliveries.length > 0 ? (
                filteredDeliveries.map((req) => (
                  <div
                    key={req.deliveryId}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                  >
                    <div>
                      <p className="font-bold text-gray-800">{req.farmerId?.name || 'Unknown'}</p>
                      <p className="text-sm text-gray-600">
                        {req.crop || 'N/A'} - {req.weight} kg to {req.dropOff}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        req.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : req.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No deliveries match the filter.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value }) => (
  <div className="bg-white/90 shadow-md rounded-xl p-6 flex items-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
    <div className="mr-4 text-2xl">{icon}</div>
    <div>
      <p className="text-gray-600 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default Dashboard;