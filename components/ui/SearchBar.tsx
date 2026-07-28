"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();

  const [search, setSearch] = useState("");

  function handleSearch(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!search.trim()) return;

    router.push(
      `/shop?search=${encodeURIComponent(search)}`
    );
  }

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center"
    >
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="w-72 rounded-l-xl border border-gray-300 px-4 py-2 outline-none transition focus:border-green-600"
      />

      <button
        type="submit"
        className="rounded-r-xl bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
      >
        Search
      </button>
    </form>
  );
}