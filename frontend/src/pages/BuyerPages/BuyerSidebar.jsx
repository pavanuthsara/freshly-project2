import React from 'react';
import { User, ShoppingBag, Home, LogOut, BookOpen, Leaf, ShoppingCart, BarChart2 } from 'lucide-react';

const BuyerSidebar = ({ activeTab }) => {
  // Helper function to generate class names for navigation items
  const getNavItemClass = (tabName) => {
    const isActive = activeTab === tabName;
    return `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
    }`;
  };

  // Helper function to generate class names for icons
  const getIconClass = (tabName) => {
    const isActive = activeTab === tabName;
    return `mr-3 ${isActive ? 'bg-emerald-100 p-2 rounded-md text-emerald-600' : 'text-gray-400 p-2'}`;
  };

  return (
    <aside className="w-64 bg-white shadow-lg h-screen sticky top-0 z-10 overflow-y-auto">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
        <div className="flex items-center space-x-3">
          <Leaf className="h-8 w-8 text-white" />
          <div>
            <h2 className="text-xl font-bold">Farm Fresh</h2>
            <p className="text-xs text-emerald-100 opacity-80 mt-1">
              Buyer Dashboard
            </p>
          </div>
        </div>
      </div>
      
      <nav className="py-6">
        <div className="px-4 mb-4">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Account
          </span>
        </div>
        
        <ul className="space-y-1 px-2">
          <li>
            <a 
              href="/"
              className={getNavItemClass('profile')}
            >
              <div className={getIconClass('profile')}>
                <User className="h-5 w-5" />
              </div>
              <span>My Profile</span>
            </a>
          </li>
          
          <li>
            <a 
              href="/orders"
              className={getNavItemClass('orders')}
            >
              <div className={getIconClass('orders')}>
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span>My Orders</span>
            </a>
          </li>
          
          <li>
            <a 
              href="/analytics"
              className={getNavItemClass('analytics')}
            >
              <div className={getIconClass('analytics')}>
                <BarChart2 className="h-5 w-5" />
              </div>
              <span>My Analytics</span>
            </a>
          </li>
        </ul>
        
        <div className="px-4 pt-6 pb-2 mt-4">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Shopping
          </span>
        </div>
        
        <ul className="space-y-1 px-2">
          <li>
            <a 
              href="/products"
              className="flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-gray-600 hover:bg-gray-50"
            >
              <div className="mr-3 text-gray-400 p-2">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <span>Shop All</span>
            </a>
          </li>
          
          <li>
            <a 
              href="/products?category=books"
              className="flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-gray-600 hover:bg-gray-50"
            >
              <div className="mr-3 text-gray-400 p-2">
                <BookOpen className="h-5 w-5" />
              </div>
              <span>Shop by Category</span>
            </a>
          </li>
          
          <li>
            <a 
              href="/home"
              className="flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-gray-600 hover:bg-gray-50"
            >
              <div className="mr-3 text-gray-400 p-2">
                <Home className="h-5 w-5" />
              </div>
              <span>Home</span>
            </a>
          </li>
        </ul>
      </nav>
      
      <div className="px-4 pb-8 absolute bottom-0 w-full">
        <a 
          href="/logout"
          className="flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-red-600 hover:bg-red-50"
        >
          <div className="mr-3 p-2">
            <LogOut className="h-5 w-5" />
          </div>
          <span>Logout</span>
        </a>
      </div>
    </aside>
  );
};

export default BuyerSidebar;