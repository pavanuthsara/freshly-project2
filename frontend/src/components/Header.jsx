import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import './Header.css';

const Header = ({ user, setUser, cartItems = [] }) => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Freshly.lk</Link>
      </div>

      <div className="nav">
        <Link to="/cart" className="nav-item">
          <FaShoppingCart />
          {cartItems.length > 0 && (
            <span className="cart-badge">
              {cartItems.reduce((acc, item) => acc + item.qty, 0)}
            </span>
          )}
        </Link>

        {user ? (
          <>
            <span className="username">Hi, {user.name}</span>
            <button className="logout-btn" onClick={logoutHandler}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="nav-item">
            <FaUser style={{ marginRight: '5px' }} />
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
