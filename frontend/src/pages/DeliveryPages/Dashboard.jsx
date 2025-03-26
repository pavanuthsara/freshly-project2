import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Box, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Leaf, 
  DollarSign,
  Coins, 
} from 'lucide-react';

const Dashboard = () => {
  // Mock data (in a real app, this would come from an API)
  const [deliveryStats, setDeliveryStats] = useState({
    totalDeliveries: 24,
    completedDeliveries: 18,
    pendingDeliveries: 6,
    totalDistance: 456,
    totalEarnings: 1245.50,
    cropTypes: [
      { name: "Tomatoes", quantity: 320, unit: "kg" },
      { name: "Carrots", quantity: 215, unit: "kg" },
      { name: "Lettuce", quantity: 180, unit: "kg" }
    ]
  });

  const recentDeliveries = [
    {
      id: "D001",
      farm: "Green Acres Farm",
      destination: "City Market",
      crop: "Tomatoes",
      quantity: 120,
      status: "Completed",
      date: "2024-03-20"
    },
    {
      id: "D002",
      farm: "Sunshine Farms",
      destination: "Local Grocery",
      crop: "Carrots",
      quantity: 85,
      status: "In Progress",
      date: "2024-03-22"
    },
    {
      id: "D003",
      farm: "Harvest Haven",
      destination: "Restaurant Depot",
      crop: "Lettuce",
      quantity: 60,
      status: "Pending",
      date: "2024-03-25"
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-green-700 flex items-center">
          <Truck className="mr-3" /> Driver Dashboard
        </h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard 
            icon={<CheckCircle2 className="text-green-500" />}
            title="Completed Deliveries"
            value={deliveryStats.completedDeliveries}
          />
          <StatCard 
            icon={<Clock className="text-blue-500" />}
            title="Pending Deliveries"
            value={deliveryStats.pendingDeliveries}
          />
          <StatCard 
            icon={<Coins className="text-green-600" />}
            title="Total Earnings"
            value={`LKR ${deliveryStats.totalEarnings.toFixed(2)}`}
          />
        </div>

        {/* Crop Delivery Breakdown */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Leaf className="mr-2 text-green-600" /> Crop Delivery Breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {deliveryStats.cropTypes.map((crop, index) => (
              <div 
                key={index} 
                className="bg-green-50 p-4 rounded-lg border border-green-100"
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
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <MapPin className="mr-2 text-blue-600" /> Recent Deliveries
          </h2>
          <div className="space-y-4">
            {recentDeliveries.map((delivery) => (
              <div 
                key={delivery.id} 
                className="flex justify-between items-center border-b pb-3 last:border-b-0"
              >
                <div>
                  <p className="font-bold">{delivery.farm}</p>
                  <p className="text-sm text-gray-600">
                    {delivery.crop} - {delivery.quantity} kg to {delivery.destination}
                  </p>
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ icon, title, value }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-5 flex items-center">
      <div className="mr-4">{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default Dashboard;