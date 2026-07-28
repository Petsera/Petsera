"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setUser(user);
    }

    getUser();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();

    router.push("/login");
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-4xl p-8">
        <h1 className="text-3xl font-bold">
          Loading...
        </h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-4xl font-bold">
        My Profile
      </h1>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <p className="mb-3">
          <strong>Name:</strong>{" "}
          {user.user_metadata?.full_name || "No Name"}
        </p>

        <p className="mb-3">
          <strong>Email:</strong>{" "}
          {user.email}
        </p>

        <p className="mb-6">
          <strong>User ID:</strong>{" "}
          {user.id}
        </p>

        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </main>
  );
}