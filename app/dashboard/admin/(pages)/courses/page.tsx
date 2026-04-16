"use client";

import { useEffect, useMemo, useState } from "react";
import CoursesHeader from "./_components/courses-header";
import CourseStatsRow from "./_components/course-stats-row";
import CoursesTabs from "./_components/courses-tabs";
import CoursesTable from "./_components/courses-table";
import type { CourseItem, CourseTabKey, DeliveryMode } from "./_components/courses.types";
import { useRouter } from "next/navigation";
import { listWorkshops, updateWorkshop } from "@/service/admin/workshop.service";
import type { WorkshopDay, WorkshopListItem } from "@/types/admin/workshop.types";

const PAGE_SIZE = 5;
const SEARCH_DEBOUNCE_MS = 300;

function formatDateLabel(value?: string) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function formatTimeLabel(value?: string) {
    if (!value) return "—";
    const [hourString = "0", minuteString = "0"] = value.split(":");
    const hour = Number(hourString);
    const minute = Number(minuteString);
    if (Number.isNaN(hour) || Number.isNaN(minute)) return "—";
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function sortDays(days: WorkshopDay[]) {
    return [...days].sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.dayNumber - b.dayNumber;
    });
}

function getBoundaryDates(days: WorkshopDay[]) {
    const sorted = sortDays(days);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    return {
        firstDate: first?.date,
        lastDate: last?.date,
        firstStartTime: [...(first?.segments ?? [])]
            .sort((a, b) => a.startTime.localeCompare(b.startTime))[0]?.startTime,
    };
}

function getInstructorName(workshop: WorkshopListItem) {
    const faculty = workshop.faculty?.[0];
    if (!faculty) return "Not available";
    if (faculty.fullName) return faculty.fullName;
    return [faculty.firstName, faculty.lastName].filter(Boolean).join(" ") || "Not available";
}

function mapWorkshopToCourseItem(workshop: WorkshopListItem): CourseItem {
    const { firstDate, lastDate, firstStartTime } = getBoundaryDates(workshop.days ?? []);
    return {
        id: workshop.id,
        dateLabel: formatDateLabel(firstDate ?? workshop.createdAt),
        timeLabel: formatTimeLabel(firstStartTime),
        title: workshop.title,
        tags: [workshop.deliveryMode === "online" ? "Online" : "In Person"],
        instructorName: getInstructorName(workshop),
        instructorAvatarUrl: workshop.faculty?.[0]?.imageUrl || undefined,
        capacityUsed: workshop.overview?.totalEnrolled ?? 0,
        capacityTotal: workshop.capacity,
        refundRequests: workshop.overview?.refundRequested ?? 0,
        isActive: workshop.status === "published",
        status: workshop.status === "draft" ? "drafts" : "upcoming",
        deliveryMode: workshop.deliveryMode,
        rawStartDate: firstDate,
        rawEndDate: lastDate,
    };
}

async function fetchAllWorkshops(params: Parameters<typeof listWorkshops>[0]) {
    const first = await listWorkshops({ ...params, page: 1, limit: 5 });
    let items = [...first.data];
    for (let currentPage = 2; currentPage <= first.meta.totalPages; currentPage += 1) {
        const next = await listWorkshops({ ...params, page: currentPage, limit: 5 });
        items = items.concat(next.data);
    }
    return items;
}

