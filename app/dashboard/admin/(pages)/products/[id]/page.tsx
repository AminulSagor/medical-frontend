import ProductDetailsView from "./_components/product-details-view";
import { MOCK_PRODUCT_DETAILS } from "./_data/product-details.mock";

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
    const data = { ...MOCK_PRODUCT_DETAILS, id: params.id };
    return <ProductDetailsView data={data} />;
}