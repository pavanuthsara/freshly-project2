import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login-dashboard');
  };

  return (
    <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDQ4YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnptMC0xMmMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA6LTZ6IiBzdHJva2U9IiNmZmZmZmYxMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-10"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 lg:pr-12 mb-12 lg:mb-0">
            <h1 id="hero-title" className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              From Farm to Table, <br />
              <span className="text-emerald-200">Fresh Every Day</span>
            </h1>
            <p className="text-lg text-emerald-50 mb-8 max-w-lg">
              Connect directly with local Sri Lankan farmers and get the
              freshest produce delivered to your doorstep.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-3 rounded-lg font-medium shadow-lg transition-all duration-300 flex items-center transform hover:scale-105">
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105">
                Learn More
              </button>
              <button 
                onClick={handleLoginClick}
                className="relative bg-emerald-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg overflow-hidden group transition-all duration-500 transform hover:scale-105"
              >
                <span className="relative z-10 flex items-center">
                  Login
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14" />
                    </svg>
                  </span>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                <span className="absolute inset-0 bg-emerald-700 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></span>
              </button>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="relative">
              

              {/* Moved "100% Fresh" badge to bottom-right */}
              <div className="absolute -bottom-9 -right-6 bg-white p-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
                <div className="flex items-center">
                  <div className="bg-emerald-100 rounded-full p-2 mr-3">
                    <svg
                      className="w-6 h-6 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">100% Fresh</p>
                    <p className="text-sm text-gray-500">
                      Farm to table guarantee
                    </p>
                  </div>
                </div>
              </div>

              {/* Adjusted "Fast Delivery" badge to top-right, slightly higher */}
              <div className="absolute -top-12 -right-90 bg-white p-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
                <div className="flex items-center">
                  <div className="bg-emerald-100 rounded-full p-2 mr-3">
                    <svg
                      className="w-6 h-6 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Fast Delivery</p>
                    <p className="text-sm text-gray-500">
                      Within 24 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;