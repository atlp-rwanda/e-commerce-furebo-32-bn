import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function processPayment(
  token: string,
  amount: number,
  description: string
): Promise<Stripe.PaymentIntent> {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      description: description,
      payment_method: token,
      confirm: true,
    });
    return paymentIntent;
  } catch (err) {
    throw new Error(`Failed to create payment intent`);
  }
}
