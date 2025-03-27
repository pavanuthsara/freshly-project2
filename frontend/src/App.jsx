import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  User, 
  AlertOctagon, 
  BarChart, 
  HelpCircle, 
  LogOut,
  Sprout
} from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';

// Farmer Components
import ProductSection from './pages/FarmerPages/MyProduct';
import ProfileSection from './pages/FarmerPages/MyProfile';
import Login from './pages/FarmerPages/Login';
import Register from './pages/FarmerPages/Register';

function FarmerDashboard({ farmerData, onLogout }) {
  const [activeSection, setActiveSection] = useState('products');

  const sidebarItems = [
    { name: 'My Products', icon: Package, section: 'products' },
    { name: 'My Profile', icon: User, section: 'profile' },
    { name: 'Complaints', icon: AlertOctagon, section: 'complaints' },
    { name: 'Analytics', icon: BarChart, section: 'analytics' },
    { name: 'Help Bot', icon: HelpCircle, section: 'help' }
  ];

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-black text-white p-4">
      <div className="flex items-center text-2xl font-bold mb-8 space-x-2">
      <Sprout className="text-green-400" /> 
      <span>Freshly.lk</span>
    </div>
        <nav className="space-y-2">
          {sidebarItems.map(({ name, icon: Icon, section }) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`w-full flex items-center p-2 rounded ${
                activeSection === section 
                  ? 'bg-green-500' 
                  : 'hover:bg-green-400'
              }`}
            >
              <Icon className="mr-2" size={20} />
              {name}
            </button>
          ))}
          <button
            onClick={onLogout}
            className="w-full flex items-center p-2 rounded hover:bg-green-500 mt-4"
          >
            <LogOut className="mr-2" size={20} />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        {activeSection === 'products' && (
          <ProductSection farmerData={farmerData} />
        )}

        {activeSection === 'profile' && (
          <ProfileSection farmerData={farmerData} />
        )}

        {activeSection === 'complaints' && (
          <div className="text-3xl font-bold text-green-800">Complaints Section</div>
        )}

        {activeSection === 'analytics' && (
          <div className="text-3xl font-bold text-green-800">Analytics Section</div>
        )}

        {activeSection === 'help' && (
          <div className="text-3xl font-bold text-green-800">Help Bot Section</div>
        )}
      </div>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [farmerData, setFarmerData] = useState(null);

  const handleLoginSuccess = (data) => {
    setIsAuthenticated(true);
    setFarmerData(data);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setFarmerData(null);
  };

  const handleRegistrationSuccess = (data) => {
    setIsAuthenticated(true);
    setFarmerData(data);
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            !isAuthenticated ? 
            <Login onLoginSuccess={handleLoginSuccess} /> : 
            <Navigate to="/dashboard" />
          } 
        />
        <Route 
          path="/register" 
          element={
            !isAuthenticated ? 
            <Register onRegistrationSuccess={handleRegistrationSuccess} /> : 
            <Navigate to="/dashboard" />
          } 
        />

        {/* Protected Route */}
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
            <FarmerDashboard farmerData={farmerData} onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          } 
        />

        {/* Default Redirect */}
        <Route 
          path="/" 
          element={<Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;