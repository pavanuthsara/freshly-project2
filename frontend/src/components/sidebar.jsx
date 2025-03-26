import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Package, User, BarChart2, HelpCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="w-64 min-h-screen bg-green-700 text-white p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center">
          <Sprout className="mr-2" />
          Freshly.lk
        </h1>
      </div>
      
      <nav className="space-y-2">
        <Link to="/my-products" className="flex items-center p-3 hover:bg-green-600 rounded-lg">
          <Package className="mr-2" />
          My Products
        </Link>
        
        <Link to="/my-profile" className="flex items-center p-3 hover:bg-green-600 rounded-lg">
          <User className="mr-2" />
          My Profile
        </Link>
        
        <Link to="/analytics" className="flex items-center p-3 hover:bg-green-600 rounded-lg">
          <BarChart2 className="mr-2" />
          Analytics
        </Link>
        
        <Link to="/help" className="flex items-center p-3 hover:bg-green-600 rounded-lg">
          <HelpCircle className="mr-2" />
          Help Bot
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center p-3 hover:bg-green-600 rounded-lg w-full text-left"
        >
          <LogOut className="mr-2" />
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;