import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import './App.css';

// Header
import Header from './components/Header';

// Buyer Pages
import HomePage from './pages/HomePage';
import BuyerLogin from './pages/BuyerPages/BuyerLogin';
import BuyerRegister from './pages/BuyerPages/RegisterPage';
import BuyerProfile from './pages/BuyerPages/BuyerProfile';
import ProductListPage from './pages/BuyerPages/ProductListPage';
import CartPage from './pages/BuyerPages/CartPage';

// Farmer Pages
import FarmerDashboard from './pages/FarmerPages/FarmerDashboard';

function App() {
  const [user, setUser] = useState({ name: 'Damith' }); // Simulated login

  const [cartItems, setCartItems] = useState([]); // Start with empty cart

  return (
    <Router>
      <Header user={user} setUser={setUser} cartItems={cartItems} />

      <div style={{ marginTop: '70px' }}>
        <Routes>
          {/* Buyer Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/buyer/login" element={<BuyerLogin />} />
          <Route path="/buyer/register" element={<BuyerRegister />} />
          <Route path="/buyer/profile" element={<BuyerProfile />} />
          <Route path="/products" element={<ProductListPage cartItems={cartItems} setCartItems={setCartItems} />} />
          <Route path="/cart" element={<CartPage cartItems={cartItems} setCartItems={setCartItems} />} />

          {/* Farmer Routes */}
          <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;