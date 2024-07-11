import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripeSecretKey: string | undefined = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('Stripe secret key not found in environment variables.');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-06-20', // Specify the Stripe API version if needed
});

interface Payment {
  amount: number;
  booking_id: number;
  // Add more properties as needed
}

export const chargePayment = async (payment: Payment): Promise<Stripe.Response<Stripe.PaymentIntent>> => {
  try {
    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: payment.amount * 100, // amount in cents
      currency: 'usd', // currency code
      payment_method_types: ['card'], // payment method types allowed
      description: 'Payment for booking', // description of the payment
      metadata: {
        booking_id: payment.booking_id.toString(),
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error('Error processing payment with Stripe:', error);
    throw new Error('Failed to process payment with Stripe.');
  }
};

// Function to handle refunds
export const refundPayment = async (paymentIntentId: string): Promise<Stripe.Response<Stripe.Refund>> => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    return refund;
  } catch (error) {
    console.error('Error refunding payment with Stripe:', error);
    throw new Error('Failed to refund payment with Stripe.');
  }
};
