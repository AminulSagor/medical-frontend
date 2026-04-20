"use client";

import { useEffect, useState } from "react";
import CoursesHeader from "./_components/courses-header";
import CourseStatsRow from "./_components/course-stats-row";
import CoursesTabs from "./_components/courses-tabs";
import CoursesTable from "./_components/courses-table";
import type { CourseItem, CourseTabKey, DeliveryMode } from "./_components/courses.types";
import { useRouter } from "next/navigation";
import { deleteWorkshop, getWorkshopStats, listWorkshops, updateWorkshopStatus } from "@/service/admin/workshop.service";
import type { ListWorkshopsParams, WorkshopDay, WorkshopListItem, WorkshopStatsResponse } from "@/types/admin/workshop.types";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";

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

function mapWorkshopToCourseItem(workshop: WorkshopListItem, tab: CourseTabKey): CourseItem {
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
        status: tab,
        deliveryMode: workshop.deliveryMode,
        rawStartDate: firstDate,
        rawEndDate: lastDate,
    };
}

function buildParamsForTab(
    tab: CourseTabKey,
    baseParams: Omit<ListWorkshopsParams, "page" | "limit" | "status" | "upcoming" | "past" | "hasRefundRequests">,
    pageValue: number,
    limitValue: number,
): ListWorkshopsParams {
    const shared: ListWorkshopsParams = {
        ...baseParams,
        page: pageValue,
        limit: limitValue,
    };

    if (tab === "drafts") {
        return {
            ...shared,
            status: "draft",
        };
    }

    if (tab === "past") {
        return {
            ...shared,
            status: "published",
            past: true,
        };
    }

    if (tab === "refund_requests") {
        return {
            ...shared,
            status: "published",
            hasRefundRequests: true,
        };
    }

    return {
        ...shared,
        status: "published",
        upcoming: true,
    };
}

function buildFallbackPublishedParams(
    baseParams: Omit<ListWorkshopsParams, "page" | "limit" | "status" | "upcoming" | "past" | "hasRefundRequests">,
    pageValue: number,
    limitValue: number,
): ListWorkshopsParams {
    return {
        ...baseParams,
        page: pageValue,
        limit: limitValue,
        status: "published",
    };
}

