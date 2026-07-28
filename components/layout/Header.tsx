"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SearchBar from "@/components/ui/SearchBar";
import { useCart } from "@/components/cart/CartContext";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function Header() {
  const { items } = useCart();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        <Link
          href="/"
          className="text-3xl font-bold tracking-tight text-green-600"
        >
          Petsera
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <div className="flex items-center gap-4">
          <SearchBar />

          <Link href="/wishlist">
            ❤️
          </Link>

          <Link href="/cart" className="relative">
            🛒

            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {items.length}
            </span>
          </Link>

          {user ? (
            <Link href="/profile" title={user.email ?? ""}>
              👤
            </Link>
          ) : (
            <Link href="/login">
              Login
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}