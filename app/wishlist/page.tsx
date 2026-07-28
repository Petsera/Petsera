"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/components/cart/CartContext";

type WishlistItem = {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    image: string | null;
    category: string;
  };
};

export default function WishlistPage() {
  const { addToCart } = useCart();

  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  async function loadWishlist() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("wishlist")
      .select(
        `
        id,
        product:products (
          id,
          name,
          price,
          image,
          category
        )
      `
      )
      .eq("user_id", user.id);

    if (!error) {
      setItems((data as unknown as WishlistItem[]) || []);
    }

    setLoading(false);
  }

  async function removeFromWishlist(id: string) {
    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="text-3xl font-bold">Loading...</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="mb-10 text-4xl font-bold">
        My Wishlist
      </h1>

      {items.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center">
          <h2 className="text-2xl font-bold">
            Your wishlist is empty
          </h2>

          <p className="mt-3 text-gray-500">
            Add products to your wishlist.
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-block rounded-lg bg-green-600 px-6 py-3 text-white"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-6 rounded-xl border bg-white p-6"
            >
              {item.product.image ? (
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-28 w-28 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-xl bg-gray-100 text-5xl">
                  🐾
                </div>
              )}

              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  {item.product.name}
                </h2>

                <p className="mt-2 text-gray-500">
                  {item.product.category}
                </p>

                <p className="mt-3 text-xl font-bold text-green-700">
                  €{item.product.price}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() =>
                    addToCart({
                      ...item.product,
                      image: item.product.image ?? "",
                    })
                  }
                  className="rounded-lg bg-green-600 px-5 py-2 text-white"
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="rounded-lg border px-5 py-2"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}