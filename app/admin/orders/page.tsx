"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Order = {
  id: string;
  total: number;
  status: string;
  created_at: string;
  user_id: string;
};

export default function AdminOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
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

    loadOrders();
  }

  async function loadOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setOrders(data || []);
    setLoading(false);
  }

  async function changeStatus(
    id: string,
    status: string
  ) {
    const { error } = await supabase
      .from("orders")
      .update({
        status,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? {
              ...order,
              status,
            }
          : order
      )
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
        Orders Management
      </h1>

      {orders.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center">
          <h2 className="text-2xl font-bold">
            No Orders Found
          </h2>
        </div>
      ) : (
        <div className="space-y-6">

          {orders.map((order) => (

            <div
              key={order.id}
              className="rounded-xl border bg-white p-6"
            >

              <p>
                <strong>Order ID:</strong>{" "}
                {order.id}
              </p>

              <p className="mt-2">
                <strong>User ID:</strong>{" "}
                {order.user_id}
              </p>

              <p className="mt-2">
                <strong>Total:</strong>{" "}
                €{order.total.toFixed(2)}
              </p>

              <p className="mt-2">
                <strong>Date:</strong>{" "}
                {new Date(
                  order.created_at
                ).toLocaleString()}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-4">

                <span className="font-semibold">
                  Status:
                </span>

                <select
                  value={order.status}
                  onChange={(e) =>
                    changeStatus(
                      order.id,
                      e.target.value
                    )
                  }
                  className="rounded-lg border p-2"
                >
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>

                <Link
                  href={`/admin/orders/${order.id}`}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                >
                  View Details
                </Link>

              </div>

            </div>

          ))}

        </div>
      )}

    </main>
  );
}