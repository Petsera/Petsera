"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";

import {
  loginSchema,
  type LoginSchema,
} from "@/schemas/loginSchema";

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginSchema) {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/");
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-6">
      <div className="w-full rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="mb-8 text-center text-3xl font-bold">
          Login
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
          <div>
            <label className="mb-2 block font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className="w-full rounded-lg border p-3 outline-none focus:border-green-600"
            />

            {errors.email && (
              <p className="mt-2 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="********"
              {...register("password")}
              className="w-full rounded-lg border p-3 outline-none focus:border-green-600"
            />

            {errors.password && (
              <p className="mt-2 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}