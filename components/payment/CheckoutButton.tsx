"use client";

export default function CheckoutButton() {
  async function handleCheckout() {
    const res = await fetch(
      "/api/create-checkout-session",
      {
        method: "POST",
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
    <button
      onClick={handleCheckout}
      className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
    >
      Checkout
    </button>
  );
}