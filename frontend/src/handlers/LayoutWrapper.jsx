import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Toaster } from 'react-hot-toast';

const LayoutWrapper = ({ children, user, setUser, cartItems }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isDeliveryRoute = (path) => path.startsWith('/drivers');
  const isBuyerRoute = (path) =>
    path.startsWith('/buyer') ||
    path === '/products' ||
    path === '/cart' ||
    path === '/' ||
    path === '/login-dashboard';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {isBuyerRoute(currentPath) && !isDeliveryRoute(currentPath) && (
        <Header user={user} setUser={setUser} cartItems={cartItems} />
      )}
      <main className={`flex-grow ${isBuyerRoute(currentPath) && !isDeliveryRoute(currentPath) ? 'pt-16' : ''}`}>
        <ToastContainer position="top-right" autoClose={3000} />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              zIndex: 9999,
            },
          }}
        />
        {children}
      </main>
      {isBuyerRoute(currentPath) && !isDeliveryRoute(currentPath) && (
        <footer className="bg-white border-t border-gray-200 pt-10 pb-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-4">
                <div className="flex items-center mb-4">
                  <h2 className="text-xl font-bold text-teal-600">Freshly<span className="text-gray-800">.lk</span></h2>
                </div>
                <p className="text-gray-600 text-sm mb-6 pr-4">
                  Connecting Sri Lankan farmers directly with customers, delivering the freshest agricultural products to your doorstep.
                </p>
                <div className="flex space-x-4">
                  <a href="https://facebook.com" className="text-gray-400 hover:text-teal-500 transition-colors">
                    <span className="sr-only">Facebook</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="https://instagram.com" className="text-gray-400 hover:text-teal-500 transition-colors">
                    <span className="sr-only">Instagram</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.668.25 1.272.644 1.772 1.153.509.5.902 1.104 1.153 1.772.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772c-.5.509-1.104.902-1.772 1.153-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427.25-.668.644-1.272 1.153-1.772A4.902 4.902 0 016.455 2.525c.636-.247 1.363-.416 2.427-.465C9.925 2.013 10.282 2 12.315 2z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M12.315 6.086a5.918 5.918 0 10.001 11.836 5.918 5.918 0 000-11.836zm0 9.757a3.839 3.839 0 110-7.678 3.839 3.839 0 010 7.678z" clipRule="evenodd" />
                      <path d="M19.09 5.979a1.382 1.382 0 11-2.764 0 1.382 1.382 0 012.764 0z" />
                    </svg>
                  </a>
                  <a href="https://twitter.com" className="text-gray-400 hover:text-teal-500 transition-colors">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                </div>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-gray-800 tracking-wider uppercase">Products</h3>
                <ul className="mt-4 space-y-2">
                  <li><a href="/products" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">All Products</a></li>
                  <li><a href="/products?category=vegetables" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">Vegetables</a></li>
                  <li><a href="/products?category=fruits" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">Fruits</a></li>
                  <li><a href="/products?category=grains" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">Grains</a></li>
                </ul>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-gray-800 tracking-wider uppercase">Account</h3>
                <ul className="mt-4 space-y-2">
                  <li><a href="/buyer/profile" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">My Account</a></li>
                  <li><a href="/buyer/profile/orders" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">My Orders</a></li>
                  <li><a href="/cart" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">Shopping Cart</a></li>
                  <li><a href="/buyer/profile/settings" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">Settings</a></li>
                </ul>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-gray-800 tracking-wider uppercase">Company</h3>
                <ul className="mt-4 space-y-2">
                  <li><a href="/about" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">About Us</a></li>
                  <li><a href="/blog" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">Blog</a></li>
                  <li><a href="/careers" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">Careers</a></li>
                  <li><a href="/contact" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">Contact Us</a></li>
                </ul>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-gray-800 tracking-wider uppercase">Contact</h3>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-teal-500 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm text-gray-600">123 Farm Road, Colombo, Sri Lanka</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-teal-500 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-600">contact@freshly.lk</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-teal-500 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-sm text-gray-600">+94 123 456789</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-10 pt-6 border-t border-gray-200">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <p className="text-sm text-gray-500">
                  © {new Date().getFullYear()} Freshly.lk. All rights reserved.
                </p>
                <div className="mt-4 md:mt-0 flex space-x-6">
                  <a href="/terms" className="text-sm text-gray-500 hover:text-teal-600 transition-colors">Terms of Service</a>
                  <a href="/privacy" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">Privacy Policy</a>
                  <a href="/faqs" className="text-sm text-gray-500 hover:text-teal-600 transition-colors">FAQs</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default LayoutWrapper;