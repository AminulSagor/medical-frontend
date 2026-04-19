"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import BlogsAnalyticsOverview from "./blogs-analytics-overview";
import BlogsManagementList from "./blogs-management-list";
import { getAdminBlogs } from "@/service/admin/blogs/blog.service";
import type {
  BlogItem,
  BlogManagementRow,
  BlogManagementSortKey,
  BlogManagementTabCounts,
  BlogManagementTabKey,
  BlogPublishingStatus,
} from "@/types/admin/blogs/blog.types";
import BlogsHeader from "@/app/dashboard/admin/(pages)/blogs/_components/blogs-management/blog-header";

function formatBlogDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
}

function mapPublishingStatusToUiStatus(
  status: BlogPublishingStatus,
): "Published" | "Draft" | "Scheduled" {
  if (status === "published") return "Published";
  if (status === "draft") return "Draft";
  return "Scheduled";
}

function getBlogDisplayDate(blog: BlogItem): string | null {
  if (blog.publishingStatus === "scheduled") {
    return blog.scheduledPublishDate;
  }

  if (blog.publishingStatus === "published") {
    return blog.publishedAt || blog.createdAt;
  }

  return blog.updatedAt || blog.createdAt;
}

function mapBlogToRow(blog: BlogItem): BlogManagementRow {
  const firstAuthor = blog.authors[0];
  const firstCategory = blog.categories[0];
  const displayDate = getBlogDisplayDate(blog);

  const heroImage =
    blog.coverImages?.find((image) => image.imageType === "hero") ||
    blog.coverImages?.[0];

  return {
    id: blog.id,
    title: blog.title,
    author: blog.authorName || firstAuthor?.fullLegalName || "—",
    category: firstCategory?.name || "—",
    status: mapPublishingStatusToUiStatus(blog.publishingStatus),
    dateLabel: formatBlogDate(displayDate),
    dateValue: displayDate,
    views: null,
    thumbSrc: heroImage?.imageUrl || null,
  };
}

function getTabFromStatusParam(status: string | null): BlogManagementTabKey {
  if (status === "published") return "published";
  if (status === "draft") return "drafts";
  if (status === "scheduled") return "scheduled";
  return "all";
}

function getStatusFromTab(
  tab: BlogManagementTabKey,
): BlogPublishingStatus | undefined {
  if (tab === "published") return "published";
  if (tab === "drafts") return "draft";
  if (tab === "scheduled") return "scheduled";
  return undefined;
}

function getSortFromQuery(sort: string | null): BlogManagementSortKey {
  if (
    sort === "newest" ||
    sort === "oldest" ||
    sort === "title-asc" ||
    sort === "title-desc"
  ) {
    return sort;
  }

  return "newest";
}

function sortRows(
  rows: BlogManagementRow[],
  sort: BlogManagementSortKey,
): BlogManagementRow[] {
  const clonedRows = [...rows];

  if (sort === "title-asc") {
    return clonedRows.sort((a, b) => a.title.localeCompare(b.title));
  }

  if (sort === "title-desc") {
    return clonedRows.sort((a, b) => b.title.localeCompare(a.title));
  }

  if (sort === "oldest") {
    return clonedRows.sort((a, b) => {
      const aTime = a.dateValue ? new Date(a.dateValue).getTime() : 0;
      const bTime = b.dateValue ? new Date(b.dateValue).getTime() : 0;
      return aTime - bTime;
    });
  }

  return clonedRows.sort((a, b) => {
    const aTime = a.dateValue ? new Date(a.dateValue).getTime() : 0;
    const bTime = b.dateValue ? new Date(b.dateValue).getTime() : 0;
    return bTime - aTime;
  });
}

const DEFAULT_TAB_COUNTS: BlogManagementTabCounts = {
  all: 0,
  published: 0,
  drafts: 0,
  scheduled: 0,
};

export default function BlogsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const limit = Math.max(1, Number(searchParams.get("limit") || "10"));
  const q = searchParams.get("search") || "";
  const tab = getTabFromStatusParam(searchParams.get("status"));
  const sort = getSortFromQuery(searchParams.get("sort"));

  const [items, setItems] = useState<BlogItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredCount, setFilteredCount] = useState(0);
  const [tabCounts, setTabCounts] =
    useState<BlogManagementTabCounts>(DEFAULT_TAB_COUNTS);

  const rows = useMemo(() => {
    const mappedRows = items.map(mapBlogToRow);
    return sortRows(mappedRows, sort);
  }, [items, sort]);

  const updateQueryParams = (
    updates: Record<string, string | number | undefined>,
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const setTab = (nextTab: BlogManagementTabKey) => {
    const nextStatus = getStatusFromTab(nextTab);

    updateQueryParams({
      page: 1,
      status: nextStatus,
    });
  };

  const setQ = (value: string) => {
    updateQueryParams({
      page: 1,
      search: value || undefined,
    });
  };

  const setPage = (nextPage: number) => {
    updateQueryParams({
      page: nextPage,
    });
  };

  const setSort = (nextSort: BlogManagementSortKey) => {
    updateQueryParams({
      sort: nextSort,
    });
  };

  useEffect(() => {
    let ignore = false;

    const loadBlogs = async () => {
      try {
        const result = await getAdminBlogs({
          page,
          limit,
          status: getStatusFromTab(tab),
          search: q || undefined,
        });

        if (ignore) return;

        setItems(result.items);
        setTotalPages(result.meta.totalPages || 1);
        setFilteredCount(result.meta.total || 0);
        setTabCounts({
          all: result.statusCounts.all,
          published: result.statusCounts.published,
          drafts: result.statusCounts.draft,
          scheduled: result.statusCounts.scheduled,
        });
      } catch (error) {
        if (ignore) return;

        setItems([]);
        setTotalPages(1);
        setFilteredCount(0);
        setTabCounts(DEFAULT_TAB_COUNTS);
        console.error("Failed to load blogs:", error);
      }
    };

    loadBlogs();

    return () => {
      ignore = true;
    };
  }, [page, limit, tab, q]);

  return (
    <section className="space-y-6">
      <BlogsHeader
        onCreate={() => router.push("/dashboard/admin/blogs/create")}
      />

      <BlogsAnalyticsOverview />

      <BlogsManagementList
        tab={tab}
        setTab={setTab}
        q={q}
        setQ={setQ}
        sort={sort}
        setSort={setSort}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        filteredCount={filteredCount}
        pageSize={limit}
        rows={rows}
        tabCounts={tabCounts}
        onViewPublicationCalendar={() =>
          router.push("/dashboard/admin/blogs/publication-calendar")
        }
      />
    </section>
  );
}
