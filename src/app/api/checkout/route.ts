import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST() {
  const result = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Digital Product",
          },
          unit_amount: 2000, // 20.00
        },
        quantity: 1,
      },
    ],
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/products",
    // pago por suscripción
    mode: "payment",
  });

  console.log(result);

  return NextResponse.json({ url: result.url });
}
