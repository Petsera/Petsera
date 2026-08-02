import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

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
      console.error(
        "Order creation error:",
        orderError
      );

      return NextResponse.json(
        {
          success: false,
          error: orderError.message,
          details: orderError,
        },
        {
          status: 500,
        }
      );
    }


    // =========================
    // Create Order Items
    // =========================

    const orderItems = items.map(
      (item: any) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      })
    );


    const {
      error: orderItemsError,
    } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);


    if (orderItemsError) {
      console.error(
        "Order items creation error:",
        orderItemsError
      );

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


    // =========================
    // Stripe Checkout
    // =========================

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";


    const session =
      await stripe.checkout.sessions.create({
        payment_method_types: [
          "card",
        ],

        mode: "payment",

        line_items: items.map(
          (item: any) => ({
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
          })
        ),


        metadata: {
          order_id: order.id,
        },


        success_url:
          `${baseUrl}/order-success`,


        cancel_url:
          `${baseUrl}/cart`,
      });



    return NextResponse.json({
      success: true,
      url: session.url,
    });


  } catch (error) {

    console.error(
      "Stripe error:",
      error
    );


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