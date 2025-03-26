import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  User, 
  AlertOctagon, 
  BarChart, 
  HelpCircle, 
  LogOut 
} from 'lucide-react';

// Import sections
import ProductSection from './pages/FarmerPages/MyProduct';
import ProfileSection from './pages/FarmerPages/MyProfile';

const FarmerDashboard = ({ farmerData, onLogout }) => {
  const [activeSection, setActiveSection] = useState('products');

  const sidebarItems = [
    { name: 'My Products', icon: Package, section: 'products' },
    { name: 'My Profile', icon: User, section: 'profile' },
    { name: 'Complaints', icon: AlertOctagon, section: 'complaints' },
    { name: 'Analytics', icon: BarChart, section: 'analytics' },
    { name: 'Help Bot', icon: HelpCircle, section: 'help' }
  ];

  return (
    <div className="flex h-screen bg-green-50">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-green-600 text-white p-4">
        <div className="text-2xl font-bold mb-8">Freshly.lk</div>
        <nav className="space-y-2">
          {sidebarItems.map(({ name, icon: Icon, section }) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
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
};

export default FarmerDashboard;