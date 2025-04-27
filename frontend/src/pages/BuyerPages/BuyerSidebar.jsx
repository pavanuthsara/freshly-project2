import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, ShoppingBag, Home, LogOut, BookOpen, Leaf, ShoppingCart } from 'lucide-react';

const BuyerSidebar = ({ activeTab }) => {
  return (
    <aside className="w-64 bg-white shadow-lg h-screen sticky top-0 z-10 overflow-y-auto">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
        <div className="flex items-center space-x-3">
          <Leaf className="h-8 w-8 text-white" />
          <div>
            <h2 className="text-xl font-bold">Farm Fresh</h2>
            <p className="text-xs text-emerald-100 opacity-80 mt-1">Buyer Dashboard</p>
          </div>
        </div>
      </div>
      
      <nav className="py-6">
        <div className="px-4 mb-4">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</span>
        </div>
        
        <ul className="space-y-1 px-2">
          <li>
            <NavLink
              to="/buyer/profile"
              className={({ isActive }) => 
                `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive || activeTab === 'profile'
                    ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <div className={`mr-3 ${
                activeTab === 'profile' 
                  ? 'bg-emerald-100 p-2 rounded-md text-emerald-600' 
                  : 'text-gray-400 p-2'
              }`}>
                <User className="h-5 w-5" />
              </div>
              <span>My Profile</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink
              to="/buyer/profile/orders"
              className={({ isActive }) => 
                `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive || activeTab === 'orders'
                    ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <div className={`mr-3 ${
                activeTab === 'orders' 
                  ? 'bg-emerald-100 p-2 rounded-md text-emerald-600' 
                  : 'text-gray-400 p-2'
              }`}>
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span>My Orders</span>
            </NavLink>
          </li>
        </ul>
        
        <div className="px-4 pt-6 pb-2 mt-4">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Shopping</span>
        </div>
        
        <ul className="space-y-1 px-2">
          <li>
            <NavLink
              to="/products"
              className={({ isActive }) => 
                `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <div className="mr-3 text-gray-400 p-2">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <span>Shop All</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink
              to="/products?category=books"
              className={({ isActive }) => 
                `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <div className="mr-3 text-gray-400 p-2">
                <BookOpen className="h-5 w-5" />
              </div>
              <span>Shop by Category</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => 
                `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
              end
            >
              <div className="mr-3 text-gray-400 p-2">
                <Home className="h-5 w-5" />
              </div>
              <span>Home</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      
      <div className="px-4 pb-8 absolute bottom-0 w-full">
        <NavLink
          to="/logout"
          className={({ isActive }) => 
            `flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-red-600 hover:bg-red-50 ${
              isActive ? 'bg-red-50 font-medium' : ''
            }`
          }
        >
          <div className="mr-3 p-2">
            <LogOut className="h-5 w-5" />
          </div>
          <span>Logout</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default BuyerSidebar;