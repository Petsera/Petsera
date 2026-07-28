"use client";

import { useCart } from "@/components/cart/CartContext";

export default function CartPage() {
  const {
    items,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const total = items.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  async function handleCheckout() {
    const res = await fetch(
      "/api/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
        }),
      }
    );

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Payment error");
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="mb-8 text-4xl font-bold">
        Shopping Cart
      </h1>

      {items.length === 0 ? (
        <p className="text-gray-600">
          Your cart is currently empty.
        </p>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border bg-white p-6"
              >
                <h2 className="text-xl font-bold">
                  {item.name}
                </h2>

                <p className="mt-2 text-gray-600">
                  Price: €{item.price.toFixed(2)}
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() =>
                      decreaseQuantity(item.id)
                    }
                    className="h-10 w-10 rounded-lg bg-gray-200 text-xl hover:bg-gray-300"
                  >
                    −
                  </button>

                  <span className="text-lg font-bold">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      increaseQuantity(item.id)
                    }
                    className="h-10 w-10 rounded-lg bg-green-600 text-xl text-white hover:bg-green-700"
                  >
                    +
                  </button>
                </div>

                <p className="mt-4 font-semibold">
                  Subtotal: €
                  {(
                    item.price * item.quantity
                  ).toFixed(2)}
                </p>

                <button
                  onClick={() =>
                    removeFromCart(item.id)
                  }
                  className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-xl border bg-gray-50 p-6">
            <h2 className="mb-4 text-2xl font-bold">
              Order Summary
            </h2>

            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>

              <span>
                €{total.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="mt-6 w-full rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </main>
  );
}