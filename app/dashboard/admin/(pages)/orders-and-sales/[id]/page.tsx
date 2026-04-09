import OrderDetailsClient from "./_components/order-details-client";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const decodedId = decodeURIComponent(id ?? "");
    return <OrderDetailsClient id={decodedId} />;
}