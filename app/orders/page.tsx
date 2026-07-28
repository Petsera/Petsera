"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Order = {
  id: string;
  total: number;
  status: string;
  created_at: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) {
        setOrders(data || []);
      }

      setLoading(false);
    }

    loadOrders();
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-3xl font-bold">
          Loading...
        </h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="mb-10 text-4xl font-bold">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border p-6"
            >
              <p>
                <strong>Order ID:</strong> {order.id}
              </p>

              <p className="mt-2">
                <strong>Total:</strong> €
                {order.total.toFixed(2)}
              </p>

              <p className="mt-2">
                <strong>Status:</strong> {order.status}
              </p>

              <p className="mt-2">
                <strong>Date:</strong>{" "}
                {new Date(
                  order.created_at
                ).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}