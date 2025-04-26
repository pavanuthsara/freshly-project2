import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUser, FaShoppingBag, FaHome, FaSignOutAlt, FaBook } from 'react-icons/fa';

const BuyerSidebar = ({ activeTab }) => {
  return (
    <aside className="w-64 bg-white shadow-md h-screen sticky top-0 z-10">
      <div className="bg-green-600 text-white p-4">
        <h2 className="text-xl font-bold">Buyer Panel</h2>
      </div>
      
      <nav className="py-4">
        <ul className="space-y-1">
          <li>
            <NavLink
              to="/buyer/profile"
              className={({ isActive }) => 
                `flex items-center px-4 py-3 text-gray-700 transition-colors ${
                  isActive || activeTab === 'profile' 
                    ? 'bg-green-50 text-green-700 border-l-4 border-green-600' 
                    : 'hover:bg-gray-100'
                }`
              }
            >
              <FaUser className={`mr-3 ${
                activeTab === 'profile' ? 'text-green-600' : 'text-gray-500'
              }`} />
              <span>My Profile</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink
              to="/buyer/profile/orders"
              className={({ isActive }) => 
                `flex items-center px-4 py-3 text-gray-700 transition-colors ${
                  isActive || activeTab === 'orders' 
                    ? 'bg-green-50 text-green-700 border-l-4 border-green-600' 
                    : 'hover:bg-gray-100'
                }`
              }
            >
              <FaShoppingBag className={`mr-3 ${
                activeTab === 'orders' ? 'text-green-600' : 'text-gray-500'
              }`} />
              <span>My Orders</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink
              to="/products?category=books"
              className={({ isActive }) => 
                `flex items-center px-4 py-3 text-gray-700 transition-colors ${
                  isActive 
                    ? 'bg-green-50 text-green-700 border-l-4 border-green-600' 
                    : 'hover:bg-gray-100'
                }`
              }
            >
              <FaBook className="mr-3 text-gray-500" />
              <span>Shop Now</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => 
                `flex items-center px-4 py-3 text-gray-700 transition-colors ${
                  isActive 
                    ? 'bg-green-50 text-green-700 border-l-4 border-green-600' 
                    : 'hover:bg-gray-100'
                }`
              }
              end
            >
              <FaHome className="mr-3 text-gray-500" />
              <span>Home</span>
            </NavLink>
          </li>
          
          <li className="mt-6 border-t border-gray-200 pt-4">
            <NavLink
              to="/logout"
              className={({ isActive }) => 
                `flex items-center px-4 py-3 text-red-600 transition-colors hover:bg-red-50 ${
                  isActive 
                    ? 'bg-red-50 border-l-4 border-red-600' 
                    : ''
                }`
              }
            >
              <FaSignOutAlt className="mr-3" />
              <span>Logout</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default BuyerSidebar;