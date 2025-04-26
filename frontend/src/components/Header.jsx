import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
// Removed CSS import

const Header = ({ user, setUser, cartItems = [] }) => {
  const navigate = useNavigate();
  
  const logoutHandler = () => {
    setUser(null); // clear user
    navigate('/login');
  };
  
  return (
    <header className="bg-green-600 text-white py-4 px-6 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link to="/" className="text-white hover:text-green-100 transition-colors">Freshly.lk</Link>
        </div>
        
        <div className="flex items-center space-x-6">
          <Link to="/cart" className="text-white hover:text-green-100 transition-colors relative">
            <FaShoppingCart className="text-xl" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItems.reduce((acc, item) => acc + item.qty, 0)}
              </span>
            )}
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm hidden md:inline">Hello, {user.name || 'User'}</span>
              <button 
                onClick={logoutHandler}
                className="bg-white text-green-600 hover:bg-green-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="bg-white text-green-600 hover:bg-green-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
            >
              <FaUser className="mr-2" />
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;