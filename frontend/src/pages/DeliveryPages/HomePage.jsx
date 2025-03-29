import React from 'react';
import { Sprout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleDriverSignUpClick = () => {
    navigate('/drivers/login');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center border border-green-500">
        <div className="flex items-center justify-center mb-6">
          <Sprout color="#22c55e" size={48} className="mr-2" />
          <h1 className="text-3xl font-bold text-black">
            Freshly.lk
          </h1>
        </div>
        <p className="text-gray-600 mb-6">
        Empower your delivery journey with flexible earning opportunities
        </p>
        <button 
          onClick={handleDriverSignUpClick} 
          className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors duration-300 font-semibold"
        >
          Register or Login as a Driver
        </button>
      </div>
    </div>
  );
};

export default HomePage;