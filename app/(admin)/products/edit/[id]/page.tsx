import ProductForm from "../../add/_components/product-form";

export default function EditProductPage({
    params,
}: {
    params: { id: string };
}) {
    const mockProduct = {
        productName: "Laryngeal Mask Airway Supreme",
        clinicalDescription: "Used for airway management in emergency settings.",
        actualPrice: "120",
        offerPrice: "95",
        sku: "TAI-001-SZ4",
        stockQty: 142,
    };

    return <ProductForm mode="edit" initialData={mockProduct} />;
}