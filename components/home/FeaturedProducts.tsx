"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ui/ProductCard";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string | null;
  featured: boolean;
  category: string;
};

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getFeaturedProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("featured", true)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.log(error.message);
        setLoading(false);
        return;
      }

      setProducts((data as Product[]) || []);
      setLoading(false);
    }

    getFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold">
          Loading Featured Products...
        </h2>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h2 className="mb-10 text-center text-3xl font-bold">
        Featured Products
      </h2>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">
          No featured products found.
        </p>
      ) : (
        <div className="grid gap-8 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.name}
              price={product.price.toString()}
              image={product.image}
              category={product.category}
            />
          ))}
        </div>
      )}
    </section>
  );
}