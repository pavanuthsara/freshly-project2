import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUser, FaShoppingBag, FaHome, FaSignOutAlt, FaBook } from 'react-icons/fa';
import './BuyerSidebar.css';

const BuyerSidebar = ({ activeTab }) => {
  return (
    <aside className="buyer-sidebar">
      <div className="sidebar-header">
        <h2>Buyer Panel</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink
              to="/buyer/profile"
              className={({ isActive }) => (isActive || activeTab === 'profile' ? 'active-link' : '')}
            >
              <FaUser className="menu-icon" /> My Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/buyer/profile/orders"
              className={({ isActive }) => (isActive || activeTab === 'orders' ? 'active-link' : '')}
            >
              <FaShoppingBag className="menu-icon" /> My Orders
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/products?category=books"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
            >
              <FaBook className="menu-icon" /> Shop Now
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
            >
              <FaHome className="menu-icon" /> Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/logout"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
            >
              <FaSignOutAlt className="menu-icon" /> Logout
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default BuyerSidebar;