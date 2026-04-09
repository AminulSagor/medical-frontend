import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CourseHeader({
  children,
}: {
  children?: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="rounded-2xl pt-6 pb-8">
      {/* Top Row */}
      <div className="flex items-start gap-3">
        <button
          onClick={() => router.push("/dashboard/admin/newsletters")}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 mt-1"
        >
          <ArrowLeft size={16} />
        </button>

        <div>
          <h1 className="text-[24px] font-bold leading-[32px] tracking-[-0.6px] text-slate-900">
            Course Announcements
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Target specific trainee groups for schedule updates and materials.
          </p>
        </div>
      </div>

      {/* Metrics Slot */}
      <div className="mt-6">{children}</div>
    </div>
  );
}
