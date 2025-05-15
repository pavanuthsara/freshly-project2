import React from 'react';
import { ArrowRight, User, Truck, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-100">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDQ4YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnptMC0xMmMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiNmZmZmZmYxMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-5"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-4">
            Welcome to Freshly.lk
          </h1>
          <p className="text-lg text-emerald-600 max-w-2xl mx-auto">
            Connect with Sri Lanka's finest farmers, drivers, and buyers to bring
            fresh produce from farm to table.
          </p>
        </div>

        {/* Login Button */}
        <div className="flex justify-center mb-16">
          <button className="relative bg-emerald-700 text-white px-10 py-4 rounded-lg font-medium shadow-lg overflow-hidden group transition-all duration-500">
            <span className="relative z-10 flex items-center text-lg">
              Login to Dashboard
              <span className="ml-3 transform group-hover:translate-x-1 transition-transform duration-300">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14"
                  />
                </svg>
              </span>
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
            <span className="absolute inset-0 bg-emerald-700 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></span>
          </button>
        </div>

        {/* Card Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Buyer Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:-translate-y-2 transition-all duration-300">
            <div className="flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6">
              <User className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-800 mb-4">Buyers</h3>
            <p className="text-gray-600 mb-6">
              Discover and purchase the freshest produce directly from local
              Sri Lankan farms, delivered to your doorstep.
            </p>
            <button
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-all duration-300 flex items-center"
              onClick={() => navigate('/buyer/login')}
            >
              Buyer Login
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>

          {/* Driver Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:-translate-y-2 transition-all duration-300">
            <div className="flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6">
              <Truck className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-800 mb-4">Drivers</h3>
            <p className="text-gray-600 mb-6">
              Join our delivery network to transport fresh produce from farms to
              customers, ensuring timely and reliable service.
            </p>
            <button
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-all duration-300 flex items-center"
              onClick={() => navigate('/drivers/login')}
            >
              Driver Login
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>

          {/* Farmer Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:-translate-y-2 transition-all duration-300">
            <div className="flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6">
              <Leaf className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-800 mb-4">Farmers</h3>
            <p className="text-gray-600 mb-6">
              Partner with us to sell your fresh produce directly to customers
              and expand your reach across Sri Lanka.
            </p>
            <button
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-all duration-300 flex items-center"
              onClick={() => navigate('/farmer-login')}
            >
              Farmer Login
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginDashboard;