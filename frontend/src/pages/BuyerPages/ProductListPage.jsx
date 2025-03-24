import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductListPage.css';

const ProductListPage = ({ cartItems, setCartItems }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [categories, setCategories] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '' });

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
        
        const res = await axios.get(url);
        setProducts(res.data.products);
        
        // Extract unique categories for the filter
        if (res.data.products.length > 0 && categories.length === 0) {
          const uniqueCategories = [...new Set(res.data.products.map(product => product.category))];
          setCategories(uniqueCategories);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load products');
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
          />
        </div>
        
        <div className="filter-sort-container">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
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
                <img src={product.image} alt={product.name} />
                {product.discount > 0 && (
                  <span className="discount-badge">{product.discount}% OFF</span>
                )}
              </div>
              
              <div className="product-details">
                <h4>{product.name}</h4>
                <div className="product-price">
                  {product.discount > 0 && (
                    <span className="original-price">Rs. {product.price}</span>
                  )}
                  <span className="current-price">
                    Rs. {product.discount 
                      ? Math.round(product.price * (1 - product.discount / 100)) 
                      : product.price}
                  </span>
                </div>
                <p className="product-category">{product.category}</p>
                
                {isOutOfStock(product) ? (
                  <button className="out-of-stock-button" disabled>
                    Out of Stock
                  </button>
                ) : isInCart(product._id) ? (
                  <button className="in-cart-button" disabled>
                    Added to Cart
                  </button>
                ) : (
                  <button 
                    className="add-to-cart-button"
                    onClick={() => addToCart(product)}
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