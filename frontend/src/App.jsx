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
import ShippingPage from './pages/BuyerPages/ShippingPage';
import PaymentPage from './pages/BuyerPages/PaymentPage';
import ConfirmOrderPage from './pages/BuyerPages/ConfirmOrderPage';

// Farmer Pages
import FarmerDashboard from './pages/FarmerPages/FarmerDashboard';

function App() {
  const [user, setUser] = useState({ name: 'Damith' }); // Simulated login
  const [cartItems, setCartItems] = useState([]); // Cart items
  
  // ✅ New states for shipping and payment
  const [shippingAddress, setShippingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  
  return (
    <Router>
      <Header user={user} setUser={setUser} cartItems={cartItems} />
      
      <div style={{ marginTop: '70px' }}>
        <Routes>
          {/* Buyer Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/buyer/login" element={<BuyerLogin />} />
          <Route path="/buyer/register" element={<BuyerRegister />} />
          
          {/* Updated BuyerProfile route with wildcard for nested routes */}
          <Route path="/buyer/profile/*" element={<BuyerProfile />} />
          
          <Route path="/products" element={<ProductListPage cartItems={cartItems} setCartItems={setCartItems} />} />
          <Route path="/cart" element={<CartPage cartItems={cartItems} setCartItems={setCartItems} />} />
          
          {/* ✅ New Buyer Checkout Routes */}
          <Route
            path="/buyer/shipping"
            element={
              <ShippingPage
                shippingAddress={shippingAddress}
                setShippingAddress={setShippingAddress}
              />
            }
          />
          <Route
            path="/buyer/payment"
            element={
              <PaymentPage
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />
            }
          />
          <Route
            path="/buyer/confirm-order"
            element={
              <ConfirmOrderPage
                cartItems={cartItems}
                shippingAddress={shippingAddress}
                paymentMethod={paymentMethod}
                setCartItems={setCartItems}
              />
            }
          />
          
          {/* Farmer Routes */}
          <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;