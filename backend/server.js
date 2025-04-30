// backend/server.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';
import fs from 'fs';

import buyerRoutes from './routes/buyer.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import cartRoutes from './routes/cart.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import { stripeWebhook } from './controllers/stripeWebhookController.js';

import deliveryRequestRoutes from './routes/deliveryRequest.routes.js';
import driverRoutes from './routes/driver.routes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Get __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import farmerAnalyticsRoutes from './routes/farmerAnalytics.routes.js';


// Load environment variables
dotenv.config({ path: path.join(__dirname, './.env') });
console.log('🔍 Checking Stripe Configuration:');
console.log('   - STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? '✅ Found' : '❌ Missing');
console.log('   - STRIPE_WEBHOOK_SECRET:', process.env.STRIPE_WEBHOOK_SECRET ? '✅ Found' : '❌ Missing');
if (process.env.STRIPE_SECRET_KEY) {
  console.log('   - Stripe Mode:', process.env.STRIPE_SECRET_KEY.startsWith('sk_test_') ? 'Test Mode' : 'Live Mode');
}

// Ensure uploads directories exist
const uploadsDir = path.join(__dirname, '/uploads');
const refundEvidenceDir = path.join(__dirname, '/uploads/refund-evidence');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log('✅ Created uploads directory');
}

if (!fs.existsSync(refundEvidenceDir)) {
  fs.mkdirSync(refundEvidenceDir);
  console.log('✅ Created refund evidence directory');
}


const app = express();

// Stripe webhook MUST come before express.json()
app.post('/api/payment/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// Test endpoint to verify Stripe connection
app.get('/api/payment/test', async (req, res) => {
  try {
    console.log('🔍 Testing Stripe Connection...');
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });
    
    // Test API connection
    const paymentMethods = await stripe.paymentMethods.list({ limit: 3 });
    console.log('✅ Stripe API Connection Successful');
    console.log('   - API Version:', '2022-11-15');
    console.log('   - Available Payment Methods:', paymentMethods.data.length);
    
    res.json({ 
      success: true, 
      message: 'Stripe connection working',
      details: {
        apiVersion: '2022-11-15',
        mode: process.env.STRIPE_SECRET_KEY.startsWith('sk_test_') ? 'test' : 'live',
        availablePaymentMethods: paymentMethods.data.length
      }
    });
  } catch (error) {
    console.error('❌ Stripe test error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: {
        apiVersion: '2022-11-15',
        mode: process.env.STRIPE_SECRET_KEY ? (process.env.STRIPE_SECRET_KEY.startsWith('sk_test_') ? 'test' : 'live') : 'unknown'
      }
    });
  }
});

// Standard middlewares
app.use(
  cors({
    origin: 'http://localhost:5173', // Allow frontend
    credentials: true,
  })
);
app.use(express.json()); // Body parser (after webhook)
app.use(cookieParser());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Routes
app.use('/api/buyers', buyerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/v1/orders', orderRoutes); // Support both API versions
app.use('/api/upload', uploadRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes); // Note: /webhook handled separately
app.use('/api/farmer', farmerAnalyticsRoutes);
app.use('/api/deliveryrequest', deliveryRequestRoutes);
app.use('/api/drivers', driverRoutes);

// Serve uploads - include refund evidence
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Health check
app.get('/', (req, res) => {
  res.send('🚀 API is running...');
});

// System info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    version: '1.0.0',
    features: ['orders', 'payments', 'refunds'],
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT} → http://localhost:${PORT}`);
});