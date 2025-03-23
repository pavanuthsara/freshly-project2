// src/pages/BuyerPages/CartPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CartPage.css';

const CartPage = ({ cartItems, setCartItems }) => {
  const navigate = useNavigate();

  // Remove product from the cart
  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item._id !== id));
  };

  // Update quantity with validation (must be a number and at least 1)
  const updateQty = (id, qty) => {
    const numericQty = Number(qty);
    if (!numericQty || numericQty < 1) {
      alert('Quantity must be a number greater than or equal to 1.');
      return;
    }
    setCartItems(
      cartItems.map((item) =>
        item._id === id ? { ...item, qty: numericQty } : item
      )
    );
  };

  // Calculate subtotal for the cart
  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  // Place order and send order details to the server
  const placeOrder = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    try {
      const orderItems = cartItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        price: item.price,
        image: item.image,
        product: item._id,
      }));

      const taxPrice = 0;
      const shippingPrice = 0;
      const totalPrice = subtotal + taxPrice + shippingPrice;

      const payload = {
        orderItems,
        shippingAddress: {
          address: '123 Sample Street',
          city: 'Colombo',
          postalCode: '10000',
          country: 'Sri Lanka',
        },
        paymentMethod: 'Cash on Delivery',
        itemsPrice: subtotal,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      await axios.post('/api/orders', payload, {
        withCredentials: true,
      });

      alert('✅ Order placed successfully!');
      setCartItems([]);
      navigate('/buyer/profile');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order');
    }
  };

  return (
    <div 
      className="cart-page" 
      style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Your cart is empty.</p>
      ) : (
        <div>
          <table 
            className="cart-table" 
            style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}
          >
            <thead>
              <tr style={{ borderBottom: '1px solid #ccc' }}>
                <th style={{ padding: '10px' }}>Image</th>
                <th style={{ padding: '10px' }}>Name</th>
                <th style={{ padding: '10px' }}>Price</th>
                <th style={{ padding: '10px' }}>Quantity</th>
                <th style={{ padding: '10px' }}>Total</th>
                <th style={{ padding: '10px' }}>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                    />
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{item.name}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>Rs. {item.price}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => updateQty(item._id, e.target.value)}
                      style={{ width: '60px', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>Rs. {item.qty * item.price}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <button 
                      onClick={() => removeFromCart(item._id)} 
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                      title="Remove item"
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="cart-summary" style={{ textAlign: 'right' }}>
            <h3 style={{ marginBottom: '20px' }}>Subtotal: Rs. {subtotal}</h3>
            <button 
              onClick={placeOrder} 
              style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
