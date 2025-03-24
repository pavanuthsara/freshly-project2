import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CartPage.css';

const CartPage = ({ cartItems, setCartItems }) => {
  const navigate = useNavigate();

  // ✅ Load cart from backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await axios.get('/api/cart', {
          withCredentials: true
        });
        setCartItems(data);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };
    fetchCart();
  }, [setCartItems]);

  // ✅ Remove product from backend
  const removeFromCart = async (productId) => {
    try {
      const { data } = await axios.delete(`/api/cart/${productId}`, {
        withCredentials: true
      });
      setCartItems(data);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  // ✅ Update quantity via backend
  const updateQty = async (productId, qty) => {
    const numericQty = Number(qty);
    if (!numericQty || numericQty < 1) {
      alert('Quantity must be at least 1.');
      return;
    }

    try {
      const { data } = await axios.post(
        '/api/cart',
        { productId, qty: numericQty },
        { withCredentials: true }
      );
      setCartItems(data);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  // ✅ Calculate subtotal
  const subtotal = cartItems.reduce((acc, item) => {
    const product = item.product;
    return product ? acc + item.qty * product.price : acc;
  }, 0);

  // ✅ Navigate to checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    navigate('/buyer/shipping');
  };

  return (
    <div className="cart-page" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Your Cart</h2>

      {cartItems.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Your cart is empty.</p>
      ) : (
        <>
          <table className="cart-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ccc' }}>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.product?._id || item._id}>
                  {item.product ? (
                    <>
                      <td style={{ textAlign: 'center' }}>
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                      </td>
                      <td style={{ textAlign: 'center' }}>{item.product.name}</td>
                      <td style={{ textAlign: 'center' }}>Rs. {item.product.price}</td>
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => updateQty(item.product._id, e.target.value)}
                          style={{ width: '60px', textAlign: 'center' }}
                        />
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        Rs. {item.qty * item.product.price}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => removeFromCart(item.product._id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '16px'
                          }}
                          title="Remove item"
                        >
                          ❌
                        </button>
                      </td>
                    </>
                  ) : (
                    <td colSpan="6" style={{ textAlign: 'center', color: 'red' }}>
                      ⚠️ Product no longer available.
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary" style={{ textAlign: 'right' }}>
            <h3 style={{ marginBottom: '20px' }}>Subtotal: Rs. {subtotal.toFixed(2)}</h3>
            <button
              onClick={handleCheckout}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                cursor: 'pointer',
                backgroundColor: '#028b74',
                color: 'white',
                border: 'none',
                borderRadius: '5px'
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
