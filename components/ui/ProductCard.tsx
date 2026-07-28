"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import WishlistButton from "@/components/wishlist/WishlistButton";

type ProductCardProps = {
  id: string | number;
  title: string;
  price: string;
  category: string;
  image?: string | null;
};

export default function ProductCard({
  id,
  title,
  price,
  category,
  image,
}: ProductCardProps) {
  const { addToCart } = useCart();

  function handleAddToCart() {
    addToCart({
      id: String(id),
      name: title,
      price: Number(price),
      image: image || "",
      category,
    });

    alert(`${title} added to cart`);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      <Link href={`/products/${id}`}>
        <div className="flex h-56 items-center justify-center bg-gray-100">
          {image ? (
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-7xl">🐾</span>
          )}
        </div>
      </Link>

      <div className="p-6">

        <Link href={`/products/${id}`}>
          <h3 className="text-lg font-semibold hover:text-green-700">
            {title}
          </h3>
        </Link>

        <p className="mt-2 font-bold text-green-700">
          €{price}
        </p>

        <div className="mt-6 flex gap-3">

          <Link
            href={`/products/${id}`}
            className="flex-1 rounded-xl bg-gray-200 py-3 text-center font-semibold hover:bg-gray-300"
          >
            View
          </Link>

          <button
            onClick={handleAddToCart}
            className="flex-1 rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
          >
            Add to Cart
          </button>

          <WishlistButton
            productId={String(id)}
          />

        </div>

      </div>

    </div>
  );
}