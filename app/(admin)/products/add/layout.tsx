"use client";

export default function AddProductLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-full">
            {/* keeps the same project background (your body background) */}
            <div className="mx-auto w-full max-w-[1200px] px-6 py-6">{children}</div>
        </div>
    );
}