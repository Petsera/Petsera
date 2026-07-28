"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import RatingStars from "./RatingStars";

type Props = {
  productId: string;
  onReviewAdded: () => void;
};

export default function ReviewForm({
  productId,
  onReviewAdded,
}: Props) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("reviews")
      .insert({
        product_id: productId,
        user_id: user.id,
        rating,
        comment,
      });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    alert("Review added successfully.");

    setRating(5);
    setComment("");

    onReviewAdded();

    setLoading(false);
  }

  return (
    <div className="rounded-2xl border bg-white p-6">

      <h2 className="mb-6 text-2xl font-bold">
        Write a Review
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        <div>

          <p className="mb-3 font-semibold">
            Rating
          </p>

          <RatingStars
            rating={rating}
            onChange={setRating}
            size={34}
          />

        </div>

        <textarea
          rows={5}
          placeholder="Write your opinion about this product..."
          value={comment}
          onChange={(e) =>
            setComment(e.target.value)
          }
          className="w-full rounded-xl border p-4"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-green-600 px-8 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
        >
          {loading
            ? "Submitting..."
            : "Submit Review"}
        </button>

      </form>

    </div>
  );
}