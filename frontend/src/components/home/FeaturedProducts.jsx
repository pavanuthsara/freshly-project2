import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';

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

const FeaturedProducts = () => {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h2 id="featured-products-title" className="text-3xl font-bold text-gray-800 mb-2">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600">
              Handpicked fresh items from local farmers
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button className="text-emerald-600 hover:text-emerald-800 font-medium flex items-center transition-colors transform hover:scale-105">
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
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-56 w-full object-cover"
                  loading="lazy"
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
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg flex items-center justify-center transition-colors transform hover:scale-105">
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
};

export default FeaturedProducts;