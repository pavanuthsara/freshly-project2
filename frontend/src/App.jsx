import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

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

// Driver Pages
import Home from './pages/DeliveryPages/HomePage';
import Sidebar from './components/DriverDashboardComponents/sidebar.component';
import DriverSignInSignUp from './pages/DeliveryPages/DriverSignInSignUp';
import Dashboard from './pages/DeliveryPages/Dashboard';
import Profile from './pages/DeliveryPages/Profile';
import DeliveryRequests from './pages/DeliveryPages/DeliveryRequests';
import AcceptedRequests from './pages/DeliveryPages/AcceptedRequests';
import DriverNotifications from './pages/DeliveryPages/DriverNotifications';

// Function to check if the driver is authenticated
const checkDriverAuthentication = () => {
  const token = localStorage.getItem('token') || document.cookie.split('; ').find(row => row.startsWith('jwt='));
  return !!token;
};

// Function to check if the farmer is authenticated
const checkFarmerAuthentication = () => {
  const token = localStorage.getItem('farmerToken') || document.cookie.split('; ').find(row => row.startsWith('farmerJwt='));
  return !!token;
};

function App() {
  // Buyer state
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  // Driver state
  const [isDriverAuthenticated, setIsDriverAuthenticated] = useState(false);
  const [driverUser, setDriverUser] = useState(null);

  // Farmer state
  const [isFarmerAuthenticated, setIsFarmerAuthenticated] = useState(false);

  useEffect(() => {
    // Check driver authentication
    setIsDriverAuthenticated(checkDriverAuthentication());
    // Check farmer authentication
    setIsFarmerAuthenticated(checkFarmerAuthentication());

    // Load cart items
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing saved cart:', error);
      }
    }

    // Check buyer auth status
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

  // Layout component for authenticated driver routes
  const AuthenticatedDriverLayout = ({ children }) => {
    return (
      <div className="flex min-h-screen">
        <Sidebar user={driverUser} />
        <main className="flex-grow ml-64 p-4">{children}</main>
      </div>
    );
  };

  return (
    <Router>
      <div className="min-h-screen">
        <ToastContainer />
        
        {/* Show header only for buyer/farmer routes */}
        <Routes>
          <Route path="/drivers/*" element={null} />
          <Route path="/*" element={<Header user={user} setUser={setUser} cartItems={cartItems} />} />
        </Routes>

        <main>
          <Routes>
            {/* Buyer Routes */}
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
            
            {/* Farmer Routes */}
            {isFarmerAuthenticated ? (
              <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
            ) : (
              <Route path="/farmer-dashboard" element={<Navigate to="/" />} />
            )}

            {/* Driver Routes */}
            <Route path="/drivers/login" element={<DriverSignInSignUp setUser={setDriverUser} setIsAuthenticated={setIsDriverAuthenticated} />} />
            
            {/* Protected Driver Routes */}
            {isDriverAuthenticated ? (
              <>
                <Route path="/drivers/dashboard" element={<AuthenticatedDriverLayout><Dashboard user={driverUser}/></AuthenticatedDriverLayout>} />
                <Route path="/drivers/profile" element={<AuthenticatedDriverLayout><Profile /></AuthenticatedDriverLayout>} />
                <Route path="/drivers/delivery-requests" element={<AuthenticatedDriverLayout><DeliveryRequests /></AuthenticatedDriverLayout>} />
                <Route path="/drivers/accepted-requests" element={<AuthenticatedDriverLayout><AcceptedRequests /></AuthenticatedDriverLayout>} />
                <Route path="/drivers/notifications" element={<AuthenticatedDriverLayout><DriverNotifications /></AuthenticatedDriverLayout>} />
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
        </main>
      </div>
    </Router>
  );
}

export default App;