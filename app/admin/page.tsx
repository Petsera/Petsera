"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  featured: boolean;
  stock: number;
};

type Stats = {
  products: number;
  orders: number;
  users: number;
  sales: number;
  featured: number;
  outOfStock: number;
};

export default function AdminPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<Stats>({
    products: 0,
    orders: 0,
    users: 0,
    sales: 0,
    featured: 0,
    outOfStock: 0,
  });

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error || !profile) {
      router.push("/");
      return;
    }

    if (profile.role !== "admin") {
      router.push("/");
      return;
    }

    await Promise.all([
      getProducts(),
      loadDashboardStats(),
    ]);

    setLoading(false);
  }

  async function loadDashboardStats() {
    const [
      productsResult,
      ordersResult,
      usersResult,
    ] = await Promise.all([
      supabase.from("products").select("*"),
      supabase.from("orders").select("total"),
      supabase.from("profiles").select("id"),
    ]);

    const products = productsResult.data || [];
    const orders = ordersResult.data || [];
    const users = usersResult.data || [];

    const totalSales = orders.reduce(
      (sum, order) => sum + Number(order.total),
      0
    );

    setStats({
      products: products.length,
      orders: orders.length,
      users: users.length,
      sales: totalSales,
      featured: products.filter(
        (p) => p.featured
      ).length,
      outOfStock: products.filter(
        (p) => p.stock === 0
      ).length,
    });
  }

  async function getProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (!error) {
      setProducts(data || []);
    }
  }

  async function deleteProduct(id: string) {
    const confirmDelete = confirm(
      "Delete this product?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await getProducts();
    await loadDashboardStats();
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

      <div className="mb-10 flex items-center justify-between">

        <h1 className="text-4xl font-bold">
          Admin Dashboard
        </h1>

        <Link
          href="/admin/add-product"
          className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
        >
          Add Product
        </Link>

      </div>

      <div className="mb-12 grid gap-6 md:grid-cols-3">

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-gray-500">
            Products
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            {stats.products}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-gray-500">
            Orders
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            {stats.orders}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-gray-500">
            Users
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            {stats.users}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-gray-500">
            Total Sales
          </p>

          <h2 className="mt-2 text-4xl font-bold text-green-600">
            ${stats.sales.toFixed(2)}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-gray-500">
            Featured Products
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            {stats.featured}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-gray-500">
            Out Of Stock
          </p>

          <h2 className="mt-2 text-4xl font-bold text-red-600">
            {stats.outOfStock}
          </h2>
        </div>

      </div>

      <h2 className="mb-6 text-3xl font-bold">
        Products
      </h2>

      <div className="space-y-4">

        {products.map((product) => (

          <div
            key={product.id}
            className="flex items-center justify-between rounded-xl border bg-white p-6"
          >

            <div>

              <h3 className="text-xl font-bold">
                {product.name}
              </h3>

              <p className="mt-1 text-gray-600">
                {product.category}
              </p>

              <p className="mt-2 font-semibold text-green-700">
                ${product.price}
              </p>

            </div>

            <div className="flex gap-3">

              <Link
                href={`/admin/edit-product/${product.id}`}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Edit
              </Link>

              <button
                onClick={() =>
                  deleteProduct(product.id)
                }
                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </main>
  );
}