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
  // User state management
  const [user, setUser] = useState({ name: 'Damith' }); // Simulated login
  const [cartItems, setCartItems] = useState([]); // Cart items
  
  // Checkout information states
  const [shippingAddress, setShippingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  
  // Load saved cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing saved cart:', error);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header user={user} setUser={setUser} cartItems={cartItems} />
        
        <main className="flex-grow pt-16"> {/* pt-16 accounts for fixed header height */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Routes>
              {/* Buyer Routes */}
              <Route path="/" element={<HomePage />} />
              
              {/* Authentication Routes */}
              <Route path="/buyer/login" element={<BuyerLogin />} />
              <Route path="/buyer/register" element={<BuyerRegister />} />
              
              {/* User Profile Route */}
              <Route path="/buyer/profile/*" element={<BuyerProfile />} />
              
              {/* Shopping Routes */}
              <Route 
                path="/products" 
                element={
                  <ProductListPage 
                    cartItems={cartItems} 
                    setCartItems={setCartItems} 
                  />
                } 
              />
              <Route 
                path="/cart" 
                element={
                  <CartPage 
                    cartItems={cartItems} 
                    setCartItems={setCartItems} 
                  />
                } 
              />
              
              {/* Order Management Routes */}
              <Route path="/order/:id" element={<BuyerOrderDetails />} />
              
              {/* Checkout Flow Routes */}
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
        </main>
        
        <footer className="bg-green-800 text-white py-6 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Farm Fresh</h3>
                <p className="text-green-100">
                  Connecting farmers directly with buyers for the freshest agricultural products.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="/" className="text-green-100 hover:text-white transition">Home</a></li>
                  <li><a href="/products" className="text-green-100 hover:text-white transition">Products</a></li>
                  <li><a href="/buyer/profile" className="text-green-100 hover:text-white transition">My Account</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                <address className="not-italic text-green-100">
                  <p>123 Farm Road</p>
                  <p>Colombo, Sri Lanka</p>
                  <p className="mt-2">contact@farmfresh.com</p>
                  <p>+94 123 456789</p>
                </address>
              </div>
            </div>
            <div className="border-t border-green-700 mt-8 pt-6 text-center text-green-100">
              <p>© {new Date().getFullYear()} Farm Fresh. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;