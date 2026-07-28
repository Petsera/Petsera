"use client";

import { useCart } from "@/components/cart/CartContext";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string | null;
  category: string;
};

type Props = {
  product: Product;
};

export default function AddToCartButton({
  product,
}: Props) {
  const { addToCart } = useCart();

  function handleClick() {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || "",
      category: product.category,
    });

    alert(`${product.name} added to cart`);
  }

  return (
    <button
      onClick={handleClick}
      className="rounded-xl bg-green-600 px-8 py-4 font-semibold text-white transition hover:bg-green-700"
    >
      Add to Cart
    </button>
  );
}