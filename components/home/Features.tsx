export default function Features() {
  return (
    <section className="bg-green-50 py-20">
      <div className="mx-auto max-w-7xl px-6">

        <h2 className="mb-12 text-center text-3xl font-bold">
          Why Choose Petsera?
        </h2>

        <div className="grid gap-8 md:grid-cols-3">

          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <div className="mb-4 text-5xl">🚚</div>

            <h3 className="mb-3 text-xl font-semibold">
              Fast Delivery
            </h3>

            <p className="text-gray-600">
              Fast shipping across Finland with reliable delivery partners.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <div className="mb-4 text-5xl">⭐</div>

            <h3 className="mb-3 text-xl font-semibold">
              Premium Quality
            </h3>

            <p className="text-gray-600">
              Carefully selected products from trusted brands.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <div className="mb-4 text-5xl">❤️</div>

            <h3 className="mb-3 text-xl font-semibold">
              Happy Pets
            </h3>

            <p className="text-gray-600">
              Everything your pet needs for a healthier and happier life.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}