function DeleteConfirmationDialog({
    title,
    busy,
    onClose,
    onConfirm,
}: {
    title: string;
    busy: boolean;
    onClose: () => void;
    onConfirm: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
            <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-white shadow-2xl">
                <div className="flex items-start justify-between gap-4 border-b border-rose-100 px-6 py-5">
                    <div className="flex items-start gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-rose-50 text-rose-600">
                            <AlertTriangle size={18} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Delete Workshop</h3>
                            <p className="mt-1 text-sm text-slate-500">
                                This action cannot be undone.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        aria-label="Close"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="space-y-4 px-6 py-5">
                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        Are you sure you want to delete <span className="font-semibold">{title}</span>?
                    </div>

                    <div className="flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={busy}
                            className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={busy}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {busy ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                            Delete Workshop
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

type ToastState = {
    id: number;
    message: string;
    tone: "success" | "error";
};

function ToastMessage({
    toast,
    onClose,
}: {
    toast: ToastState;
    onClose: () => void;
}) {
    return (
        <div className="fixed bottom-4 right-4 z-[60] w-full max-w-sm">
            <div
                className={[
                    "flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-2xl",
                    toast.tone === "error"
                        ? "border-rose-200 bg-white text-rose-700"
                        : "border-emerald-200 bg-white text-emerald-700",
                ].join(" ")}
                role="status"
                aria-live="polite"
            >
                <div
                    className={[
                        "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full",
                        toast.tone === "error" ? "bg-rose-50" : "bg-emerald-50",
                    ].join(" ")}
                >
                    <AlertTriangle size={16} />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">
                        {toast.tone === "error" ? "Action failed" : "Success"}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">{toast.message}</p>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    aria-label="Dismiss notification"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
}

export default function CoursesPage() {
    const router = useRouter();

    const [tab, setTab] = useState<CourseTabKey>("upcoming");
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [deliveryMode, setDeliveryMode] = useState<DeliveryMode | "all">("all");
    const [page, setPage] = useState(1);
    const [items, setItems] = useState<CourseItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const [counts, setCounts] = useState<Record<CourseTabKey, number>>({
        upcoming: 0,
        past: 0,
        drafts: 0,
        refund_requests: 0,
    });
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [stats, setStats] = useState<WorkshopStatsResponse | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<CourseItem | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [toast, setToast] = useState<ToastState | null>(null);

    useEffect(() => {
        const handle = window.setTimeout(() => setDebouncedQuery(query.trim()), SEARCH_DEBOUNCE_MS);
        return () => window.clearTimeout(handle);
    }, [query]);

    useEffect(() => {
        setPage(1);
    }, [tab, debouncedQuery, deliveryMode]);

    useEffect(() => {
        if (!toast) return;

        const timeout = window.setTimeout(() => {
            setToast((current) => (current?.id === toast.id ? null : current));
        }, 4000);

        return () => window.clearTimeout(timeout);
    }, [toast]);

    useEffect(() => {
        let isMounted = true;

        async function fetchTabData(
            targetTab: CourseTabKey,
            pageValue: number,
            limitValue: number,
            baseParams: Omit<ListWorkshopsParams, "page" | "limit" | "status" | "upcoming" | "past" | "hasRefundRequests">,
        ) {
            const params = buildParamsForTab(targetTab, baseParams, pageValue, limitValue);

            try {
                return await listWorkshops(params);
            } catch (error) {
                if (targetTab !== "drafts") {
                    console.warn(`Falling back to published-only params for ${targetTab} tab`, error);
                    return listWorkshops(buildFallbackPublishedParams(baseParams, pageValue, limitValue));
                }
                throw error;
            }
        }

        async function load() {
            setLoading(true);
            try {
                const baseParams = {
                    q: debouncedQuery || undefined,
                    deliveryMode: deliveryMode === "all" ? undefined : deliveryMode,
                    sortBy: "createdAt" as const,
                    sortOrder: "desc" as const,
                };

                const [upcomingCountResponse, pastCountResponse, draftCountResponse, refundCountResponse, activeResponse, statsResponse] = await Promise.all([
                    fetchTabData("upcoming", 1, 1, baseParams),
                    fetchTabData("past", 1, 1, baseParams),
                    fetchTabData("drafts", 1, 1, baseParams),
                    fetchTabData("refund_requests", 1, 1, baseParams),
                    fetchTabData(tab, page, PAGE_SIZE, baseParams),
                    getWorkshopStats().catch((error) => {
                        console.error("Failed to load workshop stats:", error);
                        return null;
                    }),
                ]);

                if (!isMounted) return;

                setCounts({
                    upcoming: upcomingCountResponse.meta.total,
                    past: pastCountResponse.meta.total,
                    drafts: draftCountResponse.meta.total,
                    refund_requests: refundCountResponse.meta.total,
                });
                setItems(activeResponse.data.map((item) => mapWorkshopToCourseItem(item, tab)));
                setTotalItems(activeResponse.meta.total);
                setTotalPages(Math.max(1, activeResponse.meta.totalPages));
                setStats(statsResponse);

                if (page > Math.max(1, activeResponse.meta.totalPages)) {
                    setPage(Math.max(1, activeResponse.meta.totalPages));
                }
            } catch (error) {
                console.error("Failed to load workshops:", error);
                if (!isMounted) return;
                setItems([]);
                setCounts({ upcoming: 0, past: 0, drafts: 0, refund_requests: 0 });
                setTotalItems(0);
                setTotalPages(1);
                setStats(null);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        void load();
        return () => {
            isMounted = false;
        };
    }, [tab, page, debouncedQuery, deliveryMode, refreshKey]);


    const nextWorkshopValue = stats?.data.nextWorkshop?.label ?? "—";
    const nextWorkshopDate = stats?.data.nextWorkshop?.targetDate ?? "—";
    const openSeats = stats?.data.activeSeats?.open ?? 0;
    const filledSeats = stats?.data.activeSeats?.filled ?? 0;
    const refundPending = stats?.data.refundRequests?.pendingReview ?? 0;

    function buildRowQuery(id: string) {
        const course = items.find((item) => item.id === id);
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
            await updateWorkshopStatus(id, next ? "published" : "draft");
            showToast(`Course ${next ? "published" : "moved to draft"} successfully.`, "success");
            setRefreshKey((value) => value + 1);
        } catch (error) {
            console.error("Failed to update workshop status:", error);
            showToast(getErrorMessage(error, "Failed to update course status."), "error");
        }
    }

    function showToast(message: string, tone: ToastState["tone"] = "error") {
        setToast({
            id: Date.now(),
            message,
            tone,
        });
    }

    function getErrorMessage(error: any, fallback: string) {
        const responseMessage = error?.response?.data?.message;
        if (Array.isArray(responseMessage)) {
            return responseMessage[0] ?? fallback;
        }
        if (typeof responseMessage === "string" && responseMessage.trim()) {
            return responseMessage;
        }
        if (typeof error?.message === "string" && error.message.trim()) {
            return error.message;
        }
        return fallback;
    }

    async function handleDeleteConfirm() {
        if (!deleteTarget) return;

        setDeleteLoading(true);
        try {
            await deleteWorkshop(deleteTarget.id);
            setDeleteTarget(null);
            if (items.length === 1 && page > 1) {
                setPage((current) => Math.max(1, current - 1));
            } else {
                setRefreshKey((value) => value + 1);
            }
        } catch (error) {
            console.error("Failed to delete workshop:", error);
            setDeleteTarget(null);
            showToast(
                getErrorMessage(
                    error,
                    "Failed to delete workshop. Please try again.",
                ),
                "error",
            );
        } finally {
            setDeleteLoading(false);
        }
    }

    return (
        <>
            <div className="space-y-5">
                <CoursesHeader
                    onSchedule={() => router.push("/dashboard/admin/courses/create")}
                />

                <CourseStatsRow
                    nextWorkshopValue={nextWorkshopValue}
                    nextWorkshopDate={nextWorkshopDate}
                    openSeats={openSeats}
                    filledSeats={filledSeats}
                    refundRequests={refundPending}
                />

                <div className="rounded-2xl border border-slate-200 bg-white">
                    <div className="px-5 pt-5">
                        <CoursesTabs tab={tab} onChange={setTab} counts={counts} />
                    </div>

                    <CoursesTable
                        items={loading ? [] : items}
                        loading={loading}
                        query={query}
                        onQueryChange={setQuery}
                        selectedDeliveryMode={deliveryMode}
                        onDeliveryModeChange={setDeliveryMode}
                        onToggleActive={handleToggleActive}
                        onView={(id) => router.push(`/dashboard/admin/courses/${encodeURIComponent(id)}${buildRowQuery(id)}`)}
                        onEdit={(id) => router.push(`/dashboard/admin/courses/create?id=${encodeURIComponent(id)}`)}
                        onDelete={(id) => setDeleteTarget(items.find((item) => item.id === id) ?? null)}
                        page={page}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        pageSize={PAGE_SIZE}
                        onPageChange={setPage}
                    />
                </div>
            </div>

            {deleteTarget ? (
                <DeleteConfirmationDialog
                    title={deleteTarget.title}
                    busy={deleteLoading}
                    onClose={() => {
                        if (!deleteLoading) setDeleteTarget(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                />
            ) : null}

            {toast ? (
                <ToastMessage toast={toast} onClose={() => setToast(null)} />
            ) : null}
        </>
    );
}
