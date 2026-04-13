import CheckoutStatusCard from "@/app/public/(pages)/checkout/_components/checkout-status-card";

export default function CheckoutCancelPage() {
    return (
        <CheckoutStatusCard
            variant="cancel"
            title="Payment Not Completed"
            description="Your payment was not completed. No worries — you can try again or return to your cart to review the order."
            primaryAction={{
                label: "Try Again",
                href: "/public/checkout",
            }}
            secondaryAction={{
                label: "Back to Cart",
                href: "/public/cart",
            }}
        />
    );
}