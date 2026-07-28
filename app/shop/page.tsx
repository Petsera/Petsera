import { Suspense } from "react";
import ShopContent from "./ShopContent";

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-7xl px-6 py-16">
          <h1 className="text-3xl font-bold">
            Loading products...
          </h1>
        </main>
      }
    >
      <ShopContent />
    </Suspense>
  );
}