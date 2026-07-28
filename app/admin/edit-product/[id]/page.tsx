"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ImageUploader from "@/components/admin/ImageUploader";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [featured, setFeatured] = useState(false);

  const [image, setImage] = useState("");
  const [imageFile, setImageFile] =
    useState<File | null>(null);

  useEffect(() => {
    getProduct();
  }, []);

  async function getProduct() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      alert(error.message);
      router.push("/admin");
      return;
    }

    setName(data.name);
    setDescription(data.description);
    setPrice(data.price.toString());
    setCategory(data.category);
    setStock(data.stock.toString());
    setFeatured(data.featured);
    setImage(data.image || "");

    setLoading(false);
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setSaving(true);

    let imageUrl = image;

    if (imageFile) {
      const fileName =
        Date.now() + "-" + imageFile.name;

      const { error: uploadError } =
        await supabase.storage
          .from("products")
          .upload(fileName, imageFile);

      if (uploadError) {
        alert(uploadError.message);
        setSaving(false);
        return;
      }

      const { data } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    const { error } = await supabase
      .from("products")
      .update({
        name,
        description,
        price: Number(price),
        category,
        stock: Number(stock),
        featured,
        image: imageUrl,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      setSaving(false);
      return;
    }

    alert("Product updated successfully");

    router.push("/admin");
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold">
          Loading...
        </h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">

      <h1 className="mb-10 text-4xl font-bold">
        Edit Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {image && (
          <img
            src={image}
            alt={name}
            className="h-72 w-full rounded-xl object-cover"
          />
        )}

        <ImageUploader
          onImageSelect={setImageFile}
        />

        <input
          type="text"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="w-full rounded-xl border p-3"
          required
        />

        <textarea
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
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
          className="w-full rounded-xl border p-3"
          required
        />

        <input
          type="text"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          className="w-full rounded-xl border p-3"
          required
        />

        <input
          type="number"
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
              setFeatured(e.target.checked)
            }
          />

          Featured Product
        </label>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-green-600 py-4 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : "Save Changes"}
        </button>

      </form>

    </main>
  );
}