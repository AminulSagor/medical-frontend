"use client";

import { useEffect, useMemo, useState } from "react";
import CoursesHeader from "./_components/courses-header";
import CourseStatsRow from "./_components/course-stats-row";
import CoursesTabs from "./_components/courses-tabs";
import CoursesTable from "./_components/courses-table";
import type { CourseItem, CourseTabKey } from "./_components/courses.types";
import { useRouter } from "next/navigation";

const PAGE_SIZE = 4;

const MOCK: CourseItem[] = [
    { id: "c1", dateLabel: "Mar 12, 2026", timeLabel: "01:00 PM - 04:00 PM", title: "Advanced Airway Management", tags: ["Workshop"], instructorName: "Dr. Sarah Chen", instructorAvatarUrl: "/photos/image.png", capacityUsed: 18, capacityTotal: 20, refundRequests: 0, isActive: true, status: "upcoming", deliveryMode: "in_person" },
    { id: "c2", dateLabel: "Mar 15, 2026", timeLabel: "01:00 PM - 05:00 PM", title: "Pediatric Intubation Workshop", tags: ["Workshop", "Advanced"], instructorName: "Dr. Mark Davis", instructorAvatarUrl: "/photos/image.png", capacityUsed: 12, capacityTotal: 24, refundRequests: 2, isActive: true, status: "upcoming", deliveryMode: "online" },
    { id: "c3", dateLabel: "Mar 20, 2026", timeLabel: "01:00 PM - 04:00 PM", title: "Emergency Airway Crisis", tags: ["Case", "Core"], instructorName: "Dr. Elena Rodriguez", instructorAvatarUrl: "/photos/image.png", capacityUsed: 25, capacityTotal: 25, refundRequests: 0, isActive: true, status: "upcoming", deliveryMode: "in_person" },
    { id: "c4", dateLabel: "Apr 02, 2026", timeLabel: "02:00 PM - 04:00 PM", title: "Fiberoptic Intubation Skills", tags: ["Workshop"], instructorName: "Dr. Alan Grant", instructorAvatarUrl: "/photos/image.png", capacityUsed: 6, capacityTotal: 20, refundRequests: 0, isActive: false, status: "drafts", deliveryMode: "in_person" },
    { id: "c5", dateLabel: "Feb 02, 2026", timeLabel: "03:00 PM - 06:00 PM", title: "Airway Basics Bootcamp", tags: ["Core"], instructorName: "Dr. Farah", instructorAvatarUrl: "/photos/image.png", capacityUsed: 20, capacityTotal: 20, refundRequests: 1, isActive: false, status: "past", deliveryMode: "in_person" },
    { id: "c6", dateLabel: "Apr 08, 2026", timeLabel: "10:00 AM - 01:00 PM", title: "Airway Pharmacology Essentials", tags: ["Core"], instructorName: "Dr. Nadia Rahman", instructorAvatarUrl: "/photos/image.png", capacityUsed: 9, capacityTotal: 20, refundRequests: 0, isActive: true, status: "upcoming", deliveryMode: "in_person" },
    { id: "c7", dateLabel: "Apr 12, 2026", timeLabel: "02:00 PM - 05:00 PM", title: "Difficult Airway Algorithms", tags: ["Workshop"], instructorName: "Dr. Omar Hasan", instructorAvatarUrl: "/photos/image.png", capacityUsed: 16, capacityTotal: 20, refundRequests: 1, isActive: true, status: "upcoming", deliveryMode: "in_person" },
    { id: "c8", dateLabel: "Apr 18, 2026", timeLabel: "09:00 AM - 12:00 PM", title: "Supraglottic Airway Devices Lab", tags: ["Workshop"], instructorName: "Dr. Anika Chowdhury", instructorAvatarUrl: "/photos/image.png", capacityUsed: 20, capacityTotal: 20, refundRequests: 0, isActive: true, status: "upcoming", deliveryMode: "in_person" },
    { id: "c9", dateLabel: "Apr 22, 2026", timeLabel: "01:00 PM - 04:00 PM", title: "Trauma Airway & Rapid Sequence", tags: ["Advanced"], instructorName: "Dr. Hasan Mahmud", instructorAvatarUrl: "/photos/image.png", capacityUsed: 10, capacityTotal: 24, refundRequests: 2, isActive: true, status: "upcoming", deliveryMode: "in_person" },
    { id: "c10", dateLabel: "May 02, 2026", timeLabel: "11:00 AM - 02:00 PM", title: "Airway Ultrasound Basics", tags: ["Core"], instructorName: "Dr. Farah", instructorAvatarUrl: "/photos/image.png", capacityUsed: 5, capacityTotal: 20, refundRequests: 0, isActive: false, status: "drafts", deliveryMode: "in_person" },
    { id: "c11", dateLabel: "Jan 18, 2026", timeLabel: "03:00 PM - 06:00 PM", title: "Mask Ventilation Mastery", tags: ["Core"], instructorName: "Dr. Sarah Chen", instructorAvatarUrl: "/photos/image.png", capacityUsed: 20, capacityTotal: 20, refundRequests: 0, isActive: false, status: "past", deliveryMode: "in_person" },
    { id: "c12", dateLabel: "Jan 25, 2026", timeLabel: "01:00 PM - 04:00 PM", title: "Airway Rescue Techniques", tags: ["Case"], instructorName: "Dr. Mark Davis", instructorAvatarUrl: "/photos/image.png", capacityUsed: 18, capacityTotal: 25, refundRequests: 1, isActive: false, status: "past", deliveryMode: "in_person" },
    { id: "c13", dateLabel: "May 10, 2026", timeLabel: "09:00 AM - 12:00 PM", title: "Advanced Laryngoscopy Techniques", tags: ["Workshop"], instructorName: "Dr. Omar Hasan", instructorAvatarUrl: "/photos/image.png", capacityUsed: 14, capacityTotal: 20, refundRequests: 0, isActive: true, status: "upcoming", deliveryMode: "in_person" },
    { id: "c14", dateLabel: "May 15, 2026", timeLabel: "01:00 PM - 04:00 PM", title: "Airway Complication Management", tags: ["Advanced"], instructorName: "Dr. Sarah Chen", instructorAvatarUrl: "/photos/image.png", capacityUsed: 22, capacityTotal: 25, refundRequests: 1, isActive: true, status: "upcoming", deliveryMode: "in_person" },
    { id: "c15", dateLabel: "May 20, 2026", timeLabel: "02:00 PM - 05:00 PM", title: "Pediatric Emergency Airway", tags: ["Core"], instructorName: "Dr. Anika Chowdhury", instructorAvatarUrl: "/photos/image.png", capacityUsed: 25, capacityTotal: 25, refundRequests: 0, isActive: true, status: "upcoming", deliveryMode: "in_person" },
    { id: "c16", dateLabel: "Jun 01, 2026", timeLabel: "10:00 AM - 01:00 PM", title: "Airway Simulation Lab", tags: ["Workshop"], instructorName: "Dr. Mark Davis", instructorAvatarUrl: "/photos/image.png", capacityUsed: 8, capacityTotal: 20, refundRequests: 0, isActive: true, status: "upcoming", deliveryMode: "in_person" },
    { id: "c17", dateLabel: "Jun 05, 2026", timeLabel: "03:00 PM - 06:00 PM", title: "Difficult Airway Case Review", tags: ["Case"], instructorName: "Dr. Elena Rodriguez", instructorAvatarUrl: "/photos/image.png", capacityUsed: 12, capacityTotal: 24, refundRequests: 2, isActive: true, status: "upcoming", deliveryMode: "in_person" },
    { id: "c18", dateLabel: "Jun 12, 2026", timeLabel: "11:00 AM - 02:00 PM", title: "Airway Ultrasound Advanced", tags: ["Advanced"], instructorName: "Dr. Farah", instructorAvatarUrl: "/photos/image.png", capacityUsed: 19, capacityTotal: 20, refundRequests: 0, isActive: true, status: "upcoming", deliveryMode: "in_person" },
    { id: "c19", dateLabel: "Jun 18, 2026", timeLabel: "09:00 AM - 12:00 PM", title: "Crisis Resource Management", tags: ["Core"], instructorName: "Dr. Nadia Rahman", instructorAvatarUrl: "/photos/image.png", capacityUsed: 6, capacityTotal: 20, refundRequests: 0, isActive: false, status: "drafts", deliveryMode: "in_person" },
    { id: "c20", dateLabel: "Jan 05, 2026", timeLabel: "01:00 PM - 04:00 PM", title: "Airway Anatomy Refresher", tags: ["Core"], instructorName: "Dr. Hasan Mahmud", instructorAvatarUrl: "/photos/image.png", capacityUsed: 20, capacityTotal: 20, refundRequests: 0, isActive: false, status: "past", deliveryMode: "in_person" },
    { id: "c21", dateLabel: "Jan 12, 2026", timeLabel: "02:00 PM - 05:00 PM", title: "Rapid Sequence Induction", tags: ["Advanced"], instructorName: "Dr. Alan Grant", instructorAvatarUrl: "/photos/image.png", capacityUsed: 23, capacityTotal: 25, refundRequests: 1, isActive: false, status: "past", deliveryMode: "in_person" },
    { id: "c22", dateLabel: "Jun 25, 2026", timeLabel: "10:00 AM - 01:00 PM", title: "Fiberoptic Masterclass", tags: ["Workshop"], instructorName: "Dr. Sarah Chen", instructorAvatarUrl: "/photos/image.png", capacityUsed: 4, capacityTotal: 20, refundRequests: 0, isActive: true, status: "upcoming", deliveryMode: "in_person" },
    { id: "c23", dateLabel: "Jul 02, 2026", timeLabel: "01:00 PM - 04:00 PM", title: "Airway Rescue Scenarios", tags: ["Case"], instructorName: "Dr. Omar Hasan", instructorAvatarUrl: "/photos/image.png", capacityUsed: 11, capacityTotal: 20, refundRequests: 1, isActive: true, status: "upcoming", deliveryMode: "in_person" },
    { id: "c24", dateLabel: "Jul 08, 2026", timeLabel: "09:00 AM - 12:00 PM", title: "Ventilation Strategy Workshop", tags: ["Workshop"], instructorName: "Dr. Farah", instructorAvatarUrl: "/photos/image.png", capacityUsed: 7, capacityTotal: 20, refundRequests: 0, isActive: true, status: "upcoming", deliveryMode: "in_person" },
    { id: "c25", dateLabel: "Jul 15, 2026", timeLabel: "02:00 PM - 05:00 PM", title: "Comprehensive Airway Review", tags: ["Core"], instructorName: "Dr. Mark Davis", instructorAvatarUrl: "/photos/image.png", capacityUsed: 18, capacityTotal: 20, refundRequests: 0, isActive: true, status: "upcoming", deliveryMode: "in_person" },
    { id: "c26", dateLabel: "Jul 22, 2026", timeLabel: "10:00 AM - 01:00 PM", title: "Advanced Airway Decision Making", tags: ["Advanced"], instructorName: "Dr. Nadia Rahman", instructorAvatarUrl: "/photos/image.png", capacityUsed: 15, capacityTotal: 20, refundRequests: 0, isActive: true, status: "upcoming", deliveryMode: "in_person" },
    { id: "c27", dateLabel: "Jul 28, 2026", timeLabel: "02:00 PM - 05:00 PM", title: "Airway Emergencies Simulation", tags: ["Workshop"], instructorName: "Dr. Elena Rodriguez", instructorAvatarUrl: "/photos/image.png", capacityUsed: 20, capacityTotal: 25, refundRequests: 1, isActive: true, status: "upcoming", deliveryMode: "in_person" },
    { id: "c28", dateLabel: "Aug 02, 2026", timeLabel: "09:00 AM - 12:00 PM", title: "Airway Pharmacology Advanced", tags: ["Core"], instructorName: "Dr. Hasan Mahmud", instructorAvatarUrl: "/photos/image.png", capacityUsed: 7, capacityTotal: 20, refundRequests: 0, isActive: true, status: "upcoming", deliveryMode: "in_person" },
    { id: "c29", dateLabel: "Aug 10, 2026", timeLabel: "01:00 PM - 04:00 PM", title: "Trauma Airway Deep Dive", tags: ["Advanced"], instructorName: "Dr. Sarah Chen", instructorAvatarUrl: "/photos/image.png", capacityUsed: 23, capacityTotal: 25, refundRequests: 2, isActive: true, status: "upcoming", deliveryMode: "in_person" },
    { id: "c30", dateLabel: "Aug 18, 2026", timeLabel: "03:00 PM - 06:00 PM", title: "Airway Anatomy Masterclass", tags: ["Core"], instructorName: "Dr. Mark Davis", instructorAvatarUrl: "/photos/image.png", capacityUsed: 10, capacityTotal: 20, refundRequests: 0, isActive: true, status: "upcoming", deliveryMode: "in_person" },
    { id: "c31", dateLabel: "Feb 12, 2026", timeLabel: "02:00 PM - 05:00 PM", title: "Postoperative Airway Complications", tags: ["Case"], instructorName: "Dr. Omar Hasan", instructorAvatarUrl: "/photos/image.png", capacityUsed: 20, capacityTotal: 20, refundRequests: 0, isActive: false, status: "past", deliveryMode: "in_person" },
    { id: "c32", dateLabel: "Feb 18, 2026", timeLabel: "09:00 AM - 12:00 PM", title: "Advanced Mask Ventilation", tags: ["Workshop"], instructorName: "Dr. Anika Chowdhury", instructorAvatarUrl: "/photos/image.png", capacityUsed: 18, capacityTotal: 20, refundRequests: 1, isActive: false, status: "past", deliveryMode: "in_person" },
    { id: "c33", dateLabel: "Aug 25, 2026", timeLabel: "10:00 AM - 01:00 PM", title: "Airway Ultrasound Practical", tags: ["Workshop"], instructorName: "Dr. Farah", instructorAvatarUrl: "/photos/image.png", capacityUsed: 5, capacityTotal: 20, refundRequests: 0, isActive: true, status: "upcoming", deliveryMode: "in_person" },
    { id: "c34", dateLabel: "Sep 02, 2026", timeLabel: "01:00 PM - 04:00 PM", title: "Airway Crisis Algorithms", tags: ["Advanced"], instructorName: "Dr. Alan Grant", instructorAvatarUrl: "/photos/image.png", capacityUsed: 17, capacityTotal: 20, refundRequests: 0, isActive: true, status: "upcoming", deliveryMode: "in_person" },
    { id: "c35", dateLabel: "Sep 10, 2026", timeLabel: "02:00 PM - 05:00 PM", title: "Comprehensive Airway Review II", tags: ["Core"], instructorName: "Dr. Sarah Chen", instructorAvatarUrl: "/photos/image.png", capacityUsed: 9, capacityTotal: 20, refundRequests: 0, isActive: true, status: "upcoming", deliveryMode: "in_person" },
];

export default function CoursesPage() {
    const router = useRouter();

    const [tab, setTab] = useState<CourseTabKey>("upcoming");
    const [query, setQuery] = useState("");
    const [onlyRefunds, setOnlyRefunds] = useState(false);
    const [page, setPage] = useState(1);
    const [all, setAll] = useState<CourseItem[]>(MOCK);

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
                tab === "refund_requests" ? c.refundRequests > 0 : c.status === tab
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
            0
        );

    const refundPending = all.reduce(
        (sum, c) => sum + (c.refundRequests ?? 0),
        0
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
                onSchedule={() => router.push("/courses/create")}
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
                            prev.map((c) => (c.id === id ? { ...c, isActive: next } : c))
                        );
                    }}
                    onView={(id) =>
                        router.push(`/courses/${encodeURIComponent(id)}${buildRowQuery(id)}`)
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