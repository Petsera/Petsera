import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-06-24.dahlia",
});

export async function POST(req: Request) {
  const body = await req.text();

  const signature = req.headers.get("stripe-signature");

  console.log("========== WEBHOOK START ==========");
  console.log("Webhook called");
  console.log("Signature exists:", !!signature);
  console.log(
    "Webhook secret exists:",
    !!process.env.STRIPE_WEBHOOK_SECRET
  );
  console.log(
    "Webhook secret:",
    process.env.STRIPE_WEBHOOK_SECRET
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

    console.log("✅ Signature verified");
    console.log("Event type:", event.type);

  } catch (error) {
    console.error(
      "❌ Webhook signature error:",
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
    if (event.type === "checkout.session.completed") {
      const session =
        event.data.object as Stripe.Checkout.Session;

      console.log("Checkout Session ID:", session.id);
      console.log("Metadata:", session.metadata);

      const orderId = session.metadata?.order_id;

      if (orderId) {
        const { error } = await supabase
          .from("orders")
          .update({
            status: "paid",
          })
          .eq("id", orderId);

        if (error) {
          console.error(
            "❌ Supabase update error:",
            error
          );
        } else {
          console.log(
            "✅ Order updated successfully:",
            orderId
          );
        }
      } else {
        console.log("⚠️ No order_id found in metadata");
      }
    }

    console.log("========== WEBHOOK END ==========");

    return NextResponse.json({
      received: true,
    });

  } catch (error) {
    console.error(
      "❌ Webhook processing error:",
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