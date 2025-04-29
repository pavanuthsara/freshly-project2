import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';

// Header
import Header from './components/Header';

// Buyer Pages
import HomePage from './pages/HomePage';
import BuyerLogin from './pages/BuyerPages/BuyerLogin';
import BuyerRegister from './pages/BuyerPages/BuyerRegister';
import BuyerProfile from './pages/BuyerPages/BuyerProfile';
import ProductListPage from './pages/BuyerPages/ProductListPage';
import CartPage from './pages/BuyerPages/CartPage';
import ShippingPage from './pages/BuyerPages/ShippingPage';
import PaymentPage from './pages/BuyerPages/PaymentPage';
import ConfirmOrderPage from './pages/BuyerPages/ConfirmOrderPage';
import BuyerOrderDetails from './pages/BuyerPages/BuyerOrderDetails';

// Farmer Pages
import FarmerDashboard from './pages/FarmerPages/FarmerDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing saved cart:', error);
      }
    }
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/buyers/profile', {
          method: 'GET',
          credentials: 'include'
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    };
    checkAuthStatus();
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <Router>
      <div>
        <Header user={user} setUser={setUser} cartItems={cartItems} />

        <main>
          <div>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/buyer/login" element={<BuyerLogin setUser={setUser} />} />
              <Route path="/buyer/register" element={<BuyerRegister setUser={setUser} />} />
              <Route path="/buyer/profile/*" element={<BuyerProfile user={user} setUser={setUser} />} />
              <Route path="/products" element={<ProductListPage cartItems={cartItems} setCartItems={setCartItems} />} />
              <Route path="/cart" element={<CartPage cartItems={cartItems} setCartItems={setCartItems} />} />
              <Route path="/order/:id" element={<BuyerOrderDetails />} />
              <Route path="/buyer/shipping" element={<ShippingPage shippingAddress={shippingAddress} setShippingAddress={setShippingAddress} />} />
              <Route path="/buyer/payment" element={<PaymentPage paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />} />
              <Route path="/buyer/confirm-order" element={<ConfirmOrderPage cartItems={cartItems} shippingAddress={shippingAddress} paymentMethod={paymentMethod} setCartItems={setCartItems} />} />
              <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
