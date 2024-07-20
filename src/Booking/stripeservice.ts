import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY as string;
if (!stripeSecretKey) {
  throw new Error('Stripe secret key is not defined in environment variables');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-06-20',
});

export const createCheckoutSession = async (bookingId: number, amountInCents: number) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Booking ID ${bookingId}`,
          },
          unit_amount: amountInCents,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:5173/cancel',
      metadata: {
        booking_id: bookingId.toString(),
      },
    });

    return session;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Stripe error: ${error.message}`);
      throw new Error(`Stripe error: ${error.message}`);
    } else {
      console.error('Unknown error occurred while creating Stripe checkout session');
      throw new Error('Unknown error occurred');
    }
  }
};
