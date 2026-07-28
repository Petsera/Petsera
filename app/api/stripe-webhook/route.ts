import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!,
  {
    apiVersion: "2026-06-24.dahlia",
  }
);

const webhookSecret =
  process.env.STRIPE_WEBHOOK_SECRET!;


export async function POST(
  request: Request
) {
  const body = await request.text();

  const signature =
    request.headers.get(
      "stripe-signature"
    );


  if (!signature) {
    return new NextResponse(
      "Missing stripe signature",
      {
        status: 400,
      }
    );
  }


  let event: Stripe.Event;


  try {

    event =
      stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );

  } catch (error) {

    console.log(
      "Webhook error:",
      error
    );

    return new NextResponse(
      "Webhook Error",
      {
        status: 400,
      }
    );
  }


  if (
    event.type ===
    "checkout.session.completed"
  ) {

    const session =
      event.data.object as Stripe.Checkout.Session;


    const orderId =
      session.metadata?.order_id;


    if (orderId) {

      const {
        error
      } =
        await supabase
          .from("orders")
          .update({
            status: "Paid",
          })
          .eq(
            "id",
            orderId
          );


      if (error) {

        console.log(
          "Order update error:",
          error
        );

      } else {

        console.log(
          "Order marked as Paid:",
          orderId
        );

      }

    }


    console.log(
      "Payment completed:",
      session.id
    );

  }


  return NextResponse.json({
    received: true,
  });
}