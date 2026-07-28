"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import RatingStars from "./RatingStars";

type Review = {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string;
};

type Props = {
  productId: string;
  refresh: number;
};

export default function ReviewList({
  productId,
  refresh,
}: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, [productId, refresh]);

  async function loadReviews() {
    setLoading(true);

    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", {
        ascending: false,
      });

    if (!error) {
      setReviews(data || []);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold">
          Loading reviews...
        </h2>
      </div>
    );
  }

  const average =
    reviews.length === 0
      ? 0
      : reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        ) / reviews.length;

  return (
    <section className="mt-16">

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h2 className="text-3xl font-bold">
            Customer Reviews
          </h2>

          <p className="mt-2 text-gray-500">
            {reviews.length} review
            {reviews.length !== 1 ? "s" : ""}
          </p>

        </div>

        <div className="text-right">

          <RatingStars
            rating={Math.round(average)}
            size={30}
          />

          <p className="mt-2 text-lg font-semibold">
            {average.toFixed(1)} / 5
          </p>

        </div>

      </div>

      {reviews.length === 0 ? (
        <div className="rounded-xl border bg-white p-8 text-center">
          <p className="text-gray-500">
            No reviews yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">

          {reviews.map((review) => (

            <div
              key={review.id}
              className="rounded-xl border bg-white p-6"
            >

              <RatingStars
                rating={review.rating}
                size={24}
              />

              <p className="mt-4 leading-7">
                {review.comment}
              </p>

              <p className="mt-5 text-sm text-gray-500">
                {new Date(
                  review.created_at
                ).toLocaleString()}
              </p>

            </div>

          ))}

        </div>
      )}

    </section>
  );
}