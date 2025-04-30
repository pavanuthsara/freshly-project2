import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  User, 
  AlertOctagon, 
  BarChart, 
  HelpCircle, 
  LogOut 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Import sections
import ProductSection from './pages/FarmerPages/MyProduct';
import ProfileSection from './pages/FarmerPages/MyProfile';

const FarmerDashboard = ({ farmerData, onLogout }) => {
  const [activeSection, setActiveSection] = useState('products');
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const navigate = useNavigate();

  // Check for valid farmerToken on mount
  useEffect(() => {
    const token = localStorage.getItem('farmerToken');
    console.log('Checking farmerToken:', !!token);
    if (!token) {
      console.log('No farmerToken found, redirecting to login');
      toast.error('Session expired. Please log in again.', {
        style: {
          background: '#EF4444',
          color: '#FFFFFF',
          fontWeight: 'bold',
        },
        duration: 3000,
        position: 'top-right',
      });
      setTimeout(() => {
        if (onLogout) onLogout();
        navigate('/farmer/login');
      }, 1000);
    }
  }, [navigate, onLogout]);

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
        navigate('/farmer/login');
      }
    }, 1000);
  };

  const handleCancelLogout = () => {
    console.log('handleCancelLogout called');
    setShowLogoutConfirmation(false);
  };

  return (
    <div className="flex h-screen bg-green-50">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            zIndex: 9999,
          },
        }}
      />

      {/* Sidebar Navigation */}
      <div className="w-64 bg-green-600 text-white p-4">
        <div className="text-2xl font-bold mb-8">Freshly.lk</div>
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
                  ? 'bg-green-700' 
                  : 'hover:bg-green-500'
              }`}
            >
              <Icon className="mr-2" size={20} />
              {name}
            </button>
          ))}
          <button
            onClick={handleLogoutClick}
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

      {/* Logout Confirmation Modal */}
      {showLogoutConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
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
};

export default FarmerDashboard;