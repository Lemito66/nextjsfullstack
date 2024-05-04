import { authOptions } from "@/libs/authOptions";
import { getServerSession } from "next-auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// cancel subscription
export async function POST(request: Request) {
  // session
  const session = await getServerSession(authOptions);

  // validate session
  if (!session) {
    return new Response(null, {
      status: 401,
    });
  }
  
  const result = await stripe.subscriptions.cancel(
    "sub_1PClGDGePIlKioDCBAekaTtP"
  );
  console.log(result);

  return new Response(null, {
    status: 204,
  });
}
