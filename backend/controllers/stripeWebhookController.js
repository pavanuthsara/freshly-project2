import dotenv from 'dotenv';
dotenv.config();

import Stripe from 'stripe';
import Order from '../models/order.model.js';
import Buyer from '../models/buyer.model.js'; // Added to update user cart

// Initialize Stripe with API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export const stripeWebhook = async (req, res) => {
  console.log('⚡ Webhook request received');
  
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Validate Stripe signature
    console.log('Verifying Stripe signature');
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log('✅ Signature verified, event type:', event.type);
  } catch (err) {
    console.error('❌ Invalid Stripe signature:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle checkout session completion
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    const userId = session.metadata?.userId;

    console.log('💰 Processing checkout.session.completed event');
    console.log('Session ID:', session.id);
    console.log('Order ID from metadata:', orderId);
    console.log('User ID from metadata:', userId);

    if (!orderId) {
      console.error('❌ No orderId found in session metadata.');
      return res.status(400).send('Missing orderId');
    }

    try {
      // Find order and update payment status
      const order = await Order.findById(orderId);
      if (!order) {
        console.error(`❌ Order not found for ID: ${orderId}`);
        return res.status(404).send('Order not found');
      }

      console.log(`Found order ${orderId}, current paid status:`, order.isPaid);

      // Avoid duplicate payment updates
      if (!order.isPaid) {
        // Update order payment info
        order.isPaid = true;
        order.paidAt = new Date();
        order.status = 'Processing'; // Update order status

        order.paymentResult = {
          id: session.payment_intent,
          status: session.payment_status,
          update_time: new Date(session.created * 1000).toISOString(),
          email_address: session.customer_email,
        };

        await order.save();
        console.log(`✅ Order ${orderId} marked as paid.`);
        
        // Clear user's cart after successful payment
        if (userId) {
          try {
            const buyer = await Buyer.findById(userId);
            if (buyer) {
              buyer.cart = [];
              await buyer.save();
              console.log(`✅ Cart cleared for user ${userId} after successful payment`);
            }
          } catch (cartError) {
            console.error(`⚠️ Error clearing cart for user ${userId}:`, cartError);
            // Continue execution - don't fail the webhook if cart clearing fails
          }
        }
      } else {
        console.log(`⚠️ Order ${orderId} already marked as paid. Skipping update.`);
      }
    } catch (error) {
      console.error(`❌ Error updating payment status for order ${orderId}:`, error);
      return res.status(500).send('Webhook error while updating order');
    }
  }

  // Handle payment intent succeeded (additional confirmation)
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    console.log('💸 Payment intent succeeded:', paymentIntent.id);
    // Additional handling if needed
  }

  // Handle payment failed
  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object;
    console.log('❌ Payment failed:', paymentIntent.id);
    // Handle payment failure - could update order status to "Payment Failed"
  }

  // Acknowledge receipt of event
  console.log('✅ Webhook processed successfully');
  res.status(200).json({ received: true });
};