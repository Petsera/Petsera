import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    const total = items.reduce(
      (
        sum: number,
        item: any
      ) =>
        sum +
        item.price * item.quantity,
      0
    );


    // ساخت سفارش اولیه بدون نیاز به ورود کاربر
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
      console.log(orderError);

      return NextResponse.json(
        {
          error: "Order creation failed",
        },
        {
          status: 500,
        }
      );
    }


    const session =
      await stripe.checkout.sessions.create({

        payment_method_types: [
          "card",
        ],

        mode: "payment",

        line_items:
          items.map(
            (item: any) => ({
              price_data: {
                currency: "eur",

                product_data: {
                  name: item.name,
                },

                unit_amount:
                  Math.round(
                    item.price * 100
                  ),
              },

              quantity:
                item.quantity,
            })
          ),


        metadata: {
          order_id: order.id,
        },


        success_url:
          "http://localhost:3000/order-success",

        cancel_url:
          "http://localhost:3000/cart",
      });


    return NextResponse.json({
      url: session.url,
    });


  } catch (error) {

    console.log(
      "Stripe error:",
      error
    );


    return NextResponse.json(
      {
        error: "Payment error",
      },
      {
        status: 500,
      }
    );
  }
}