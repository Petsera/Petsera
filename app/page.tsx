import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Features from "@/components/home/Features";
import CheckoutButton from "@/components/payment/CheckoutButton";

export default function Home() {
  return (
    <>
      <Hero />

      <Categories />

      <FeaturedProducts />

      <div className="mx-auto my-10 flex max-w-7xl justify-center px-6">
        <CheckoutButton />
      </div>

      <Features />
    </>
  );
}