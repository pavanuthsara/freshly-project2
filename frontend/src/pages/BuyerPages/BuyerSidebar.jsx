// src/components/BuyerSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import './BuyerSidebar.css';

const BuyerSidebar = () => {
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
              className={({ isActive }) => (isActive ? 'active-link' : '')}
            >
              My Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/buyer/orders"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
            >
              My Orders
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/logout"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
            >
              Logout
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default BuyerSidebar;
