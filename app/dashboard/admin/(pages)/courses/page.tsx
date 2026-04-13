"use client";

import { useEffect, useMemo, useState } from "react";
import CoursesHeader from "./_components/courses-header";
import CourseStatsRow from "./_components/course-stats-row";
import CoursesTabs from "./_components/courses-tabs";
import CoursesTable from "./_components/courses-table";
import type { CourseItem, CourseTabKey } from "./_components/courses.types";
import { useRouter } from "next/navigation";
import { listWorkshops } from "@/service/admin/workshop.service";
import type { WorkshopListItem } from "@/types/admin/workshop.types";

const PAGE_SIZE = 4;

function formatDateLabel(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function formatTimeLabel(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function mapWorkshopToCourseItem(w: WorkshopListItem): CourseItem {
    let status: CourseItem["status"];

    if (w.status === "draft") {
        status = "drafts";
    } else {
        status = "upcoming";
    }

    return {
        id: w.id,
        dateLabel: formatDateLabel(w.createdAt),
        timeLabel: formatTimeLabel(w.createdAt),
        title: w.title,
        tags: [w.deliveryMode === "online" ? "Online" : "Workshop"],
        instructorName: "Not available",
        instructorAvatarUrl: undefined,
        capacityUsed: 0,
        capacityTotal: w.capacity,
        refundRequests: 0,
        isActive: w.status === "published",
        status,
        deliveryMode: w.deliveryMode,
    };
}

export default function CoursesPage() {
    const router = useRouter();

    const [tab, setTab] = useState<CourseTabKey>("upcoming");
    const [query, setQuery] = useState("");
    const [onlyRefunds, setOnlyRefunds] = useState(false);
    const [page, setPage] = useState(1);
    const [all, setAll] = useState<CourseItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        listWorkshops({ page: 1, limit: 10, sortBy: "createdAt", sortOrder: "desc" })
            .then((res) => {
                setAll(res.data.map(mapWorkshopToCourseItem));
            })
            .catch((err) => {
                console.error("Failed to load workshops:", err);
                setAll([]);
            })
            .finally(() => setLoading(false));
    }, []);

    const counts = useMemo<Record<CourseTabKey, number>>(() => {
        const base: Record<CourseTabKey, number> = {
            upcoming: 0,
            past: 0,
            drafts: 0,
            refund_requests: 0,
        };

        for (const c of all) {
            base[c.status] += 1;
            if (c.refundRequests > 0) base.refund_requests += 1;
        }

        return base;
    }, [all]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();

        return all
            .filter((c) =>
                tab === "refund_requests" ? c.refundRequests > 0 : c.status === tab,
            )
            .filter((c) => (onlyRefunds ? c.refundRequests > 0 : true))
            .filter((c) => {
                if (!q) return true;
                return (
                    c.title.toLowerCase().includes(q) ||
                    c.instructorName.toLowerCase().includes(q)
                );
            });
    }, [all, tab, query, onlyRefunds]);

    useEffect(() => {
        setPage(1);
    }, [tab, query, onlyRefunds]);

    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);

    const paginatedItems = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filtered.slice(start, start + PAGE_SIZE);
    }, [filtered, page]);

    const nextWorkshop =
        all.find((c) => c.status === "upcoming")?.dateLabel ?? "—";

    const activeSeats = all
        .filter((c) => c.status === "upcoming")
        .reduce((sum, c) => sum + (c.capacityTotal ?? 0), 0);

    const openSeats = all
        .filter((c) => c.status === "upcoming")
        .reduce(
            (sum, c) =>
                sum + Math.max(0, (c.capacityTotal ?? 0) - (c.capacityUsed ?? 0)),
            0,
        );

    const refundPending = all.reduce(
        (sum, c) => sum + (c.refundRequests ?? 0),
        0,
    );

    function buildRowQuery(id: string) {
        const c = all.find((x) => x.id === id);
        if (!c) return "";

        const q = new URLSearchParams({
            dateLabel: c.dateLabel ?? "",
            timeLabel: c.timeLabel ?? "",
            title: c.title ?? "",
            instructorName: c.instructorName ?? "",
            instructorAvatarUrl: c.instructorAvatarUrl ?? "",
            capacityUsed: String(c.capacityUsed ?? 0),
            capacityTotal: String(c.capacityTotal ?? 0),
            refundRequests: String(c.refundRequests ?? 0),
            deliveryMode: String(c.deliveryMode),
        });

        return `?${q.toString()}`;
    }

    return (
        <div className="space-y-5">
            <CoursesHeader
                onExport={() => console.log("Export")}
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
                    items={paginatedItems}
                    query={query}
                    onQueryChange={setQuery}
                    onlyRefunds={onlyRefunds}
                    onOnlyRefundsChange={setOnlyRefunds}
                    onToggleActive={(id, next) => {
                        setAll((prev) =>
                            prev.map((c) => (c.id === id ? { ...c, isActive: next } : c)),
                        );
                    }}
                    onView={(id) =>
                        router.push(
                            `/dashboard/admin/courses/${encodeURIComponent(id)}${buildRowQuery(id)}`,
                        )
                    }
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