export default function CoursesPage() {
    const router = useRouter();

    const [tab, setTab] = useState<CourseTabKey>("upcoming");
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [deliveryMode, setDeliveryMode] = useState<DeliveryMode | "all">("all");
    const [page, setPage] = useState(1);
    const [publishedItems, setPublishedItems] = useState<CourseItem[]>([]);
    const [draftItems, setDraftItems] = useState<CourseItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const handle = window.setTimeout(() => setDebouncedQuery(query.trim()), SEARCH_DEBOUNCE_MS);
        return () => window.clearTimeout(handle);
    }, [query]);

    useEffect(() => {
        setPage(1);
    }, [tab, debouncedQuery, deliveryMode]);

    useEffect(() => {
        let isMounted = true;

        async function load() {
            setLoading(true);
            try {
                const baseParams = {
                    q: debouncedQuery || undefined,
                    deliveryMode: deliveryMode === "all" ? undefined : deliveryMode,
                    sortBy: "createdAt" as const,
                    sortOrder: "desc" as const,
                };

                const [publishedResponse, draftResponse] = await Promise.all([
                    fetchAllWorkshops({ ...baseParams, status: "published" }),
                    fetchAllWorkshops({ ...baseParams, status: "draft" }),
                ]);

                if (!isMounted) return;
                setPublishedItems(publishedResponse.map(mapWorkshopToCourseItem));
                setDraftItems(draftResponse.map(mapWorkshopToCourseItem));
            } catch (error) {
                console.error("Failed to load workshops:", error);
                if (!isMounted) return;
                setPublishedItems([]);
                setDraftItems([]);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        load();
        return () => {
            isMounted = false;
        };
    }, [debouncedQuery, deliveryMode, refreshKey]);

    const counts = useMemo<Record<CourseTabKey, number>>(() => ({
        upcoming: publishedItems.length,
        past: 0,
        drafts: draftItems.length,
        refund_requests: 0,
    }), [publishedItems, draftItems]);

    const filtered = useMemo(() => {
        if (tab === "upcoming") return publishedItems;
        if (tab === "drafts") return draftItems;
        return [];
    }, [tab, publishedItems, draftItems]);

    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);

    const paginatedItems = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filtered.slice(start, start + PAGE_SIZE);
    }, [filtered, page]);

    const nextUpcoming = [...publishedItems]
        .sort((a, b) => (a.rawStartDate || "").localeCompare(b.rawStartDate || ""))[0];

    const nextWorkshop = nextUpcoming?.dateLabel ?? "—";
    const activeSeats = publishedItems.reduce((sum, item) => sum + (item.capacityTotal || 0), 0);
    const openSeats = publishedItems.reduce((sum, item) => sum + Math.max(0, (item.capacityTotal || 0) - (item.capacityUsed || 0)), 0);
    const refundPending = 0;

    function buildRowQuery(id: string) {
        const course = [...publishedItems, ...draftItems].find((item) => item.id === id);
        if (!course) return "";
        const params = new URLSearchParams({
            dateLabel: course.dateLabel ?? "",
            timeLabel: course.timeLabel ?? "",
            title: course.title ?? "",
            instructorName: course.instructorName ?? "",
            instructorAvatarUrl: course.instructorAvatarUrl ?? "",
            capacityUsed: String(course.capacityUsed ?? 0),
            capacityTotal: String(course.capacityTotal ?? 0),
            refundRequests: String(course.refundRequests ?? 0),
            deliveryMode: String(course.deliveryMode),
        });
        return `?${params.toString()}`;
    }

    async function handleToggleActive(id: string, next: boolean) {
        try {
            await updateWorkshop(id, { status: next ? "published" : "draft" });
            setRefreshKey((value) => value + 1);
        } catch (error) {
            console.error("Failed to update workshop status:", error);
        }
    }

    return (
        <div className="space-y-5">
            <CoursesHeader
                onSchedule={() => router.push("/dashboard/admin/courses/create")}
            />

            <CourseStatsRow
                nextWorkshop={nextWorkshop}
                activeSeatsLabel={`${activeSeats} Total`}
                openSeatsLabel={`${openSeats} Open`}
                refundPendingLabel={`${refundPending} Pending`}
            />

            <div className="rounded-2xl border border-slate-200 bg-white">
                <div className="px-5 pt-5">
                    <CoursesTabs tab={tab} onChange={setTab} counts={counts} />
                </div>

                <CoursesTable
                    items={loading ? [] : paginatedItems}
                    loading={loading}
                    query={query}
                    onQueryChange={setQuery}
                    selectedDeliveryMode={deliveryMode}
                    onDeliveryModeChange={setDeliveryMode}
                    onToggleActive={handleToggleActive}
                    onView={(id) => router.push(`/dashboard/admin/courses/${encodeURIComponent(id)}${buildRowQuery(id)}`)}
                    onEdit={(id) => console.log("edit", id)}
                    onDelete={(id) => console.log("delete", id)}
                    page={page}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    pageSize={PAGE_SIZE}
                    onPageChange={setPage}
                />
            </div>
        </div>
    );
}
