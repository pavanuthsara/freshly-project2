import React from 'react';

const HowItWorks = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 id="how-it-works-title" className="text-3xl font-bold text-gray-800 mb-4">
            How Freshly.lk Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We connect you directly with local farmers for the freshest produce,
            supporting sustainable farming and your health
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-xl p-8 shadow-md text-center relative transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
              1
            </div>
            <div className="h-28 w-28 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-14 h-14 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Browse & Order
            </h3>
            <p className="text-gray-600">
              Explore our wide selection of fresh produce directly from local
              Sri Lankan farms and add your favorites to cart.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-xl p-8 shadow-md text-center relative transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
              2
            </div>
            <div className="h-28 w-28 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-14 h-14 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Schedule Delivery
            </h3>
            <p className="text-gray-600">
              Choose your preferred delivery date and time. Our farmers harvest
              your order fresh on delivery day.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-xl p-8 shadow-md text-center relative transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
              3
            </div>
            <div className="h-28 w-28 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-14 h-14 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Enjoy Fresh Produce
            </h3>
            <p className="text-gray-600">
              Receive farm-fresh products at your doorstep and enjoy the taste
              of freshly harvested goodness.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">
            Join thousands of happy customers enjoying farm-fresh produce
          </p>
          <button className="bg-emerald-600 text-white hover:bg-emerald-700 px-8 py-3 rounded-lg font-medium shadow-md transition-all duration-300 transform hover:scale-105">
            Start Shopping Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;