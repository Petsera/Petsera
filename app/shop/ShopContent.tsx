"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ui/ProductCard";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string | null;
  stock: number;
  created_at: string;
};

export default function ShopPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("newest");

  useEffect(() => {
    getProducts();
    getCategories();
  }, [search, selectedCategory, sortBy]);

  async function getProducts() {
    setLoading(true);

    let query = supabase
      .from("products")
      .select("*");

    if (search.trim() !== "") {
      query = query.or(
        `name.ilike.%${search}%,category.ilike.%${search}%`
      );
    }

    if (selectedCategory !== "All") {
      query = query.eq(
        "category",
        selectedCategory
      );
    }

    switch (sortBy) {
      case "price-low":
        query = query.order("price", {
          ascending: true,
        });
        break;

      case "price-high":
        query = query.order("price", {
          ascending: false,
        });
        break;

      case "name":
        query = query.order("name", {
          ascending: true,
        });
        break;

      case "oldest":
        query = query.order("created_at", {
          ascending: true,
        });
        break;

      default:
        query = query.order("created_at", {
          ascending: false,
        });
    }

    const { data, error } = await query;

    if (error) {
      console.log(error.message);
      setLoading(false);
      return;
    }

    setProducts(data || []);
    setLoading(false);
  }

  async function getCategories() {
    const { data, error } = await supabase
      .from("products")
      .select("category");

    if (error) return;

    const uniqueCategories = [
      "All",
      ...new Set(
        (data || []).map(
          (item) => item.category
        )
      ),
    ];

    setCategories(uniqueCategories);
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="text-3xl font-bold">
          Loading products...
        </h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">

      <h1 className="mb-6 text-4xl font-bold">
        Shop
      </h1>

      {search && (
        <p className="mb-6 text-gray-600">
          Search:
          <span className="ml-2 font-bold">
            "{search}"
          </span>
        </p>
      )}

      <div className="mb-10 flex flex-wrap gap-6">

        <div>
          <label className="mb-2 block font-semibold">
            Category
          </label>

          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(
                e.target.value
              )
            }
            className="rounded-lg border px-4 py-2"
          >
            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            Sort By
          </label>

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value
              )
            }
            className="rounded-lg border px-4 py-2"
          >
            <option value="newest">
              Newest
            </option>

            <option value="oldest">
              Oldest
            </option>

            <option value="price-low">
              Price: Low → High
            </option>

            <option value="price-high">
              Price: High → Low
            </option>

            <option value="name">
              Name A → Z
            </option>
          </select>
        </div>

      </div>

      {products.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center">
          <h2 className="text-2xl font-bold">
            No Products Found
          </h2>

          <p className="mt-3 text-gray-500">
            Try another filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-4">

          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.name}
              price={product.price.toString()}
              category={product.category}
              image={product.image}
            />
          ))}

        </div>
      )}

    </main>
  );
}