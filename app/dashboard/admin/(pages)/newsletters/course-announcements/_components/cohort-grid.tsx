import type { CourseCohortCard } from "../types/course-annoucements-types";
import CohortCard from "./cohort-card";

export default function CohortGrid({ items }: { items: CourseCohortCard[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
      {items.map((item) => (
        <CohortCard key={item.id} item={item} />
      ))}
    </div>
  );
}