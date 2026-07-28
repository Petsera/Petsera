"use client";

import { useEffect, useState } from "react";

type ImageUploaderProps = {
  onImageSelect: (file: File | null) => void;
};

export default function ImageUploader({
  onImageSelect,
}: ImageUploaderProps) {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!image) {
      setPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(image);

    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Maximum image size is 5MB.");
      return;
    }

    setImage(file);
    onImageSelect(file);
  }

  function removeImage() {
    setImage(null);
    setPreview("");
    onImageSelect(null);
  }

  return (
    <div className="rounded-xl border border-dashed border-gray-300 p-6">
      {preview ? (
        <>
          <img
            src={preview}
            alt="Preview"
            className="mx-auto mb-5 h-64 w-full rounded-xl object-cover"
          />

          <div className="flex justify-center gap-3">
            <label className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700">
              Change Image

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleChange}
              />
            </label>

            <button
              type="button"
              onClick={removeImage}
              className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        </>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl bg-gray-50 p-10 transition hover:bg-gray-100">
          <span className="text-6xl">📷</span>

          <h2 className="text-xl font-semibold">
            Choose Product Image
          </h2>

          <p className="text-sm text-gray-500">
            PNG, JPG or WEBP (Max 5MB)
          </p>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
          />
        </label>
      )}
    </div>
  );
}