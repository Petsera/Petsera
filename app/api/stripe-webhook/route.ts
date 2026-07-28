import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!,
  {
    apiVersion: "2026-06-24.dahlia",
  }
);

export async function POST(req: Request) {
  const body = await req.text();

  const signature = req.headers.get(
    "stripe-signature"
  );

  if (!signature) {
    return NextResponse.json(
      {
        error: "Missing Stripe signature",
      },
      {
        status: 400,
      }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error(
      "Webhook signature error:",
      error
    );

    return NextResponse.json(
      {
        error: "Invalid webhook signature",
      },
      {
        status: 400,
      }
    );
  }

  try {
    if (
      event.type ===
      "checkout.session.completed"
    ) {
      const session =
        event.data.object as Stripe.Checkout.Session;

      const orderId =
        session.metadata?.order_id;

      if (orderId) {
        const { error } = await supabase
          .from("orders")
          .update({
            status: "paid",
          })
          .eq("id", orderId);

        if (error) {
          console.error(
            "Order update error:",
            error.message
          );
        }
      }
    }

    return NextResponse.json({
      received: true,
    });

  } catch (error) {
    console.error(
      "Webhook processing error:",
      error
    );

    return NextResponse.json(
      {
        error: "Webhook processing failed",
      },
      {
        status: 500,
      }
    );
  }
}