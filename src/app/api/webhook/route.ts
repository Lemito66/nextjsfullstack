import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/libs/prisma";
import { sqltag } from "@prisma/client/runtime/library";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// const endpointSecret = "whsec_pfFkfoMXvfsyHd4KODFOvWZy1ySwBrgT";
// const endpointSecret = "whsec_hEzImbn67sI8jBIheaMBghFUscGE2PjC";
const endpointSecret = "whsec_RnBRFL0gjT6xtw3Y4BEHLvotU2Pcss8X";

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { "Webhook Error": "No signature" },
      {
        status: 400,
      }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { "Webhook Error": err.message },
      {
        status: 400,
      }
    );
  }

  switch (event.type) {
    case "checkout.session.completed":
      const checkoutSessionCompleted = event.data.object;
      // Then define and call a function to handle the event checkout.session.completed
      console.log(checkoutSessionCompleted);

      // if (checkoutSessionCompleted.status !== "paid") {
      //   await prisma.user.update({
      //     where: {
      //       id: parseInt(checkoutSessionCompleted.metadata!.userId as string),
      //     },
      //     data: {
      //       status: "pending",
      //     },
      //   });
      // }

      const userFound = await prisma.user.update({
        where: {
          id: parseInt(checkoutSessionCompleted.metadata!.userId as string),
        },
        data: {
          role: "subscriber",
        },
      });

      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}




