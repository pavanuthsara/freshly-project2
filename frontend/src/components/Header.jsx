import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut } from 'lucide-react';

const Header = ({ user, setUser, cartItems }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/buyer/login');
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-emerald-700 shadow-lg pb-2">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-white tracking-wide">
            Freshly.lk
          </Link>
          <div className="flex items-center gap-x-6">
            <Link to="/cart" className="relative p-2 hover:bg-emerald-800 rounded-full transition">
              <ShoppingCart className="h-6 w-6 text-white" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-emerald-700 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow">
                  {cartItems.length}
                </span>
              )}
            </Link>
            {user ? (
              <>
                <span className="text-white font-medium">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-x-1 px-3 py-1 bg-white text-emerald-700 rounded-full border border-emerald-200 hover:bg-emerald-50 transition text-sm font-semibold shadow"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/buyer/login"
                className="flex items-center gap-x-1 px-3 py-1 bg-white text-emerald-700 rounded-full border border-emerald-200 hover:bg-emerald-50 transition text-sm font-semibold shadow"
              >
                <User className="h-4 w-4" />
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;