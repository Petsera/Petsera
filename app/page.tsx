import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <>
      <Header />

      <main className="p-6">
        <h2 className="mb-4 text-2xl font-semibold">
          Welcome to Petsera
        </h2>

        <Button>Shop Now</Button>
      </main>
    </>
  );
}