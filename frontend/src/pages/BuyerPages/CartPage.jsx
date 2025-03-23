// src/pages/BuyerPages/CartPage.jsx
import React from 'react';
//import './CartPage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CartPage = ({ cartItems, setCartItems }) => {
  const navigate = useNavigate();

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item._id !== id));
  };

  const updateQty = (id, qty) => {
    setCartItems(
      cartItems.map((item) =>
        item._id === id ? { ...item, qty: Number(qty) } : item
      )
    );
  };

  const placeOrder = async () => {
    try {
      const orderItems = cartItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        price: item.price,
        image: item.image,
        product: item._id,
      }));

      const itemsPrice = orderItems.reduce(
        (acc, item) => acc + item.qty * item.price,
        0
      );
      const taxPrice = 0;
      const shippingPrice = 0;
      const totalPrice = itemsPrice + taxPrice + shippingPrice;

      const payload = {
        orderItems,
        shippingAddress: {
          address: '123 Sample Street',
          city: 'Colombo',
          postalCode: '10000',
          country: 'Sri Lanka',
        },
        paymentMethod: 'Cash on Delivery',
        itemsPrice,
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
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id}>
                  <td><img src={item.image} alt={item.name} className="cart-img" /></td>
                  <td>{item.name}</td>
                  <td>Rs. {item.price}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => updateQty(item._id, e.target.value)}
                    />
                  </td>
                  <td>Rs. {item.qty * item.price}</td>
                  <td>
                    <button onClick={() => removeFromCart(item._id)} className="remove-btn">X</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="cart-summary">
            <h3>
              Subtotal: Rs. {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0)}
            </h3>
            <button onClick={placeOrder} className="place-order-btn">Place Order</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;