"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

import AddToCartButton from "@/components/cart/AddToCartButton";
import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewList from "@/components/reviews/ReviewList";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  category: string;
  stock: number;
};

export default function ProductPage() {
  const params = useParams();

  const id = params.id as string;

  const [product, setProduct] =
    useState<Product | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshReviews, setRefreshReviews] =
    useState(0);

  useEffect(() => {
    async function getProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.log(error.message);
        setLoading(false);
        return;
      }

      setProduct(data);
      setLoading(false);
    }

    if (id) {
      getProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="text-3xl font-bold">
          Loading Product...
        </h1>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="text-3xl font-bold">
          Product Not Found
        </h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">

      <div className="grid gap-12 md:grid-cols-2">

        <div className="overflow-hidden rounded-2xl border bg-white">

          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              width={700}
              height={700}
              className="h-[500px] w-full object-cover"
            />
          ) : (
            <div className="flex h-[500px] items-center justify-center text-8xl">
              🐾
            </div>
          )}

        </div>

        <div>

          <h1 className="text-4xl font-bold">
            {product.name}
          </h1>

          <p className="mt-6 text-3xl font-bold text-green-600">
            €{product.price}
          </p>

          <div className="mt-8 space-y-4">

            <p>
              <span className="font-semibold">
                Category:
              </span>{" "}
              {product.category}
            </p>

            <p>
              <span className="font-semibold">
                Stock:
              </span>{" "}
              {product.stock}
            </p>

            <p>
              <span className="font-semibold">
                Description:
              </span>
            </p>

            <p className="leading-7 text-gray-600">
              {product.description}
            </p>

          </div>

          <div className="mt-10">

            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
              }}
            />

          </div>

        </div>

      </div>

      <div className="mt-20">

        <ReviewForm
          productId={product.id}
          onReviewAdded={() =>
            setRefreshReviews((prev) => prev + 1)
          }
        />

      </div>

      <ReviewList
        productId={product.id}
        refresh={refreshReviews}
      />

    </main>
  );
}