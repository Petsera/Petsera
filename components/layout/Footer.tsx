import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200 bg-gray-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-4">
        <div>
          <h2 className="mb-4 text-2xl font-bold text-green-600">
            Petsera
          </h2>

          <p className="text-gray-600">
            Everything your pet needs in one place.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">
            Shop
          </h3>

          <ul className="space-y-2 text-gray-600">
            <li><Link href="/shop">All Products</Link></li>
            <li><Link href="/">Dogs</Link></li>
            <li><Link href="/">Cats</Link></li>
            <li><Link href="/">Birds</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">
            Company
          </h3>

          <ul className="space-y-2 text-gray-600">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">
            Customer Service
          </h3>

          <p className="text-gray-600">
            support@petsera.fi
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 py-6 text-center text-gray-500">
        © 2026 Petsera. All rights reserved.
      </div>
    </footer>
  );
}