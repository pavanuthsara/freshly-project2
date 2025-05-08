import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, X, RefreshCw, Sprout, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  // Debug viewport and product count
  useEffect(() => {
    const logViewport = () => {
      console.log('Viewport width:', window.innerWidth);
      console.log('Number of filtered products:', filteredProducts.length);
      console.log('Tailwind grid classes applied:', document.querySelector('.product-grid')?.classList.contains('grid'));
    };
    logViewport();
    window.addEventListener('resize', logViewport);
    return () => window.removeEventListener('resize', logViewport);
  }, [filteredProducts]);

  // Debug viewport and product count
  useEffect(() => {
    const logViewport = () => {
      console.log('Viewport width:', window.innerWidth);
      console.log('Number of filtered products:', filteredProducts.length);
      console.log('Tailwind grid classes applied:', document.querySelector('.product-grid')?.classList.contains('grid'));
    };
    logViewport();
    window.addEventListener('resize', logViewport);
    return () => window.removeEventListener('resize', logViewport);
  }, [filteredProducts]);

  useEffect(() => {
    fetchProducts();
    
    // Handle scroll for sticky filter bar
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowFilters(false);
      } else {
        setShowFilters(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, category, allProducts]);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    setIsRefreshing(true);
    try {
      const token = localStorage.getItem('farmerToken');
      const response = await fetch('/api/products', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch products (Status: ${response.status})`);
      }
      const data = await response.json();
      console.log('Fetched products:', data);
      const products = Array.isArray(data.products) ? data.products : [];
      setAllProducts(products);
      setFilteredProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message || 'Failed to fetch products');
      setAllProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
      setTimeout(() => setIsRefreshing(false), 600); // Add delay for animation
    }
  };

  const applyFilters = () => {
    let result = allProducts;

    if (category) {
      result = result.filter((product) =>
        product.category?.toLowerCase() === category.toLowerCase()
      );
    }

    if (search.trim()) {
      result = result.filter((product) =>
        product.name?.toLowerCase().includes(search.toLowerCase()) ||
        product.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredProducts(result);
  };

  const getImageUrl = (image) => {
    if (!image || typeof image !== 'string') {
      console.log('Invalid or missing image, using default');
      return '/default-product-image.jpg';
    }
    const url = image.startsWith('http') ? image : `${BACKEND_URL}${image.startsWith('/') ? '' : '/'}${image}`;
    console.log('Constructed image URL:', url);
    return url;
  };

  const clearSearch = () => {
    setSearch('');
  };

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'Vegetables', label: 'Vegetables' },
    { value: 'Fruits', label: 'Fruits' },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12 font-sans bg-gradient-to-b from-green-50 to-white min-h-screen">
      {/* Header with subtle animation */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
        <div className="flex items-center gap-3 group">
          <div className="p-2 bg-green-100 rounded-full shadow-md transition-all duration-300 group-hover:bg-green-200 group-hover:shadow-lg">
            <Sprout className="text-green-600 transition-transform duration-300 group-hover:scale-110" size={32} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-green-500">
            {category ? `${category} Products` : 'Freshly.lk Farmer Products'}
          </h1>
        </div>
        <button
          onClick={fetchProducts}
          disabled={isRefreshing}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-full hover:from-green-700 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-70"
          aria-label="Refresh product list"
        >
          {isRefreshing ? (
            <Loader2 className="mr-2 animate-spin" size={18} />
          ) : (
            <RefreshCw className="mr-2" size={18} />
          )}
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Filters with slide animation based on scroll */}
      <div 
        className={`sticky top-0 z-10 bg-white rounded-xl shadow-xl p-6 mb-8 -mx-6 transition-all duration-300 ${
          showFilters ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-90'
        }`}
      >
        <div className="flex flex-row justify-center gap-4 max-w-4xl mx-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-5 py-3 pl-12 border-2 border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-white transition-all duration-300 text-gray-800 placeholder-gray-400"
              aria-label="Search products"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500" size={22} />
            {search && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors hover:scale-110"
                aria-label="Clear search"
              >
                <X size={22} />
              </button>
            )}
          </div>
          <div className="relative w-56">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-5 py-3 pl-4 pr-12 border-2 border-gray-200 rounded-full shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 appearance-none transition-all duration-300 text-gray-800 cursor-pointer"
              aria-label="Filter by category"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 pointer-events-none" size={22} />
          </div>
        </div>
      </div>

{/* Loading State with improved animation */}
      {loading && (
        <div className="product-grid grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-2xl shadow-md p-5 bg-white animate-pulse flex flex-col min-w-[150px]"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-full h-48 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl mb-4"></div>
              <div className="h-7 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg mb-2 w-3/4"></div>
              <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg mb-3 w-full"></div>
              <div className="h-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg mb-4 w-1/2"></div>
              <div className="h-12 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg w-full"></div>
            </div>
          ))}
        </div>
      )}


      {/* Error State with improved styling */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-6 py-4 rounded-xl shadow-md flex flex-col sm:flex-row items-center justify-between mb-8 transform transition-all hover:shadow-lg">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-lg font-medium">{error}</span>
          </div>
          <button
            onClick={fetchProducts}
            className="mt-4 sm:mt-0 flex items-center px-5 py-2.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            aria-label="Retry fetching products"
          >
            <RefreshCw className="mr-2" size={18} />
            Retry
          </button>
        </div>
      )}

      {/* Product Grid with staggered animation */}
      <div className="product-grid grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length ? (
          filteredProducts.map((product, index) => (
            <div
              key={product._id}
              className="border border-gray-200 rounded-2xl shadow-md p-6 bg-gradient-to-br from-white to-green-50 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 flex flex-col relative overflow-hidden min-w-[150px] group animate-fadeIn"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Certification Badge with improved styling */}
              {product.certification && (
                <span
                  className={`absolute top-4 right-4 z-10 text-xs font-semibold px-3 py-1 rounded-full shadow-md ${
                    product.certification === 'Organic'
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-blue-100 text-blue-800 border border-blue-300'
                  }`}
                >
                  {product.certification}
                </span>
              )}

              <div className="w-full h-48 mb-5 overflow-hidden rounded-xl group-hover:shadow-md transition-all duration-300">
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name || 'Product'}
                  className="w-full h-full object-contain rounded-xl transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    console.log('Image failed to load:', product.image);
                    e.target.src = '/default-product-image.jpg';
                  }}
                />
              </div>

              <h3 className="text-xl font-bold text-green-900 mb-2 line-clamp-1 group-hover:text-green-700 transition-colors">
                {product.name || 'Unnamed Product'}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow leading-relaxed">
                {product.description || 'No description'}
              </p>
              <p className="text-green-700 font-extrabold text-2xl mb-4 group-hover:text-green-600 transition-colors">
                LKR {product.price ? product.price.toLocaleString(undefined, { minimumFractionDigits: 2 }) : 'N/A'}
              </p>
              <div className="flex justify-between items-center mb-5 text-sm text-gray-700">
                <span className="px-3 py-1 bg-green-100 rounded-full text-green-800 font-medium">
                  {product.category || 'N/A'}
                </span>
                <span className={`px-3 py-1 rounded-full font-medium ${
                  product.countInStock > 0 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.countInStock ? `${product.countInStock} kg` : 'Out of stock'}
                </span>
              </div>
              <button
                onClick={() => navigate(`/farmer/product/${product._id}`, { state: { search, category } })}

                className="mt-auto w-full px-5 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-full hover:from-green-700 hover:to-green-600 transition-all duration-300 flex items-center justify-center shadow-md group-hover:shadow-lg transform group-hover:translate-y-0"
                aria-label={`View ${product.name || 'product'} details`}
              >
                <Eye className="mr-2 group-hover:animate-pulse" size={20} />
                View Product
              </button>
            </div>
          ))
        ) : (
          !loading && (

            <div className="col-span-full text-center py-16 bg-white rounded-xl shadow-md transition-all hover:shadow-lg">
              <div className="p-4 bg-green-100 rounded-full inline-flex items-center justify-center mb-4">
                <Sprout className="text-green-600" size={48} />
              </div>
              <p className="text-green-800 text-2xl font-semibold">No Products Found</p>
              <p className="text-gray-600 mt-2 mb-6 max-w-md mx-auto">Try adjusting your search or explore other categories.</p>
              <button
                onClick={() => {setCategory(''); setSearch('');}}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-full hover:from-green-700 hover:to-green-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                aria-label="Explore all categories"
              >
                Explore All Categories
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

// Add fadeIn animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
    opacity: 0;
  }
`;
document.head.appendChild(style);

export default ProductListing;