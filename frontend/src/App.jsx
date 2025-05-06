import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import './App.css';

// Farmer Components
import FarmerDashboard from './pages/FarmerPages/FarmerDashboard';
import ProductSection from './pages/FarmerPages/MyProduct';
import ProfileSection from './pages/FarmerPages/MyProfile';
import FarmerProductPreview from './pages/FarmerPages/FarmerProductPreview';
import Login from './pages/FarmerPages/Login';
import Register from './pages/FarmerPages/Register';
import FarmerForgotPassword from './pages/FarmerPages/FarmerFogortPassword';
import FarmerResetPassword from './pages/FarmerPages/FarmerResetPassword';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [farmerData, setFarmerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('farmerToken');
      console.log('App: Checking farmerToken:', !!token);
      if (token) {
        console.log('App: Token found, setting isAuthenticated to true');
        setIsAuthenticated(true);
      } else {
        console.log('App: No token, setting isAuthenticated to false');
        setIsAuthenticated(false);
        setFarmerData(null);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLoginSuccess = (data) => {
    console.log('App: handleLoginSuccess called with data:', data);
    setIsAuthenticated(true);
    setFarmerData(data);
  };

  const handleLogout = () => {
    console.log('App: handleLogout called');
    localStorage.removeItem('farmerToken');
    setIsAuthenticated(false);
    setFarmerData(null);
  };

  const handleRegistrationSuccess = (data) => {
    console.log('App: handleRegistrationSuccess called with data:', data);
    setIsAuthenticated(true);
    setFarmerData(data);
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            zIndex: 9999,
          },
        }}
      />
      <Routes>
        <Route 
          path="/farmer-login" 
          element={
            !isAuthenticated ? 
            <Login onLoginSuccess={handleLoginSuccess} /> : 
            <Navigate to="/farmer/products" />
          } 
        />
        <Route 
          path="/farmer-register" 
          element={
            !isAuthenticated ? 
            <Register onRegistrationSuccess={handleRegistrationSuccess} /> : 
            <Navigate to="/farmer/products" />
          } 
        />
        <Route 
          path="/farmer-forgot-password" 
          element={
            !isAuthenticated ? 
            <FarmerForgotPassword /> : 
            <Navigate to="/farmer/products" />
          } 
        />
        <Route 
          path="/farmer-reset-password" 
          element={
            !isAuthenticated ? 
            <FarmerResetPassword /> : 
            <Navigate to="/farmer/products" />
          } 
        />
        <Route 
          path="/farmer" 
          element={
            isAuthenticated ? 
            <FarmerDashboard farmerData={farmerData} onLogout={handleLogout} /> : 
            <Navigate to="/farmer-login" />
          }
        >
          <Route path="products" element={<ProductSection farmerData={farmerData} />} />
          <Route path="profile" element={<ProfileSection farmerData={farmerData} />} />
          <Route path="complaints" element={<div className="text-3xl font-bold text-green-800">Complaints Section</div>} />
          <Route path="analytics" element={<div className="text-3xl font-bold text-green-800">Analytics Section</div>} />
          <Route path="help" element={<div className="text-3xl font-bold text-green-800">Help Bot Section</div>} />
          <Route path="product/:id" element={<FarmerProductPreview />} />
        </Route>
        <Route 
          path="/" 
          element={<Navigate to="/farmer-login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;