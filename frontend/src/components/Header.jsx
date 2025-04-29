import { useNavigate } from 'react-router-dom';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Leaf } from 'lucide-react';

const Header = ({ user, setUser, cartItems }) => {
  const navigate = useNavigate();
  
  // Handle logout with proper backend call
  const handleLogout = async () => {
    try {
      // Call the backend logout endpoint to clear the cookie
      const response = await fetch('/api/buyers/logout', {
        method: 'POST',
        credentials: 'include' // Important for cookies to be included
      });
      
      if (response.ok) {
        // Clear the user state
        setUser(null);
        navigate('/buyer/login');
      } else {
        console.error('Logout failed:', await response.json());
        // Still clear user state even if API fails
        setUser(null);
        navigate('/buyer/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      navigate('/buyer/login');
    }
  };

  return (
    <header className="bg-white shadow-sm py-3 fixed top-0 w-full z-10">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <Leaf className="h-6 w-6 text-green-600" />
          <span className="ml-2 font-semibold text-gray-800">Freshly.Lk</span>
        </Link>
        
        {/* Nav Links */}
        <nav className="flex items-center space-x-6">
          <NavLink to="/" className="text-gray-600 hover:text-green-600">Home</NavLink>
          <NavLink to="/products" className="text-gray-600 hover:text-green-600">Products</NavLink>
          
          {/* Cart */}
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-5 w-5 text-gray-600" />
            {cartItems && cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>
          
          {/* Auth */}
          {user ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm">{user.name}</span>
              <button 
                onClick={handleLogout}
                className="flex items-center bg-red-100 text-red-600 px-2 py-1 rounded text-sm"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          ) : (
            <Link to="/buyer/login" className="bg-green-600 text-white px-3 py-1 rounded text-sm">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;