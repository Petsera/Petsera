"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ImageUploader from "@/components/admin/ImageUploader";

export default function AddProductPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [featured, setFeatured] = useState(false);

  const [imageFile, setImageFile] =
    useState<File | null>(null);

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

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error || !profile) {
      router.push("/");
      return;
    }

    if (profile.role !== "admin") {
      router.push("/");
      return;
    }
  }

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

    let image = "";

    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`;

      const { error: uploadError } =
        await supabase.storage
          .from("products")
          .upload(fileName, imageFile);

      if (uploadError) {
        alert(uploadError.message);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      image = data.publicUrl;
    }

    const { error } = await supabase
      .from("products")
      .insert({
        name,
        description,
        price: Number(price),
        category,
        stock: Number(stock),
        featured,
        image,
      });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    alert("Product added successfully");

    router.push("/admin");
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-10 text-4xl font-bold">
        Add Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <ImageUploader
          onImageSelect={setImageFile}
        />

        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="w-full rounded-xl border p-3"
          required
        />

        <textarea
          placeholder="Description"
          rows={5}
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          className="w-full rounded-xl border p-3"
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
          className="w-full rounded-xl border p-3"
          required
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          className="w-full rounded-xl border p-3"
          required
        />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) =>
            setStock(e.target.value)
          }
          className="w-full rounded-xl border p-3"
          required
        />

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) =>
              setFeatured(
                e.target.checked
              )
            }
          />

          Featured Product
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-green-600 py-4 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
        >
          {loading
            ? "Adding Product..."
            : "Add Product"}
        </button>
      </form>
    </main>
  );
}