import React, { useState, useEffect } from 'react';
import { 
  Package, 
  User, 
  AlertOctagon, 
  BarChart, 
  HelpCircle, 
  LogOut,
  Sprout
} from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import './App.css';

// Farmer Components
import ProductSection from './pages/FarmerPages/MyProduct';
import ProfileSection from './pages/FarmerPages/MyProfile';
import FarmerProductPreview from './pages/FarmerPages/FarmerProductPreview';
import Login from './pages/FarmerPages/Login';
import Register from './pages/FarmerPages/Register';
import FarmerForgotPassword from './pages/FarmerPages/FarmerFogortPassword';
import FarmerResetPassword from './pages/FarmerPages/FarmerResetPassword';

function FarmerDashboard({ farmerData, onLogout }) {
  const [activeSection, setActiveSection] = useState('products');
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const navigate = useNavigate();

  const sidebarItems = [
    { name: 'My Products', icon: Package, section: 'products' },
    { name: 'My Profile', icon: User, section: 'profile' },
    { name: 'Complaints', icon: AlertOctagon, section: 'complaints' },
    { name: 'Analytics', icon: BarChart, section: 'analytics' },
    { name: 'Help Bot', icon: HelpCircle, section: 'help' }
  ];

  const handleLogoutClick = () => {
    console.log('handleLogoutClick called');
    toast('Please confirm logout action', {
      style: {
        background: '#6EE7B7', // emerald-300
        color: '#1F2937', // gray-800
        fontWeight: 'bold',
      },
      duration: 3000,
      position: 'top-right',
    });
    setShowLogoutConfirmation(true);
  };

  const handleConfirmLogout = () => {
    console.log('handleConfirmLogout called');
    toast.success('Logged out successfully!', {
      style: {
        background: '#34D399', // green-500
        color: '#FFFFFF',
        fontWeight: 'bold',
      },
      duration: 3000,
      position: 'top-right',
    });
    setShowLogoutConfirmation(false);
    setTimeout(() => {
      console.log('Calling onLogout');
      if (onLogout) {
        onLogout();
        navigate('/farmer-login');
      }
    }, 1000);
  };

  const handleCancelLogout = () => {
    console.log('handleCancelLogout called');
    setShowLogoutConfirmation(false);
  };

  return (
    <div className="flex h-screen bg-white">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            zIndex: 9999,
          },
        }}
      />

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
              onClick={() => {
                console.log(`Navigating to section: ${section}`);
                setActiveSection(section);
              }}
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
            onClick={handleLogoutClick}
            className="w-full flex items-center p-2 rounded hover:bg-green-400 mt-4"
          >
            <LogOut className="mr-2" size={20} />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <Routes>
          <Route
            path="/"
            element={
              activeSection === 'products' ? (
                <ProductSection farmerData={farmerData} />
              ) : activeSection === 'profile' ? (
                <ProfileSection farmerData={farmerData} />
              ) : activeSection === 'complaints' ? (
                <div className="text-3xl font-bold text-green-800">Complaints Section</div>
              ) : activeSection === 'analytics' ? (
                <div className="text-3xl font-bold text-green-800">Analytics Section</div>
              ) : (
                <div className="text-3xl font-bold text-green-800">Help Bot Section</div>
              )
            }
          />
          <Route
            path="/product/:id"
            element={<FarmerProductPreview />}
          />
        </Routes>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirmation && (
        <div className="fixed inset-0 bg-green-100 bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
            <h3 className="text-xl font-semibold text-green-800 mb-4">Confirm Logout</h3>
            <p className="text-gray-700 mb-6">Are you sure you want to log out from Freshly.lk?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelLogout}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [farmerData, setFarmerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('farmerToken');
      console.log('App: Checking farmerToken:', !!token);
      if (token) {
        console.log('App: Token found, setting isAuthenticated to true');
        setIsAuthenticated(true);
      } else {
        console.log('App: No token, setting isAuthenticated to false');
        setIsAuthenticated(false);
        setFarmerData(null);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLoginSuccess = (data) => {
    console.log('App: handleLoginSuccess called with data:', data);
    setIsAuthenticated(true);
    setFarmerData(data);
  };

  const handleLogout = () => {
    console.log('App: handleLogout called');
    localStorage.removeItem('farmerToken');
    setIsAuthenticated(false);
    setFarmerData(null);
  };

  const handleRegistrationSuccess = (data) => {
    console.log('App: handleRegistrationSuccess called with data:', data);
    setIsAuthenticated(true);
    setFarmerData(data);
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            zIndex: 9999,
          },
        }}
      />
      <Routes>
        <Route 
          path="/farmer-login" 
          element={
            !isAuthenticated ? 
            <Login onLoginSuccess={handleLoginSuccess} /> : 
            <Navigate to="/farmer-dashboard" />
          } 
        />
        <Route 
          path="/farmer-register" 
          element={
            !isAuthenticated ? 
            <Register onRegistrationSuccess={handleRegistrationSuccess} /> : 
            <Navigate to="/farmer-dashboard" />
          } 
        />
        <Route 
          path="/farmer-forgot-password" 
          element={
            !isAuthenticated ? 
            <FarmerForgotPassword /> : 
            <Navigate to="/farmer-dashboard" />
          } 
        />
        <Route 
          path="/farmer-reset-password" 
          element={
            !isAuthenticated ? 
            <FarmerResetPassword /> : 
            <Navigate to="/farmer-dashboard" />
          } 
        />
        <Route 
          path="/farmer-dashboard/*" 
          element={
            isAuthenticated ? 
            <FarmerDashboard farmerData={farmerData} onLogout={handleLogout} /> : 
            <Navigate to="/farmer-login" />
          } 
        />
        <Route 
          path="/" 
          element={<Navigate to="/farmer-login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;