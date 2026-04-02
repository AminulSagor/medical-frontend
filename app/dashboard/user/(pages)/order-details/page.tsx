import OrderDetailsHeader from "./_components/order-details-header";
import ShipmentItemsCard from "./_components/shipment-items-card";
import OrderSummaryCard from "./_components/order-summary-card";

export default function OrderDetailsPage() {
    const items = [
        {
            title: "Disposable Laryngoscope Blades (Box of 20)",
            sku: "DLB-9920-B",
            price: "$120.00",
            qty: 1,
            meta: ["Size: Mac 3", "Packaging: Sterile"],
            imageSrc: "/photos/image.png",
        },
        {
            title: "Fiber Optic Laryngoscope Handle",
            sku: "FOL-8829-X",
            price: "$145.00",
            qty: 1,
            meta: ["Size: Adult Standard", "Material: Stainless Steel"],
            imageSrc: "/photos/image.png",
        },
        {
            title: "Adult Airway Reference Card",
            sku: "ARC-2244-C",
            price: "$24.50",
            qty: 1,
            meta: ["Format: Laminated Pocket-sized", "Edition: 2026 Guidelines"],
            imageSrc: "/photos/image.png",
        },
        {
            title: "Adult Airway Reference Card",
            sku: "ARC-2244-C",
            price: "$24.50",
            qty: 1,
            meta: ["Format: Laminated Pocket-sized", "Edition: 2026 Guidelines"],
            imageSrc: "/photos/image.png",
        },
    ];

    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-6">
            <OrderDetailsHeader
                backHref="/order-history"
                orderNo="ORD-8829"
                placedOn="October 24, 2026"
                statusLabel="Order Received"
                carrier="Not Assigned"
                trackingNo="—"
                etaLabel="Pending Shipment"
                activeStep="Ordered"
            />

            {/* Items + Summary */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px] items-start">
                <ShipmentItemsCard items={items} orderNoBadge="Order No: #ORD-8829" />

                <OrderSummaryCard
                    shipTo={{
                        name: "Dr. Sarah Thompson",
                        lines: ["4221 Medical Center Dr,", "Suite 100", "Seattle, WA 98105"],
                    }}
                    payment={{ label: "Visa ending in 4242" }}
                    totals={{
                        subtotalLabel: "Subtotal (3 items)",
                        subtotal: "$289.50",
                        shipping: "$12.00",
                        tax: "$18.45",
                        grandTotal: "$319.95",
                    }}
                />
            </div>
        </main>
    );
}
