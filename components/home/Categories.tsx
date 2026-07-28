export default function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <h2 className="mb-10 text-center text-3xl font-bold">
        Shop by Category
      </h2>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm transition hover:shadow-lg">
          <div className="mb-4 text-5xl">🐶</div>
          <h3 className="font-semibold">Dogs</h3>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm transition hover:shadow-lg">
          <div className="mb-4 text-5xl">🐱</div>
          <h3 className="font-semibold">Cats</h3>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm transition hover:shadow-lg">
          <div className="mb-4 text-5xl">🐦</div>
          <h3 className="font-semibold">Birds</h3>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm transition hover:shadow-lg">
          <div className="mb-4 text-5xl">🐠</div>
          <h3 className="font-semibold">Fish</h3>
        </div>
      </div>
    </section>
  );
}