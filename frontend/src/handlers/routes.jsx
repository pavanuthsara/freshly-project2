import { Navigate } from 'react-router-dom';

// Home Page
import HomePage from '../components/HomePage.jsx';
import LoginDashboard from '../components/LoginDashboard.jsx';

// Delivery Pages
import DriverSignInSignUp from '../pages/DeliveryPages/DriverSignInSignUp.jsx';
import Dashboard from '../pages/DeliveryPages/Dashboard.jsx';
import Profile from '../pages/DeliveryPages/Profile.jsx';
import DeliveryRequests from '../pages/DeliveryPages/DeliveryRequests.jsx';
import AcceptedRequests from '../pages/DeliveryPages/AcceptedRequests.jsx';
import DriverNotifications from '../pages/DeliveryPages/DriverNotifications.jsx';

// Buyer Pages
import BuyerLogin from '../pages/BuyerPages/BuyerLogin';
import BuyerRegister from '../pages/BuyerPages/BuyerRegister';
import BuyerProfile from '../pages/BuyerPages/BuyerProfile';
import BuyerDashboard from '../pages/BuyerPages/BuyerDashboard';
import ProductListPage from '../pages/BuyerPages/ProductListPage';
import CartPage from '../pages/BuyerPages/CartPage';
import ShippingPage from '../pages/BuyerPages/ShippingPage';
import PaymentPage from '../pages/BuyerPages/PaymentPage';
import ConfirmOrderPage from '../pages/BuyerPages/ConfirmOrderPage';
import BuyerOrderDetails from '../pages/BuyerPages/BuyerOrderDetails';
import BuyerOrders from '../pages/BuyerPages/BuyerOrders';
import ComplaintHistory from '../pages/BuyerPages/ComplaintHistory';
import ReviewPage from '../pages/BuyerPages/ReviewPage.jsx';
import ReviewList from '../pages/BuyerPages/ReviewList.jsx';
import ReviewEditPage from '../pages/BuyerPages/ReviewEditPage.jsx';

// Farmer Pages
import FarmerDashboard from '../pages/FarmerPages/FarmerDashboard';
import ProductSection from '../pages/FarmerPages/MyProduct';
import ProfileSection from '../pages/FarmerPages/MyProfile';
import FarmerProductPreview from '../pages/FarmerPages/FarmerProductPreview';
import Login from '../pages/FarmerPages/Login';
import Register from '../pages/FarmerPages/Register';
import FarmerForgotPassword from '../pages/FarmerPages/FarmerFogortPassword';
import FarmerResetPassword from '../pages/FarmerPages/FarmerResetPassword';

// Admin Pages
import AdminLogin from '../pages/AdminPages/AdminLogin';
import AdminDashboard from '../pages/AdminPages/AdminDashboard';
import AdminUsers from '../pages/AdminPages/AdminUsers';
import AdminOrders from '../pages/AdminPages/AdminOrders';
import AdminRegister from '../pages/AdminPages/AdminRegister';
import AdminRefunds from '../pages/AdminPages/AdminRefunds';

// Layout Components
import PageWrapper from '../components/PageWrapper';
import Sidebar from '../components/DriverDashboardComponents/sidebar.component.jsx';

// Authenticated Layout for Driver Routes
const AuthenticatedLayout = ({ children, user, setIsAuthenticated }) => (
  <div className="flex min-h-screen">
    <Sidebar user={user} setIsAuthenticated={setIsAuthenticated} />
    <main className="flex-grow ml-64 p-4">{children}</main>
  </div>
);

