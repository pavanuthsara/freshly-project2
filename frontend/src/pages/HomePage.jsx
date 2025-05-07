import React from 'react';
import { Star, ShoppingCart, ArrowRight } from 'lucide-react';

// CallToAction Component
export function CallToAction() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl overflow-hidden shadow-xl">
          <div className="relative px-6 py-16 sm:px-12 lg:px-16">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDQ4YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnptMC0xMmMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiNmZmZmZmYxMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
            </div>
            <div className="relative text-center max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Start enjoying farm-fresh produce today
              </h2>
              <p className="text-lg text-emerald-50 mb-8">
                Join Freshly.lk and discover the taste of locally grown, fresh
                produce delivered directly from Sri Lankan farms to your
                doorstep.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-3 rounded-lg font-medium shadow-lg transition-all duration-300">
                  Create an Account
                </button>
                <button className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg font-medium transition-all duration-300">
                  Learn More
                </button>
              </div>
              <p className="mt-6 text-emerald-100 text-sm">
                Already have an account?{' '}
                <a href="#" className="underline text-white font-medium">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Categories Component
const categories = [
  {
    name: 'Vegetables',
    image:
      'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    count: '56 products',
  },
  {
    name: 'Fruits',
    image:
      'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    count: '43 products',
  },
  {
    name: 'Grains',
    image:
      'https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec15?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    count: '29 products',
  },
  {
    name: 'Dairy',
    image:
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    count: '18 products',
  },
];

export function Categories() {
  return (
    <div className="bg-emerald-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of fresh, locally-grown products from trusted
            Sri Lankan farmers
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.name}
              className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 z-10" />
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <h3 className="text-xl font-bold text-white mb-1">
                  {category.name}
                </h3>
                <p className="text-emerald-200 text-sm">{category.count}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <button className="bg-emerald-600 text-white hover:bg-emerald-700 px-8 py-3 rounded-lg font-medium shadow-md transition-colors">
            View All Categories
          </button>
        </div>
      </div>
    </div>
  );
}

// FarmerSpotlight Component
export function FarmerSpotlight() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Meet Our Farmers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get to know the dedicated farmers who grow your food with care and
            sustainable practices
          </p>
        </div>
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl overflow-hidden shadow-xl">
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1595132513848-5115660a81e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Sri Lankan farmer in rice field"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
              <div className="bg-white/10 inline-block px-4 py-1 rounded-full text-emerald-50 text-sm font-medium mb-4">
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
                <div className="flex items-center">
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
                <div className="flex items-center">
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
                <div className="flex items-center">
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
              <button className="bg-white text-emerald-700 hover:bg-emerald-50 px-6 py-3 rounded-lg font-medium shadow-md transition-colors inline-block self-start">
                Shop Kumara's Products
              </button>
            </div>
          </div>
        </div>
        <div className="mt-12 text-center">
          <button className="text-emerald-600 hover:text-emerald-800 font-medium flex items-center mx-auto transition-colors">
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
}

// FeaturedProducts Component
const products = [
  {
    id: 1,
    name: 'Fresh Organic Carrots',
    price: 350,
    rating: 4.8,
    reviews: 124,
    image:
      'https://images.unsplash.com/photo-1598170845058-32b9d6a5d4f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    farmer: 'Kumara Farms',
  },
  {
    id: 2,
    name: 'Ripe Bananas',
    price: 280,
    rating: 4.5,
    reviews: 86,
    image:
      'https://images.unsplash.com/photo-1603833665858-e61d17a86224?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    farmer: 'Green Valley',
  },
  {
    id: 3,
    name: 'Red Rice 1kg',
    price: 450,
    rating: 4.9,
    reviews: 215,
    image:
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    farmer: 'Nuwara Farms',
  },
  {
    id: 4,
    name: 'Fresh Coconut',
    price: 120,
    rating: 4.7,
    reviews: 63,
    image:
      'https://images.unsplash.com/photo-1580984969071-a8da5656c2fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    farmer: 'Coastal Growers',
  },
];

