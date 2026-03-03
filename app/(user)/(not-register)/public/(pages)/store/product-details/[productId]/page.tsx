import ProductGalleryClient from "../_components/product-gallery.client";
import PurchasePanelClient from "../_components/purchase-panel.client";
import OverviewSection from "../_components/overview-section";
import SpecsTable from "../_components/specs-table";
import { ProductDetails } from "@/app/(user)/(not-register)/public/types/product.details";
import { PRODUCT_DETAILS_MOCK } from "@/app/(user)/(not-register)/public/data/product.details.mock";
import Breadcrumb from "@/app/(user)/(not-register)/public/(pages)/store/product-details/_components/breadcrumb";
import BundleSetupClient from "@/app/(user)/(not-register)/public/(pages)/store/product-details/_components/bundle-setup.client";
import FrequentlyBoughtTogether from "@/app/(user)/(not-register)/public/(pages)/store/product-details/_components/frequently-bought-together";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  const product: ProductDetails = {
    ...PRODUCT_DETAILS_MOCK,
    id: productId,
  };

  return (
    <div className="mt-24 padding">
      <div className="py-6">
        <Breadcrumb items={product.breadcrumbs} />

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-5">
            <ProductGalleryClient product={product} />
            <BundleSetupClient product={product} />
          </div>

          <div className="lg:col-span-5">
            <PurchasePanelClient product={product} />
          </div>
        </div>
        <div className="mx-auto max-w-5xl space-y-5">
          <OverviewSection product={product} />
          <SpecsTable product={product} />
        </div>
        <FrequentlyBoughtTogether />
      </div>
    </div>
  );
}
