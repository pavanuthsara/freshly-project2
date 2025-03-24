import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

// Pages or components
import Home from './pages/DeliveryPages/HomePage.jsx';
import Sidebar from './components/DriverDashboardComponents/sidebar.component.jsx';
import DriverSignInSignUp from './pages/DeliveryPages/DriverSignInSignUp.jsx';
import Dashboard from './pages/DeliveryPages/Dashboard.jsx';
import Profile from './pages/DeliveryPages/Profile.jsx';
import DeliveryRequests from './pages/DeliveryPages/DeliveryRequests.jsx';
import AcceptedRequests from './pages/DeliveryPages/AcceptedRequests.jsx';

// Function to check if the user is authenticated
const checkAuthentication = () => {
  const token = document.cookie.split('; ').find(row => row.startsWith('jwt='));
  return token ? true : false;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication when the component mounts
    setIsAuthenticated(checkAuthentication());
  }, []); // This runs only once after the component mounts

  return (
    <div>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/drivers/login" element={<DriverSignInSignUp />} />
          
          {/* Protected Routes (Requires Authentication) */}
          {isAuthenticated ? (
            <>
              <Route path="/drivers/dashboard" element={<Sidebar />} />
              <Route path="/drivers/profile" element={<Profile />} />
              <Route path="/drivers/delivery-requests" element={<DeliveryRequests />} />
              <Route path="/drivers/accepted-requests" element={<AcceptedRequests />} />
            </>
          ) : (
            // Redirect unauthenticated users to login
            <>
              <Route path="/drivers/dashboard" element={<Navigate to="/drivers/login" />} />
              <Route path="/drivers/profile" element={<Navigate to="/drivers/login" />} />
              <Route path="/drivers/delivery-requests" element={<Navigate to="/drivers/login" />} />
              <Route path="/drivers/accepted-requests" element={<Navigate to="/drivers/login" />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
