import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    console.log("========== CREATE CHECKOUT ==========");
    console.log("Received Items:");
    console.log(JSON.stringify(items, null, 2));

    const total = items.reduce(
      (sum: number, item: any) =>
        sum + item.price * item.quantity,
      0
    );

    // =========================
    // Create Order
    // =========================

    const {
      data: order,
      error: orderError,
    } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: null,
        total,
        status: "Pending",
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order creation error:");
      console.error(orderError);

      return NextResponse.json(
        {
          success: false,
          error: orderError.message,
        },
        {
          status: 500,
        }
      );
    }

    console.log("Order Created:");
    console.log(order);

    // =========================
    // Create Order Items
    // =========================

    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    console.log("Order Items To Insert:");
    console.log(JSON.stringify(orderItems, null, 2));

    const {
      data: insertedItems,
      error: orderItemsError,
    } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems)
      .select();

    if (orderItemsError) {
      console.error("Order items creation error:");
      console.error(orderItemsError);

      return NextResponse.json(
        {
          success: false,
          error: orderItemsError.message,
        },
        {
          status: 500,
        }
      );
    }

    console.log("Inserted Order Items:");
    console.log(JSON.stringify(insertedItems, null, 2));

    // =========================
    // Stripe Checkout
    // =========================

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    const session =
      await stripe.checkout.sessions.create({
        payment_method_types: ["card"],

        mode: "payment",

        line_items: items.map((item: any) => ({
          price_data: {
            currency: "eur",

            product_data: {
              name: item.name,
            },

            unit_amount: Math.round(
              item.price * 100
            ),
          },

          quantity: item.quantity,
        })),

        metadata: {
          order_id: order.id,
        },

        success_url: `${baseUrl}/order-success`,

        cancel_url: `${baseUrl}/cart`,
      });

    console.log("Stripe Session Created:");
    console.log(session.id);

    console.log("====================================");

    return NextResponse.json({
      success: true,
      url: session.url,
    });

  } catch (error) {

    console.error("Stripe error:");
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Payment error",
      },
      {
        status: 500,
      }
    );
  }
}