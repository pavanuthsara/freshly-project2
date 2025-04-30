import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Eye } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

// Base URL for backend with fallback
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const ProductListing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState(location.state?.search || '');
  const [category, setCategory] = useState(location.state?.category || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, category, allProducts]);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get('/api/products', {
        withCredentials: true,
      });
      console.log('Fetched products:', data.products);
      const products = Array.isArray(data.products) ? data.products : [];
      setAllProducts(products);
      setFilteredProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.response?.data.message || 'Failed to fetch products');
      setAllProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = allProducts;

    if (category) {
      result = result.filter((product) =>
        product.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search.trim()) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredProducts(result);
  };

  const getImageUrl = (image) => {
    if (!image) {
      console.log('No image provided, using default');
      return '/default-product-image.jpg';
    }
    const url = image.startsWith('http') ? image : `${BACKEND_URL}${image.startsWith('/') ? '' : '/'}${image}`;
    console.log('Image URL:', url);
    return url;
  };

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-5 font-sans bg-green-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-800">
          All Farmer Products {category && ` - ${category}`}
        </h1>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" size={20} />
        </div>
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="appearance-none w-full px-4 py-2 pl-3 pr-10 border border-green-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Categories</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
          </select>
          <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" size={20} />
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <p className="text-green-600">Loading products...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length ? (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="border border-green-200 rounded-lg shadow-md p-4 text-center bg-white transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg"
            >
              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                className="w-full h-48 object-contain rounded-lg mb-4"
                loading="lazy"
                onError={(e) => {
                  console.log('Image failed to load:', product.image);
                  e.target.src = '/default-product-image.jpg';
                }}
              />
              <h3 className="text-lg font-semibold text-green-800 mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
              <p className="text-green-700 font-bold text-xl mb-2">
                LKR {product.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-green-600 text-sm">
                  <span className="font-semibold">Category:</span> {product.category}
                </span>
                <span className="text-green-600 text-sm">{product.quantity} kg</span>
              </div>
              <button
                onClick={() => navigate(`/dashboard/product/${product._id}`, { state: { search, category } })}
                className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300 flex items-center justify-center"
              >
                <Eye className="mr-2" size={20} />
                View Product
              </button>
            </div>
          ))
        ) : (
          !loading && (
            <div className="col-span-full text-center py-10">
              <p className="text-green-700 text-xl">No products found!</p>
              <p className="text-gray-500 mt-2">Try adjusting your search or category filter.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ProductListing;