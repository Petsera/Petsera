"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created successfully!");

    router.push("/login");
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-6">
      <div className="w-full rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="mb-8 text-center text-3xl font-bold">
          Create Account
        </h1>

        <form
          onSubmit={handleRegister}
          className="space-y-5"
        >
          <div>
            <label className="mb-2 block font-medium">
              Full Name
            </label>

            <input
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              className="w-full rounded-lg border p-3 outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full rounded-lg border p-3 outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full rounded-lg border p-3 outline-none focus:border-green-600"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
          >
            Create Account
          </button>
        </form>
      </div>
    </main>
  );
}