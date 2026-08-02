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
  console.log(
    "Raw Secret:",
    JSON.stringify(process.env.STRIPE_WEBHOOK_SECRET)
  );
  console.log(
    "Trimmed Secret:",
    JSON.stringify(webhookSecret)
  );
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
      {
        error: err.message,
      },
      {
        status: 400,
      }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session =
          event.data.object as Stripe.Checkout.Session;

        console.log("HELLO NEW VERSION");

        console.log("========== SESSION ==========");
        console.log(JSON.stringify(session, null, 2));
        console.log("=============================");

        console.log("Checkout Session ID:", session.id);
        console.log("Order ID:", session.metadata?.order_id);
        console.log(
          "Customer Email:",
          session.customer_details?.email
        );
        console.log(
          "Payment Intent:",
          session.payment_intent
        );

        const orderId = session.metadata?.order_id;

        if (orderId) {
          const updateData = {
            status: "Paid",
            customer_email:
              session.customer_details?.email ?? null,
            stripe_session_id: session.id,
            payment_intent:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : null,
            paid_at: new Date().toISOString(),
          };

          console.log("Updating Order With:");
          console.log(updateData);

          const { data, error } = await supabaseAdmin
            .from("orders")
            .update(updateData)
            .eq("id", orderId)
            .select();

          if (error) {
            console.error(
              "Supabase Update Error:",
              error
            );
          } else {
            console.log(
              "Order updated successfully."
            );
            console.log("Updated Row:");
            console.log(
              JSON.stringify(data, null, 2)
            );
          }
        } else {
          console.log(
            "No order_id found in metadata."
          );
        }

        break;
      }

      default:
        console.log(
          `Unhandled event: ${event.type}`
        );
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error(
      "Webhook Processing Error:",
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