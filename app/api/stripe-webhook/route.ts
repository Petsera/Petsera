import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.text();

  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Missing STRIPE_WEBHOOK_SECRET" },
      { status: 500 }
    );
  }

  console.log("========== WEBHOOK DEBUG ==========");
  console.log("Signature exists:", !!signature);
  console.log("Body length:", body.length);
  console.log("Webhook Secret starts with:", webhookSecret.slice(0, 6));
  console.log("Webhook Secret length:", webhookSecret.length);
  console.log("Raw Secret:", JSON.stringify(process.env.STRIPE_WEBHOOK_SECRET));
  console.log("Trimmed Secret:", JSON.stringify(webhookSecret));
  console.log("===================================");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (err: any) {
    console.error("Webhook signature error:", err.message);

    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log("Checkout Session ID:", session.id);
        console.log("Order ID:", session.metadata?.order_id);

        const orderId = session.metadata?.order_id;

        if (orderId) {
          const { error } = await supabaseAdmin
            .from("orders")
            .update({
              status: "Paid",
            })
            .eq("id", orderId);

          if (error) {
            console.error("Supabase Update Error:", error);
          } else {
            console.log("Order updated successfully.");
          }
        } else {
          console.log("No order_id found in metadata.");
        }

        break;
      }

      default:
        console.log(`Unhandled event: ${event.type}`);
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error("Webhook Processing Error:", error);

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