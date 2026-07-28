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
      setItems((data as WishlistItem[]) || []);
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

    setItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="text-3xl font-bold">
          Loading...
        </h1>
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
            className="mt-6 inline-block rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-3">

          {items.map((item) => (

            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border bg-white shadow"
            >

              <div className="flex h-56 items-center justify-center bg-gray-100">

                {item.product.image ? (
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-7xl">
                    🐾
                  </span>
                )}

              </div>

              <div className="p-6">

                <h2 className="text-xl font-bold">
                  {item.product.name}
                </h2>

                <p className="mt-2 text-gray-500">
                  {item.product.category}
                </p>

                <p className="mt-3 text-2xl font-bold text-green-600">
                  €{item.product.price}
                </p>

                <div className="mt-6 flex gap-3">

                  <button
                    onClick={() =>
                      addToCart({
                        id: item.product.id,
                        name: item.product.name,
                        price: item.product.price,
                        image:
                          item.product.image || "",
                        category:
                          item.product.category,
                      })
                    }
                    className="flex-1 rounded-lg bg-green-600 py-3 text-white hover:bg-green-700"
                  >
                    Add To Cart
                  </button>

                  <button
                    onClick={() =>
                      removeFromWishlist(item.id)
                    }
                    className="rounded-lg bg-red-600 px-4 text-white hover:bg-red-700"
                  >
                    Remove
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>
      )}

    </main>
  );
}