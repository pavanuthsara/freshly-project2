import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut, Leaf } from 'lucide-react';

const Header = ({ user, setUser, cartItems }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  
  // Track scroll position to add shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    navigate('/buyer/login');
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white bg-opacity-95'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-semibold text-gray-800">Freshly.Lk</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `text-base font-medium hover:text-green-600 transition ${isActive ? 'text-green-600' : 'text-gray-600'}`
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/products" 
              className={({ isActive }) => 
                `text-base font-medium hover:text-green-600 transition ${isActive ? 'text-green-600' : 'text-gray-600'}`
              }
            >
              Products
            </NavLink>
            {user && (
              <NavLink 
                to="/farmer-dashboard" 
                className={({ isActive }) => 
                  `text-base font-medium hover:text-green-600 transition ${isActive ? 'text-green-600' : 'text-gray-600'}`
                }
              >
                Farmer Dashboard
              </NavLink>
            )}
          </nav>

          {/* User Controls */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Cart with counter badge */}
            <Link to="/cart" className="relative p-1">
              <ShoppingCart className="h-6 w-6 text-gray-600 hover:text-green-600 transition" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* User dropdown or login button */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-green-600 transition">
                  <span className="mr-2 text-sm font-medium">{user.name}</span>
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-green-600" />
                  </div>
                </button>
                
                {/* Dropdown */}
                <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <Link to="/buyer/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </Link>
                  </div>
                  <div className="py-1">
                    <button 
                      onClick={handleLogout} 
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link 
                to="/buyer/login" 
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button 
              onClick={toggleMenu}
              type="button"
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <span className="sr-only">Open menu</span>
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 bg-white">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'}`
            }
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink 
            to="/products" 
            className={({ isActive }) => 
              `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'}`
            }
            onClick={() => setIsMenuOpen(false)}
          >
            Products
          </NavLink>
          {user && (
            <NavLink 
              to="/farmer-dashboard" 
              className={({ isActive }) => 
                `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'}`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Farmer Dashboard
            </NavLink>
          )}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200 bg-white">
          <div className="flex items-center px-5">
            {user ? (
              <>
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user.name}</div>
                </div>
                <div className="ml-auto flex items-center space-x-4">
                  <Link 
                    to="/cart" 
                    className="relative p-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingCart className="h-6 w-6 text-gray-600" />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItems.length}
                      </span>
                    )}
                  </Link>
                </div>
              </>
            ) : (
              <Link 
                to="/buyer/login" 
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
          {user && (
            <div className="mt-3 px-2 space-y-1">
              <Link 
                to="/buyer/profile" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                My Profile
              </Link>
              <button 
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }} 
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;