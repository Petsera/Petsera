import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-6">
      <div className="w-full rounded-2xl border bg-white p-10 text-center shadow-sm">
        <div className="mb-6 text-7xl">
          🎉
        </div>

        <h1 className="mb-4 text-4xl font-bold">
          Order Successful!
        </h1>

        <p className="mb-8 text-lg text-gray-600">
          Thank you for your purchase.
          <br />
          Your order has been received and is being processed.
        </p>

        <Link
          href="/shop"
          className="inline-block rounded-xl bg-green-600 px-8 py-4 font-semibold text-white transition hover:bg-green-700"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}