import CheckoutStatusCard from "@/app/public/(pages)/checkout/_components/checkout-status-card";

type SuccessPageProps = {
    searchParams: Promise<{
        session_id?: string;
    }>;
};

export default async function CheckoutSuccessPage({
    searchParams,
}: SuccessPageProps) {
    const params = await searchParams;
    const sessionId = params.session_id ?? null;

    return (
        <CheckoutStatusCard
            variant="success"
            title="Payment Successful"
            description="Your payment has been completed successfully. We have received your order and will start processing it shortly."
            sessionId={sessionId}
            primaryAction={{
                label: "Continue Shopping",
                href: "/public/store",
            }}
            secondaryAction={{
                label: "View Orders",
                href: "/public/user/order-history",
            }}
        />
    );
}