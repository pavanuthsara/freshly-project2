import React from 'react';

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

const Categories = () => {
  return (
    <div className="bg-emerald-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="categories-title" className="text-3xl font-bold text-gray-800 mb-4">
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
                loading="lazy"
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
          <button className="bg-emerald-600 text-white hover:bg-emerald-700 px-8 py-3 rounded-lg font-medium shadow-md transition-colors transform hover:scale-105">
            View All Categories
          </button>
        </div>
      </div>
    </div>
  );
};

export default Categories;