export function FeaturedProducts() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600">
              Handpicked fresh items from local farmers
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button className="text-emerald-600 hover:text-emerald-800 font-medium flex items-center transition-colors">
              View All Products
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-56 w-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2 py-1 rounded-full">
                    From {product.farmer}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center mb-2">
                  <div className="flex items-center text-amber-400">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="ml-1 text-sm font-medium">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">
                    ({product.reviews} reviews)
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {product.name}
                </h3>
                <p className="text-emerald-600 font-bold mb-4">
                  Rs. {product.price.toFixed(2)}
                </p>
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg flex items-center justify-center transition-colors">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Hero Component
export function Hero() {
  return (
    <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDQ4YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnptMC0xMmMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiNmZmZmZmYxMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-10"
        />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 lg:pr-12 mb-12 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              From Farm to Table, <br />
              <span className="text-emerald-200">Fresh Every Day</span>
            </h1>
            <p className="text-lg text-emerald-50 mb-8 max-w-lg">
              Connect directly with local Sri Lankan farmers and get the
              freshest produce delivered to your doorstep.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-3 rounded-lg font-medium shadow-lg transition-all duration-300 flex items-center">
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg font-medium transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <div className="bg-white p-3 rounded-2xl shadow-2xl transform rotate-3 transition-transform hover:rotate-0 duration-300">
                <img
                  src="https://images.unsplash.com/photo-1592924357230-91225d971802?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Fresh vegetables from local farms"
                  className="rounded-xl w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
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
              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
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
}

// HowItWorks Component
export function HowItWorks() {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            How Freshly.lk Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We connect you directly with local farmers for the freshest produce,
            supporting sustainable farming and your health
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-8 shadow-md text-center relative">
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
          <div className="bg-white rounded-xl p-8 shadow-md text-center relative">
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
          <div className="bg-white rounded-xl p-8 shadow-md text-center relative">
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
          <button className="bg-emerald-600 text-white hover:bg-emerald-700 px-8 py-3 rounded-lg font-medium shadow-md transition-colors">
            Start Shopping Now
          </button>
        </div>
      </div>
    </div>
  );
}

// Testimonials Component
const testimonials = [
  {
    id: 1,
    name: 'Priya Mendis',
    location: 'Colombo',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
    rating: 5,
    text:
      'The vegetables I receive from Freshly.lk are so much fresher than supermarket produce. I love knowing exactly which farm my food comes from.',
  },
  {
    id: 2,
    name: 'Amal Fernando',
    location: 'Kandy',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
    rating: 5,
    text:
      'As a chef, quality ingredients are crucial. Freshly.lk delivers exceptional farm-fresh produce that truly elevates my cooking.',
  },
  {
    id: 3,
    name: 'Nisha Perera',
    location: 'Galle',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
    rating: 4,
    text:
      "I've been ordering from Freshly.lk for 6 months now. The convenience, quality, and supporting local farmers makes this service invaluable.",
  },
];

export function Testimonials() {
  return (
    <div className="bg-emerald-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied customers who enjoy farm-fresh produce
            delivered to their door
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl shadow-md p-8 relative"
            >
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {testimonial.location}
                  </p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600 italic">"{testimonial.text}"</p>
              <div className="absolute -top-4 -left-4 text-emerald-600 opacity-20">
                <svg
                  className="w-12 h-12"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <a
            href="#"
            className="text-emerald-600 hover:text-emerald-800 font-medium underline"
          >
            Read more customer reviews
          </a>
        </div>
      </div>
    </div>
  );
}

// HomePage Component with Default Export
const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <FeaturedProducts />
      <Categories />
      <HowItWorks />
      <FarmerSpotlight />
      <Testimonials />
      <CallToAction />
    </div>
  );
};

export default HomePage;