import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    const total = items.reduce(
      (sum: number, item: any) =>
        sum + item.price * item.quantity,
      0
    );

    const {
      data: order,
      error: orderError,
    } = await supabase
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