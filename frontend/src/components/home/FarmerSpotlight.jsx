import React from 'react';

const FarmerSpotlight = () => {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="farmer-spotlight-title" className="text-3xl font-bold text-gray-800 mb-4">
            Meet Our Farmers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get to know the dedicated farmers who grow your food with care and
            sustainable practices
          </p>
        </div>

        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl overflow-hidden shadow-xl transform transition-all duration-300 hover:shadow-2xl">
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1595132513848-5115660a81e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Sri Lankan farmer in rice field"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
              <div className="bg-white/10 inline-block px-4 py-1 rounded-full text-emerald-50 text-sm font-medium mb-4 transform transition-all duration-300 hover:scale-105">
                Featured Farmer
              </div>

              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                Kumara Jayawardena
              </h3>

              <p className="text-emerald-50 text-lg mb-6">
                "I've been farming organically for over 20 years. Partnering
                with Freshly.lk has allowed me to reach more customers who value
                quality produce while earning a fair income."
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center transform transition-all duration-300 hover:translate-x-2">
                  <div className="bg-white/20 p-2 rounded-full mr-4">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-white">
                    Nuwara Eliya, Central Province
                  </span>
                </div>

                <div className="flex items-center transform transition-all duration-300 hover:translate-x-2">
                  <div className="bg-white/20 p-2 rounded-full mr-4">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                  </div>
                  <span className="text-white">Certified Organic Farmer</span>
                </div>

                <div className="flex items-center transform transition-all duration-300 hover:translate-x-2">
                  <div className="bg-white/20 p-2 rounded-full mr-4">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <span className="text-white">
                    Growing vegetables, fruits, and herbs
                  </span>
                </div>
              </div>

              <button className="bg-white text-emerald-700 hover:bg-emerald-50 px-6 py-3 rounded-lg font-medium shadow-md transition-all duration-300 transform hover:scale-105 inline-block self-start">
                Shop Kumara's Products
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button className="text-emerald-600 hover:text-emerald-800 font-medium flex items-center mx-auto transition-colors transform hover:scale-105">
            Meet More Farmers
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmerSpotlight;