// app/dashboard/admin/layout.tsx
import AdminSidebar from "@/app/dashboard/admin/_components/admin-sidebar";
import AdminTopbar from "@/app/dashboard/admin/_components/admin-topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden bg-[var(--background)]">
      <div className="flex h-full w-full">
        <aside className="w-[260px] shrink-0 border-r border-slate-200 bg-white">
          <div className="h-full overflow-y-auto">
            <AdminSidebar />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar />

          <main className="min-w-0 flex-1 overflow-y-auto px-6 py-6">
            <div className="mx-auto w-full max-w-[1100px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
