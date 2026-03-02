import ProductSection from "@/app/(user)/(not-register)/public/(pages)/store/_components/products-section";
import StoreHero from "@/app/(user)/(not-register)/public/(pages)/store/_components/store-hero";
import StoreToolbar from "@/app/(user)/(not-register)/public/(pages)/store/_components/store-toolbar";

const page = () => {
  return (
    <main>
      <StoreHero />
      <StoreToolbar />
      <div className="padding">
        <ProductSection />
      </div>
    </main>
  );
};

export default page;
