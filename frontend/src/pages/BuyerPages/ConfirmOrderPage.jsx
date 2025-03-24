// src/pages/BuyerPages/ConfirmOrderPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
//import './ConfirmOrderPage.css';

const ConfirmOrderPage = ({ cartItems, shippingAddress, paymentMethod, setCartItems }) => {
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const taxPrice = 0;
  const shippingPrice = 0;
  const totalPrice = subtotal + taxPrice + shippingPrice;

  const placeOrder = async () => {
    try {
      const orderItems = cartItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        price: item.price,
        image: item.image,
        product: item._id,
      }));

      const payload = {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice: subtotal,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      await axios.post('/api/orders', payload, { withCredentials: true });
      alert('✅ Order placed successfully!');
      setCartItems([]);
      navigate('/buyer/profile');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order');
    }
  };

  return (
    <div className="confirm-order-page">
      <h2>Review Your Order</h2>
      <div>
        <p><strong>Shipping Address:</strong> {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}</p>
        <p><strong>Payment Method:</strong> {paymentMethod}</p>
        <h3>Items:</h3>
        <ul>
          {cartItems.map((item) => (
            <li key={item._id}>
              {item.name} x {item.qty} = Rs. {item.qty * item.price}
            </li>
          ))}
        </ul>
        <h3>Total: Rs. {totalPrice}</h3>
        <button onClick={placeOrder}>Place Order</button>
      </div>
    </div>
  );
};

export default ConfirmOrderPage;
