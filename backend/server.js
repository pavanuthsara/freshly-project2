// backend/server.js

import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import Stripe from 'stripe';
import fs from 'fs';

import buyerRoutes from './routes/Buyer.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import cartRoutes from './routes/cart.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import adminRoutes from './routes/adminRoutes.js';
import complaint1Routes from './routes/complaint1.routes.js';

import driverRoutes from './routes/deliveryRoutes/driver.routes.js';
import deliveryRequestRoutes from './routes/deliveryRoutes/deliveryRequest.routes.js';

import { stripeWebhook } from './controllers/stripeWebhookController.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Get __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, './.env') });
console.log('✅ Loaded STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'Yes (key found)' : 'No (key missing)');

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
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });
    await stripe.paymentMethods.list({ limit: 3 });
    res.json({ success: true, message: 'Stripe connection working' });
  } catch (error) {
    console.error('Stripe test error:', error);
    res.status(500).json({ success: false, error: error.message });
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
app.use('/api/v1/buyers', buyerRoutes); // Support both API versions
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/v1/orders', orderRoutes); // Support both API versions
app.use('/api/upload', uploadRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes); // Note: /webhook handled separately
app.use('/api/admin', adminRoutes); // Add admin routes
app.use('/api', complaint1Routes); // Add complaint1 routes
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