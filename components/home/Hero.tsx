import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="bg-green-50">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-12 px-6 py-20 md:flex-row">

        <div className="max-w-xl">
          <p className="mb-3 font-semibold uppercase tracking-widest text-green-600">
            Welcome to Petsera
          </p>

          <h1 className="mb-6 text-5xl font-extrabold leading-tight text-gray-900">
            Everything your pet needs,
            <br />
            all in one place.
          </h1>

          <p className="mb-8 text-lg text-gray-600">
            Premium food, toys and accessories for happy and healthy pets.
            Fast delivery across Finland.
          </p>

          <div className="flex gap-4">
            <Button>Shop Now</Button>

            <Button variant="secondary">
              Learn More
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center text-8xl">
          🐶🐱
        </div>

      </div>
    </section>
  );
}