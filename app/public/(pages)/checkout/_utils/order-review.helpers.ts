export type OrderItemData = {
    id: string;
    title: string;
    qty: number;
    price: string;
    imageSrc?: string | null;
    availableQuantity?: number;
};

export const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function formatMoney(value: string | number | null | undefined) {
    const numericValue =
        typeof value === "number" ? value : Number.parseFloat(value ?? "0");

    if (Number.isNaN(numericValue)) return "$0.00";

    return `$${numericValue.toFixed(2)}`;
}