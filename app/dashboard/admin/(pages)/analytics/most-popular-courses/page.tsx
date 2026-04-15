import MostPopularCoursesViewAllClient from "./_components/most-popular-courses-view-all-client";
import {
  getMostPopularCoursesTable,
  getPopularCoursesMetrics,
} from "@/service/admin/analytics.service";

function formatDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getDefaultDateRange() {
  const end = new Date();
  const start = new Date(end);
  start.setUTCDate(end.getUTCDate() - 29);
  return {
    startDate: formatDateOnly(start),
    endDate: formatDateOnly(end),
  };
}

function toPositiveInt(value: string | undefined, fallback: number) {
  const n = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return n;
}

export default async function MostPopularCoursesViewAllPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const defaults = getDefaultDateRange();

  const page = toPositiveInt(
    typeof params.page === "string" ? params.page : undefined,
    1,
  );
  const limit = toPositiveInt(
    typeof params.limit === "string" ? params.limit : undefined,
    10,
  );
  const type = typeof params.type === "string" ? params.type : undefined;
  10;
  const startDate =
    typeof params.startDate === "string"
      ? params.startDate
      : defaults.startDate;
  const endDate =
    typeof params.endDate === "string" ? params.endDate : defaults.endDate;

  const [metricsResult, tableResult] = await Promise.allSettled([
    getPopularCoursesMetrics({ startDate, endDate }),
    getMostPopularCoursesTable({
      startDate,
      endDate,
      page,
      limit,
      ...(type ? { type } : {}),
    }),
  ]);

  const metrics =
    metricsResult.status === "fulfilled"
      ? metricsResult.value
      : { totalEnrollments: 0, activeWorkshops: 0 };
  const table =
    tableResult.status === "fulfilled"
      ? tableResult.value
      : { items: [], meta: { page, limit } };

  return (
    <div className="py-6">
      <MostPopularCoursesViewAllClient
        // metrics={metrics}
        items={table.items}
        page={table.meta.page ?? page}
        limit={table.meta.limit ?? limit}
        canNext={table.items.length >= (table.meta.limit ?? limit)}
        startDate={startDate}
        endDate={endDate}
        type={type ?? ""}
      />
    </div>
  );
}
