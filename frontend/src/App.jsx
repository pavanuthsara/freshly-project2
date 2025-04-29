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
import DriverNotifications from './pages/DeliveryPages/DriverNotifications.jsx';

// Function to check if the user is authenticated
const checkAuthentication = () => {
  const token = localStorage.getItem('token') || document.cookie.split('; ').find(row => row.startsWith('jwt='));
  return !!token;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setIsAuthenticated(checkAuthentication());
  }, []);

  // Layout component for authenticated routes
  const AuthenticatedLayout = ({ children }) => {
    return (
      <div className="flex min-h-screen">
        <Sidebar user={user} />
        <main className="flex-grow ml-64 p-4">{children}</main>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route
            path="/drivers/login"
            element={<DriverSignInSignUp setUser={setUser} setIsAuthenticated={setIsAuthenticated} />}
          />
          
          {/* Protected Routes (Requires Authentication) */}
          {isAuthenticated ? (
            <>
              <Route 
                path="/drivers/dashboard" 
                element={
                  <AuthenticatedLayout>
                    <Dashboard />
                  </AuthenticatedLayout>
                } 
              />
              <Route 
                path="/drivers/profile" 
                element={
                  <AuthenticatedLayout>
                    <Profile />
                  </AuthenticatedLayout>
                } 
              />
              <Route 
                path="/drivers/delivery-requests" 
                element={
                  <AuthenticatedLayout>
                    <DeliveryRequests />
                  </AuthenticatedLayout>
                } 
              />
              <Route 
                path="/drivers/accepted-requests" 
                element={
                  <AuthenticatedLayout>
                    <AcceptedRequests />
                  </AuthenticatedLayout>
                } 
              />
              <Route 
                path="/drivers/notifications" 
                element={
                  <AuthenticatedLayout>
                    <DriverNotifications />
                  </AuthenticatedLayout>
                } 
              />
            </>
          ) : (
            <>
              <Route path="/drivers/dashboard" element={<Navigate to="/drivers/login" />} />
              <Route path="/drivers/profile" element={<Navigate to="/drivers/login" />} />
              <Route path="/drivers/delivery-requests" element={<Navigate to="/drivers/login" />} />
              <Route path="/drivers/accepted-requests" element={<Navigate to="/drivers/login" />} />
              <Route path="/drivers/notifications" element={<Navigate to="/drivers/login" />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;