"use client";

type RatingStarsProps = {
  rating: number;
  onChange?: (rating: number) => void;
  size?: number;
};

export default function RatingStars({
  rating,
  onChange,
  size = 28,
}: RatingStarsProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(star)}
          className={`transition ${
            onChange
              ? "cursor-pointer hover:scale-110"
              : "cursor-default"
          }`}
          style={{
            fontSize: `${size}px`,
            lineHeight: 1,
          }}
        >
          {star <= rating ? "⭐" : "☆"}
        </button>
      ))}
    </div>
  );
}