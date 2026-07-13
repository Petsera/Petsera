import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        <Link
          href="/"
          className="text-3xl font-bold tracking-tight text-green-600"
        >
          Petsera
        </Link>

        <nav className="flex items-center gap-8 text-gray-800">
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>

      </div>
    </header>
  );
}