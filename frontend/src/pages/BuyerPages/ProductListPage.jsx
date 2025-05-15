import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductListPage.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const ProductListPage = ({ cartItems, setCartItems }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [categories, setCategories] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '' });

  // Log the BACKEND_URL for debugging
  console.log('Using BACKEND_URL:', BACKEND_URL);

  // Function to construct image URL
  const getImageUrl = (image) => {
    if (!image || typeof image !== 'string') {
      console.log('Invalid or missing image, using default');
      return '/default-product-image.jpg';
    }
    const url = image.startsWith('http') 
      ? image 
      : `${BACKEND_URL}${image.startsWith('/') ? '' : '/'}${image}`;
    console.log('Constructed image URL:', url);
    return url;
  };

  // Fetch products with search params
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Build query string for filtering
        let url = '/api/products';
        const params = new URLSearchParams();
        
        if (searchTerm) {
          params.append('search', searchTerm);
        }
        
        if (selectedCategory) {
          params.append('category', selectedCategory);
        }
        
        if (sortBy) {
          params.append('sort', sortBy);
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        console.log('Fetching products from:', url);
        const res = await axios.get(url);
        console.log('Received products:', res.data);
        setProducts(res.data.products || []);
        
        // Extract unique categories for the filter
        if (res.data.products?.length > 0 && categories.length === 0) {
          const uniqueCategories = [...new Set(res.data.products.map(product => product.category))];
          setCategories(uniqueCategories);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.response?.data?.message || 'Failed to load products. Please check your network or try again later.');
        setLoading(false);
      }
    };

    // Debounce the search to avoid too many API calls
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, sortBy]);

  // Add to cart via backend
  const addToCart = async (product) => {
    try {
      const { data } = await axios.post(
        '/api/cart',
        {
          productId: product._id,
          qty: 1
        },
        { withCredentials: true }
      );

      setCartItems(data); // sync local cart state
      
      // Show notification
      setNotification({
        show: true,
        message: `${product.name} added to cart!`
      });
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '' });
      }, 3000);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      setNotification({
        show: true,
        message: 'Failed to add item. Make sure you\'re logged in.'
      });
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '' });
      }, 3000);
    }
  };

  // Check if product is already in cart
  const isInCart = (productId) => {
    return cartItems && cartItems.some(item => item.productId === productId);
  };

  // Handle out of stock products
  const isOutOfStock = (product) => {
    return product.countInStock <= 0;
  };

  return (
    <div className="product-list-container">
      <h2>Available Products</h2>
      
      {/* Search, Filter & Sort Controls */}
      <div className="controls-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            aria-label="Search products"
          />
        </div>
        
        <div className="filter-sort-container">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
            aria-label="Sort products"
          >
            <option value="">Sort By</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
          </select>
        </div>
      </div>
      
      {/* Loading & Error States */}
      {loading && <div className="loader">Loading...</div>}
      {error && <p className="error-message">{error}</p>}
      
      {/* Product Grid */}
      <div className="product-grid">
        {products.length === 0 && !loading ? (
          <p className="no-products">No products found. Try adjusting your filters.</p>
        ) : (
          products.map((product) => (
            <div 
              className={`product-card ${isOutOfStock(product) ? 'out-of-stock' : ''}`} 
              key={product._id}
            >
              <div className="product-image-container">
                <img 
                  src={getImageUrl(product.image)} 
                  alt={product.name || 'Product'} 
                  loading="lazy"
                  onError={(e) => {
                    console.log('Image failed to load:', product.image);
                    e.target.src = '/default-product-image.jpg';
                  }}
                />
                {product.certification && (
                  <span className="certification-badge">{product.certification}</span>
                )}
              </div>
              
              <div className="product-details">
                <h4>{product.name || 'Unnamed Product'}</h4>
                <p className="product-description">{product.description || 'No description'}</p>
                <div className="product-price">
                  <span className="current-price">
                    Rs. {product.price ? product.price.toLocaleString(undefined, { minimumFractionDigits: 2 }) : 'N/A'}
                  </span>
                </div>
                <p className="product-category">{product.category || 'N/A'}</p>
                <p className="farmer-name">By: {product.farmer?.name || 'Unknown Farmer'}</p>
                <p className="stock-info">Available: {product.countInStock} kg</p>
                
                {isOutOfStock(product) ? (
                  <button className="out-of-stock-button" disabled aria-label="Out of stock">
                    Out of Stock
                  </button>
                ) : isInCart(product._id) ? (
                  <button className="in-cart-button" disabled aria-label="Already in cart">
                    Added to Cart
                  </button>
                ) : (
                  <button 
                    className="add-to-cart-button"
                    onClick={() => addToCart(product)}
                    aria-label={`Add ${product.name || 'product'} to cart`}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Notification */}
      {notification.show && (
        <div className="notification">
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default ProductListPage;