"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Order = {
  id: string;
  total: number;
  status: string;
  created_at: string;
  user_id: string;
};

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  products: {
    id: string;
    name: string;
    image: string | null;
    category: string;
  };
};

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

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

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      router.push("/");
      return;
    }

    loadOrder();
  }

  async function loadOrder() {
    const { data: orderData, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setOrder(orderData);

    const { data: itemsData, error: itemsError } =
      await supabase
        .from("order_items")
        .select(
          `
          id,
          quantity,
          price,
          products (
            id,
            name,
            image,
            category
          )
        `
        )
        .eq("order_id", id);

    if (itemsError) {
      alert(itemsError.message);
      setLoading(false);
      return;
    }

    setItems((itemsData as OrderItem[]) || []);
    setLoading(false);
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-3xl font-bold">
          Loading...
        </h1>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-3xl font-bold">
          Order Not Found
        </h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">

      <h1 className="mb-10 text-4xl font-bold">
        Order Details
      </h1>

      <div className="rounded-xl border bg-white p-6">

        <p>
          <strong>Order ID:</strong> {order.id}
        </p>

        <p className="mt-2">
          <strong>User ID:</strong> {order.user_id}
        </p>

        <p className="mt-2">
          <strong>Status:</strong> {order.status}
        </p>

        <p className="mt-2">
          <strong>Total:</strong> €
          {order.total.toFixed(2)}
        </p>

        <p className="mt-2">
          <strong>Date:</strong>{" "}
          {new Date(order.created_at).toLocaleString()}
        </p>

      </div>

      <h2 className="mt-12 mb-6 text-3xl font-bold">
        Products
      </h2>

      <div className="space-y-6">

        {items.map((item) => (

          <div
            key={item.id}
            className="flex gap-6 rounded-xl border bg-white p-6"
          >

            {item.products.image ? (
              <img
                src={item.products.image}
                alt={item.products.name}
                className="h-28 w-28 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-xl bg-gray-100 text-5xl">
                🐾
              </div>
            )}

            <div className="flex-1">

              <h3 className="text-xl font-bold">
                {item.products.name}
              </h3>

              <p className="mt-2 text-gray-500">
                {item.products.category}
              </p>

              <p className="mt-3">
                Quantity: {item.quantity}
              </p>

              <p>
                Price: €{item.price}
              </p>

              <p className="mt-2 font-bold text-green-700">
                Subtotal: €
                {(item.price * item.quantity).toFixed(2)}
              </p>

            </div>

          </div>

        ))}

      </div>

    </main>
  );
}