import AdminLayoutClient from "@/app/(admin)/_components/admin-layout-client";
import { Suspense } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </Suspense>
  );
}
