// src/components/Dashboard.jsx
import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Coins, 
  Leaf, 
  Download,
} from 'lucide-react';
import { generatePDF } from '../../handlers/driverpdfUtils';

const Dashboard = ({ user }) => {
  // Mock data (in a real app, this would come from an API)
  const [deliveryStats] = useState({
    totalDeliveries: 24,
    completedDeliveries: 18,
    pendingDeliveries: 6,
    totalDistance: 456,
    totalEarnings: 1245.50,
    cropTypes: [
      { name: "Tomatoes", quantity: 320, unit: "kg" },
      { name: "Carrots", quantity: 215, unit: "kg" },
      { name: "Lettuce", quantity: 180, unit: "kg" },
    ],
  });

  const [recentDeliveries] = useState([
    {
      id: "D001",
      farm: "Green Acres Farm",
      destination: "City Market",
      crop: "Tomatoes",
      quantity: 120,
      status: "Completed",
      date: "2024-03-20",
    },
    {
      id: "D002",
      farm: "Sunshine Farms",
      destination: "Local Grocery",
      crop: "Carrots",
      quantity: 85,
      status: "In Progress",
      date: "2024-03-22",
    },
    {
      id: "D003",
      farm: "Harvest Haven",
      destination: "Restaurant Depot",
      crop: "Lettuce",
      quantity: 60,
      status: "Pending",
      date: "2024-03-25",
    },
  ]);

  const [filterStatus, setFilterStatus] = useState('All');

  // Filter deliveries based on status
  const filteredDeliveries = filterStatus === 'All'
    ? recentDeliveries
    : recentDeliveries.filter(delivery => delivery.status === filterStatus);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-700 flex items-center">
            <Truck className="mr-3 h-8 w-8" /> Driver Dashboard
          </h1>
          <button
            onClick={() => generatePDF(user, deliveryStats, recentDeliveries)} // Fixed: Pass arguments
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            <Download className="mr-2 h-5 w-5" /> Download Report
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-flow-dense gap-6 mb-8">
          <StatCard 
            icon={<CheckCircle2 className="text-green-500 h-8 w-8" />}
            title="Completed Deliver\\.jsxies"
            value={deliveryStats.completedDeliveries}
            className="hover:shadow-lg transition-shadow"
          />
          <StatCard 
            icon={<Clock className="text-blue-500 h-8 w-8" />}
            title="Pending Deliveries"
            value={deliveryStats.pendingDeliveries}
            className="hover:shadow-lg transition-shadow"
          />
          <StatCard 
            icon={<Coins className="text-green-600 h-8 w-8" />}
            title="Total Earnings"
            value={`LKR ${deliveryStats.totalEarnings.toFixed(2)}`}
            className="hover:shadow-lg transition-shadow"
          />
        </div>

        {/* Crop Delivery Breakdown */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Leaf className="mr-2 text-green-600 h-6 w-6" /> Crop Delivery Breakdown
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {deliveryStats.cropTypes.map((crop, index) => (
              <div 
                key={index} 
                className="bg-green-50 p-4 rounded-lg border border-green-100 hover:bg-green-100 transition"
              >
                <h3 className="font-bold text-green-700">{crop.name}</h3>
                <p className="text-gray-600">
                  {crop.quantity} {crop.unit} Delivered
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Deliveries */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <MapPin className="mr-2 text-blue-600 h-6 w-6" /> Recent Deliveries
            </h2>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="All">All</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div className="space-y-4">
            {filteredDeliveries.length > 0 ? (
              filteredDeliveries.map((delivery) => (
                <div 
                  key={delivery.id} 
                  className="flex justify-between items-center border-b pb-3 last:border-b-0 hover:bg-gray-50 transition cursor-pointer"
                >
                  <div>
                    <p className="font-bold text-gray-800">{delivery.farm}</p>
                    <p className="text-sm text-gray-600">
                      {delivery.crop} - {delivery.quantity} kg to {delivery.destination}
                    </p>
                    <p className="text-xs text-gray-500">{delivery.date}</p>
                  </div>
                  <span 
                    className={`
                      px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        delivery.status === "Completed" 
                          ? "bg-green-100 text-green-800"
                          : delivery.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    `}
                  >
                    {delivery.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No deliveries match the selected filter.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ icon, title, value, className }) => {
  return (
    <div className={`bg-white shadow-md rounded-xl p-6 flex items-center ${className}`}>
      <div className="mr-4">{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default Dashboard;