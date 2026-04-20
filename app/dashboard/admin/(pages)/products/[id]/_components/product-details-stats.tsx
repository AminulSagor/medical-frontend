import { BadgeCheck, CalendarDays, ShoppingCart } from "lucide-react";
import type { ProductDetails } from "../_types/product-details.types";
import StatCard from "./_shared/stat-card";

type Props = {
    data: ProductDetails;
};

export default function ProductDetailsStats({ data }: Props) {
    return (
        <div className="grid gap-6 lg:grid-cols-3">
            <StatCard
                label="TOTAL UNITS SOLD"
                value={data.totalUnitsSold.toLocaleString()}
                sub="LIFETIME VOL."
                icon={<ShoppingCart size={18} strokeWidth={2.6} />}
                iconTone="teal"
            />
            <StatCard
                label="TOTAL REVENUE"
                value={data.totalRevenueLabel}
                sub={data.totalRevenueSubLabel}
                icon={<BadgeCheck size={18} strokeWidth={2.6} />}
                iconTone="dark"
            />
            <StatCard
                label="LAST SALE DATE"
                value={data.lastSaleDateLabel}
                sub={data.lastSaleSubLabel}
                icon={<CalendarDays size={18} strokeWidth={2.6} />}
                iconTone="slate"
            />
        </div>
    );
}