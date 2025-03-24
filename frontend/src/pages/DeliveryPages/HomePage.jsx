// HomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleDriverSignUpClick = () => {
    navigate('/drivers/login'); // Redirect to SignIn/SignUp page
  };

  return (
    <div className="home-page">
      <h1>Welcome to the Delivery Management System</h1>
      <button onClick={handleDriverSignUpClick} className="btn btn-primary">
        Register or Login as a Driver
      </button>
    </div>
  );
};

export default HomePage;
