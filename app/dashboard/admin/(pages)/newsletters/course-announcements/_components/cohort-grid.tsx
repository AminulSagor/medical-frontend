import type { CourseCohortCard } from "../types/course-annoucements-types";
import CohortCard from "./cohort-card";

export default function CohortGrid({ items }: { items: CourseCohortCard[] }) {
  if (!items.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-500">
        No cohorts found.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
      {items.map((item) => (
        <CohortCard key={item.id} item={item} />
      ))}
    </div>
  );
}