// Route Definitions
export const routes = (
  isAuthenticated,
  user,
  setIsAuthenticated,
  setUser,
  cartItems,
  setCartItems,
  shippingAddress,
  setShippingAddress,
  paymentMethod,
  setPaymentMethod,
  farmerData,
  handleLoginSuccess,
  handleLogout,
  handleRegistrationSuccess
) => [
  // Public Routes
  { path: '/', element: <HomePage /> },
  { path: '/login-dashboard', element: <LoginDashboard /> },
  {
    path: '/drivers/login',
    element: isAuthenticated ? (
      <Navigate to="/drivers/dashboard" />
    ) : (
      <DriverSignInSignUp setUser={setUser} setIsAuthenticated={setIsAuthenticated} />
    ),
  },
  {
    path: '/buyer/login',
    element: isAuthenticated ? (
      <Navigate to="/buyer/dashboard" />
    ) : (
      <BuyerLogin setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
    ),
  },
  { path: '/buyer/register', element: <BuyerRegister /> },
  { path: '/admin/login', element: <AdminLogin /> },
  { path: '/admin/register', element: <AdminRegister /> },
  {
    path: '/farmer-login',
    element: !isAuthenticated ? (
      <Login onLoginSuccess={handleLoginSuccess} />
    ) : (
      <Navigate to="/farmer/products" />
    ),
  },
  {
    path: '/farmer-register',
    element: !isAuthenticated ? (
      <Register onRegistrationSuccess={handleRegistrationSuccess} />
    ) : (
      <Navigate to="/farmer/products" />
    ),
  },
  {
    path: '/farmer-forgot-password',
    element: !isAuthenticated ? (
      <FarmerForgotPassword />
    ) : (
      <Navigate to="/farmer/products" />
    ),
  },
  {
    path: '/farmer-reset-password',
    element: !isAuthenticated ? (
      <FarmerResetPassword />
    ) : (
      <Navigate to="/farmer/products" />
    ),
  },

  // Protected Routes
  {
    path: '/drivers/dashboard',
    element: isAuthenticated ? (
      <AuthenticatedLayout user={user} setIsAuthenticated={setIsAuthenticated}>
        <Dashboard user={user} />
      </AuthenticatedLayout>
    ) : (
      <Navigate to="/drivers/login" />
    ),
  },
  {
    path: '/drivers/profile',
    element: isAuthenticated ? (
      <AuthenticatedLayout user={user} setIsAuthenticated={setIsAuthenticated}>
        <Profile />
      </AuthenticatedLayout>
    ) : (
      <Navigate to="/drivers/login" />
    ),
  },
  {
    path: '/drivers/delivery-requests',
    element: isAuthenticated ? (
      <AuthenticatedLayout user={user} setIsAuthenticated={setIsAuthenticated}>
        <DeliveryRequests />
      </AuthenticatedLayout>
    ) : (
      <Navigate to="/drivers/login" />
    ),
  },
  {
    path: '/drivers/accepted-requests',
    element: isAuthenticated ? (
      <AuthenticatedLayout user={user} setIsAuthenticated={setIsAuthenticated}>
        <AcceptedRequests />
      </AuthenticatedLayout>
    ) : (
      <Navigate to="/drivers/login" />
    ),
  },
  {
    path: '/drivers/notifications',
    element: isAuthenticated ? (
      <AuthenticatedLayout user={user} setIsAuthenticated={setIsAuthenticated}>
        <DriverNotifications />
      </AuthenticatedLayout>
    ) : (
      <Navigate to="/drivers/login" />
    ),
  },
  {
    path: '/buyer/dashboard',
    element: isAuthenticated ? (
      <BuyerDashboard setUser={setUser} />
    ) : (
      <Navigate to="/buyer/login" />
    ),
  },
  {
    path: '/buyer/profile',
    element: isAuthenticated ? (
      <BuyerProfile />
    ) : (
      <Navigate to="/buyer/login" />
    ),
  },
  {
    path: '/products',
    element: isAuthenticated ? (
      <PageWrapper>
        <ProductListPage cartItems={cartItems} setCartItems={setCartItems} />
      </PageWrapper>
    ) : (
      <Navigate to="/buyer/login" />
    ),
  },
  {
    path: '/cart',
    element: isAuthenticated ? (
      <PageWrapper>
        <CartPage cartItems={cartItems} setCartItems={setCartItems} />
      </PageWrapper>
    ) : (
      <Navigate to="/buyer/login" />
    ),
  },
  {
    path: '/buyer/shipping',
    element: isAuthenticated ? (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ShippingPage
          shippingAddress={shippingAddress}
          setShippingAddress={setShippingAddress}
        />
      </div>
    ) : (
      <Navigate to="/buyer/login" />
    ),
  },
  {
    path: '/buyer/payment',
    element: isAuthenticated ? (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <PaymentPage
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />
      </div>
    ) : (
      <Navigate to="/buyer/login" />
    ),
  },
  {
    path: '/buyer/confirm',
    element: isAuthenticated ? (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ConfirmOrderPage
          cartItems={cartItems}
          shippingAddress={shippingAddress}
          paymentMethod={paymentMethod}
          setCartItems={setCartItems}
        />
      </div>
    ) : (
      <Navigate to="/buyer/login" />
    ),
  },
  {
    path: '/buyer/orders',
    element: isAuthenticated ? (
      <BuyerOrders />
    ) : (
      <Navigate to="/buyer/login" />
    ),
  },
  {
    path: '/buyer/order/:id',
    element: isAuthenticated ? (
      <BuyerOrderDetails />
    ) : (
      <Navigate to="/buyer/login" />
    ),
  },
  {
    path: '/buyer/complaints',
    element: isAuthenticated ? (
      <ComplaintHistory />
    ) : (
      <Navigate to="/buyer/login" />
    ),
  },
  {
    path: '/buyer/review',
    element: isAuthenticated ? (
      <ReviewPage />
    ) : (
      <Navigate to="/buyer/login" />
    ),
  },
  {
    path: '/buyer/reviewlist',
    element: isAuthenticated ? (
      <ReviewList />
    ) : (
      <Navigate to="/buyer/login" />
    ),
  },
  {
    path: '/buyer/review/edit',
    element: isAuthenticated ? (
      <ReviewEditPage />
    ) : (
      <Navigate to="/buyer/login" />
    ),
  },
  {
    path: '/farmer',
    element: isAuthenticated ? (
      <FarmerDashboard farmerData={farmerData} onLogout={handleLogout} />
    ) : (
      <Navigate to="/farmer-login" />
    ),
    children: [
      { path: 'products', element: <ProductSection farmerData={farmerData} /> },
      { path: 'profile', element: <ProfileSection farmerData={farmerData} /> },
      { path: 'complaints', element: <div className="text-3xl font-bold text-green-800">Complaints Section</div> },
      { path: 'analytics', element: <div className="text-3xl font-bold text-green-800">Analytics Section</div> },
      { path: 'help', element: <div className="text-3xl font-bold text-green-800">Help Bot Section</div> },
      { path: 'product/:id', element: <FarmerProductPreview /> },
    ],
  },
  {
    path: '/farmer-dashboard',
    element: isAuthenticated ? (
      <FarmerDashboard farmerData={farmerData} onLogout={handleLogout} />
    ) : (
      <Navigate to="/farmer-login" />
    ),
  },
  {
    path: '/admin/dashboard',
    element: isAuthenticated ? (
      <AdminDashboard />
    ) : (
      <Navigate to="/admin/login" />
    ),
  },
  {
    path: '/admin/users',
    element: isAuthenticated ? (
      <AdminUsers />
    ) : (
      <Navigate to="/admin/login" />
    ),
  },
  {
    path: '/admin/orders',
    element: isAuthenticated ? (
      <AdminOrders />
    ) : (
      <Navigate to="/admin/login" />
    ),
  },
  {
    path: '/admin/refunds',
    element: isAuthenticated ? (
      <AdminRefunds />
    ) : (
      <Navigate to="/admin/login" />
    ),
  },
];