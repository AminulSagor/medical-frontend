export default function EditProductLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-full">
            <div className="mx-auto w-full max-w-[1200px] px-6 py-6">
                {children}
            </div>
        </div>
    );
}