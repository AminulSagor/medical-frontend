import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Newsletters",
};

export default function NewslettersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}