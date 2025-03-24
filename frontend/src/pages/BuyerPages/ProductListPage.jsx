import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductListPage.css';

const ProductListPage = ({ cartItems, setCartItems }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/products');
        setProducts(res.data.products); // Adjust if your API returns differently
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Add to cart via backend
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
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      alert('Failed to add item. Make sure you’re logged in.');
    }
  };

  return (
    <div className="product-list">
      <h2>Available Products</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product._id}>
            <img src={product.image} alt={product.name} />
            <h4>{product.name}</h4>
            <p>Rs. {product.price}</p>
            <p>{product.category}</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListPage;
