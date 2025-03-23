import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useState } from 'react'

// Buyer Pages
import HomePage from './pages/HomePage';
import BuyerLogin from './pages/BuyerPages/BuyerLogin';
import BuyerRegister from './pages/BuyerPages/RegisterPage';
import BuyerProfile from './pages/BuyerPages/BuyerProfile';

// Farmer Pages
import FarmerDashboard from './pages/FarmerPages/FarmerDashboard';
import SignInSignUp from './pages/SignInSignUp';
import AnalyticsDashboard from './components/FarmerDashboardComponents/AnalyticsDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Buyer Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/buyer/login" element={<BuyerLogin />} />
        <Route path="/buyer/register" element={<BuyerRegister />} />
        <Route path="/buyer/profile" element={<BuyerProfile />} />

        {/* Farmer Routes */}
        <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
