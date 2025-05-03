import dotenv from 'dotenv';
dotenv.config();

import Stripe from 'stripe';
import Order from '../models/order.model.js';

// Initialize Stripe with API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export const createCheckoutSession = async (req, res, next) => {
  try {
    console.log('💳 Creating Stripe checkout session');
    
    // Step 1: Get orderId from request
    const { orderId } = req.body;
    console.log('Order ID:', orderId);
    
    if (!orderId) {
      console.log('❌ Missing orderId in request');
      return res.status(400).json({ error: 'Order ID is required.' });
    }
    
    // Step 2: Fetch order and validate
    const order = await Order.findById(orderId).populate('user');
    
    if (!order) {
      console.log(`❌ Order not found for ID: ${orderId}`);
      return res.status(404).json({ error: 'Order not found' });
    }
    
    if (order.isPaid) {
      console.log(`❌ Order ${orderId} is already paid`);
      return res.status(400).json({ error: 'Order is already paid.' });
    }
    
    console.log('✅ Order found:', {
      id: order._id,
      items: order.orderItems.length,
      total: order.totalPrice,
      userEmail: order.user?.email
    });
    
    // Step 3: Create line items with proper URL validation
    const lineItems = order.orderItems.map((item) => {
      // Create a product with or without image
      const productData = {
        name: item.name || 'Product'
      };
      
      // Only add image if it's a valid URL (starts with http)
      if (item.image && (item.image.startsWith('http://') || item.image.startsWith('https://'))) {
        productData.images = [item.image];
      }
      
      return {
        price_data: {
          currency: 'usd',
          product_data: productData,
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.qty,
      };
    });
    
    // Step 4: Create a Stripe Checkout Session with redirect to profile page
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: order.user?.email,
      line_items: lineItems,
      // Use the successUrl from the request if provided, otherwise use default
      success_url: req.body.successUrl || `http://localhost:5173/buyer/dashboard?success=true&orderId=${order._id}`,
      cancel_url: req.body.cancelUrl || `${process.env.ORIGIN || 'http://localhost:5173'}/order-cancelled/${order._id}`,
      metadata: {
        orderId: order._id.toString(),
        userId: order.user._id.toString(),
      },
    });
    
    console.log('✅ Stripe session created:', {
      id: session.id,
      url: session.url
    });
    
    // Step 5: Return Stripe session URL
    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('❌ Stripe Checkout Session Error:', error);
    return res.status(500).json({ error: error.message });
  }
};