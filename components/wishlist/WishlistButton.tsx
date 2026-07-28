"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Props = {
  productId: string;
};

export default function WishlistButton({
  productId,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    checkWishlist();
  }, []);

  async function checkWishlist() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("wishlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .maybeSingle();

    setLiked(!!data);
    setLoading(false);
  }

  async function toggleWishlist() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    if (liked) {
      await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);

      setLiked(false);
    } else {
      const { error } = await supabase
        .from("wishlist")
        .insert({
          user_id: user.id,
          product_id: productId,
        });

      if (!error) {
        setLiked(true);
      }
    }
  }

  if (loading) {
    return (
      <button
        className="rounded-xl border px-5 py-3"
        disabled
      >
        🤍
      </button>
    );
  }

  return (
    <button
      onClick={toggleWishlist}
      className={`rounded-xl px-5 py-3 text-xl transition ${
        liked
          ? "bg-red-500 text-white hover:bg-red-600"
          : "border hover:bg-gray-100"
      }`}
    >
      {liked ? "❤️" : "🤍"}
    </button>
  );
}