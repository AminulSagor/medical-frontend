"use client";

import { useEffect, useMemo, useState } from "react";
import UsersHeader from "./_components/users-header";
import UsersTable, { UserRow } from "./_components/users-table";
import UsersTabs, { UserTabKey } from "./_components/users-tabs";
import UsersStatsRow, { type StatCard } from "./_components/users-stats-row";
import UsersToolbar from "./_components/users-toolbar";
import { useRouter } from "next/navigation";


const PAGE_SIZE = 4;

const MOCK: UserRow[] = [
    { id: "u1", name: "Dr. Sarah Jenkins", email: "sjenkins@institute.edu", role: "Instructor", credential: "Anesthesiologist", status: "active", courses: 5, joined: "Oct 12, 2023" },
    { id: "u2", name: "Marcus Thome", email: "mthome@institute.edu", role: "Student", credential: "CRNA Student", status: "active", courses: 2, joined: "Nov 01, 2023" },
    { id: "u3", name: "Elena Rodriguez", email: "erodriguez@institute.edu", role: "Admin", credential: "System Lead", status: "active", courses: 0, joined: "Jan 15, 2023" },
    { id: "u4", name: "James Wilson", email: "jwilson@institute.edu", role: "Student", credential: "Resident", status: "inactive", courses: 1, joined: "Feb 20, 2023" },
    { id: "u5", name: "Olivia Martinez", email: "omartinez@institute.edu", role: "Student", credential: "MS4", status: "active", courses: 3, joined: "Mar 02, 2023" },
    { id: "u6", name: "Noah Thomas", email: "nthomas@institute.edu", role: "Instructor", credential: "ENT", status: "active", courses: 7, joined: "Apr 21, 2023" },
    { id: "u7", name: "Mia Johnson", email: "mjohnson@institute.edu", role: "Student", credential: "Nursing", status: "inactive", courses: 0, joined: "May 11, 2023" },
    { id: "u8", name: "Ethan Lee", email: "elee@institute.edu", role: "Instructor", credential: "Critical Care", status: "active", courses: 4, joined: "Jun 18, 2023" },
    { id: "u9", name: "Sophia Brown", email: "sbrown@institute.edu", role: "Student", credential: "Paramedic", status: "active", courses: 4, joined: "Jul 10, 2023" },
    { id: "u10", name: "Liam Walker", email: "lwalker@institute.edu", role: "Instructor", credential: "Emergency Medicine", status: "active", courses: 6, joined: "Aug 01, 2023" },
    { id: "u11", name: "Ava Garcia", email: "agarcia@institute.edu", role: "Student", credential: "RN", status: "inactive", courses: 1, joined: "Aug 18, 2023" },
    { id: "u12", name: "Benjamin Clark", email: "bclark@institute.edu", role: "Instructor", credential: "Anesthesia", status: "active", courses: 8, joined: "Sep 05, 2023" },
    { id: "u13", name: "Isabella Turner", email: "iturner@institute.edu", role: "Student", credential: "MS3", status: "active", courses: 2, joined: "Sep 21, 2023" },
    { id: "u14", name: "Lucas White", email: "lwhite@institute.edu", role: "Admin", credential: "Coordinator", status: "active", courses: 0, joined: "Oct 02, 2023" },
    { id: "u15", name: "Charlotte Hill", email: "chill@institute.edu", role: "Student", credential: "CRNA", status: "inactive", courses: 1, joined: "Oct 11, 2023" },
    { id: "u16", name: "Henry Adams", email: "hadams@institute.edu", role: "Instructor", credential: "Trauma", status: "active", courses: 5, joined: "Oct 30, 2023" },
    { id: "u17", name: "Amelia Scott", email: "ascott@institute.edu", role: "Student", credential: "Nursing", status: "active", courses: 3, joined: "Nov 08, 2023" },
    { id: "u18", name: "Jack Green", email: "jgreen@institute.edu", role: "Instructor", credential: "ICU", status: "active", courses: 7, joined: "Nov 22, 2023" },
    { id: "u19", name: "Harper Evans", email: "hevans@institute.edu", role: "Student", credential: "Resident", status: "inactive", courses: 0, joined: "Dec 01, 2023" },
    { id: "u20", name: "Daniel Brooks", email: "dbrooks@institute.edu", role: "Admin", credential: "Operations", status: "active", courses: 0, joined: "Dec 12, 2023" },
    { id: "u21", name: "Jack Green", email: "jgreen@institute.edu", role: "Instructor", credential: "ICU", status: "active", courses: 7, joined: "Nov 22, 2023" },
    { id: "u22", name: "Harper Evans", email: "hevans@institute.edu", role: "Student", credential: "Resident", status: "inactive", courses: 0, joined: "Dec 01, 2023" },
    { id: "u23", name: "Daniel Brooks", email: "dbrooks@institute.edu", role: "Admin", credential: "Operations", status: "active", courses: 0, joined: "Dec 12, 2023" },
    { id: "u24", name: "Jack Green", email: "jgreen@institute.edu", role: "Instructor", credential: "ICU", status: "active", courses: 7, joined: "Nov 22, 2023" },
    { id: "u25", name: "Harper Evans", email: "hevans@institute.edu", role: "Student", credential: "Resident", status: "inactive", courses: 0, joined: "Dec 01, 2023" },
    { id: "u26", name: "Daniel Brooks", email: "dbrooks@institute.edu", role: "Admin", credential: "Operations", status: "active", courses: 0, joined: "Dec 12, 2023" },
];

export default function UsersPage() {
    const router = useRouter();

    const buildRowQuery = (id: string) => {
        const u = MOCK.find((x) => x.id === id);
        if (!u) return "";

        const q = new URLSearchParams({
            name: u.name,
            email: u.email,
            role: u.role,
            credential: u.credential,
            status: u.status,
            courses: String(u.courses),
            joined: u.joined,
        });

        return `?${q.toString()}`;
    };

    const [tab, setTab] = useState<UserTabKey>("all");
    const [filters, setFilters] = useState<import("./_components/users-toolbar").FilterState>({});
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState<import("./_components/users-toolbar").SortOption | undefined>(undefined);
    const counts = useMemo(() => {
        const all = MOCK.length;
        const students = MOCK.filter((u) => u.role === "Student").length;
        const instructors = MOCK.filter((u) => u.role === "Instructor").length;
        return { all, students, instructors };
    }, [MOCK]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();

        let list = MOCK.filter((u) => {
            const inTab =
                tab === "all" ? true : tab === "students" ? u.role === "Student" : u.role === "Instructor";

            const inSearch =
                !q ||
                u.name.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q) ||
                u.credential.toLowerCase().includes(q);

            return inTab && inSearch;
        });

        // ✅ filters
        if (filters.status) {
            list = list.filter((u) => u.status === filters.status);
        }

        if (filters.courses) {
            const n = Number(filters.courses);
            if (!Number.isNaN(n)) list = list.filter((u) => u.courses === n);
        }

        // ✅ sort only for students tab
        if (tab === "students" && sort) {
            list = [...list].sort((a, b) => {
                const left = a.name.toLowerCase();
                const right = b.name.toLowerCase();
                return sort === "asc" ? left.localeCompare(right) : right.localeCompare(left);
            });
        }

        return list;
    }, [tab, query, sort, filters]);

    useEffect(() => setPage(1), [tab, query, sort, filters]);

    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);

    const headerConfig = useMemo(() => {
        return tab === "all"
            ? {
                title: "Master User Directory",
                subtitle:
                    "Manage and organize faculty, students, and staff across the institute.",
            }
            : tab === "students"
                ? {
                    title: "Student Directory",
                    subtitle:
                        "View enrollment metrics and financial performance for all students.",
                }
                : {
                    title: "Faculty Directory",
                    subtitle: "Manage academic staff and clinical instructors.",
                    actionLabel: "Add Faculty Member",
                    onAction: () => router.push("/users/faculty/register-faculty"),
                };
    }, [tab]);

    const statsCards = useMemo<StatCard[]>(() => {
        return tab === "all"
            ? [
                { title: "TOTAL COMMUNITY", value: counts.all.toLocaleString(), subtitle: "vs last month", badge: "+8%", icon: "users" },
                { title: "ACTIVE STUDENTS", value: counts.students.toLocaleString(), subtitle: "Currently enrolled", icon: "grad" },
                { title: "GROWTH PULSE", value: "+42", subtitle: "New users this week", icon: "trend" },
                { title: "ENGAGEMENT RATE", value: "76%", subtitle: "Avg. platform activity", icon: "percent" },
            ]
            : tab === "students"
                ? [
                    { title: "TOTAL STUDENTS", value: counts.students.toLocaleString(), subtitle: "vs last month", badge: "+12", icon: "users" },
                    { title: "ACTIVE ENROLLMENTS", value: "1,842", subtitle: "Currently active", icon: "grad" },
                    { title: "GROWTH PULSE", value: "+14%", subtitle: "New student conversion", icon: "trend" },
                    { title: "ENGAGEMENT RATE", value: "82.4%", subtitle: "Course completion rate", icon: "percent" },
                ]
                : [
                    { title: "TOTAL FACULTY", value: counts.instructors.toLocaleString(), subtitle: "Full & part-time", badge: "+2 new", icon: "users" },
                    { title: "ACTIVE INSTRUCTORS", value: "10", subtitle: "Assigned to courses", icon: "grad" },
                    { title: "AVG. FACULTY RATING", value: "4.9/5.0", subtitle: "Student feedback average", icon: "star" },
                    { title: "TOTAL COURSES TAUGHT", value: "24", subtitle: "Completed sessions", icon: "book" },
                ];
    }, [tab, counts]);

    const items = useMemo(() => {
        const start = (safePage - 1) * PAGE_SIZE;
        return filtered.slice(start, start + PAGE_SIZE);
    }, [filtered, safePage]);


    return (
        <div className="space-y-5">
            <UsersHeader
                title={headerConfig.title}
                subtitle={headerConfig.subtitle}
                actionLabel={("actionLabel" in headerConfig && headerConfig.actionLabel) || undefined}
                onAction={("onAction" in headerConfig && headerConfig.onAction) || undefined}
            />

            <UsersStatsRow cards={statsCards} />

            {/* Tabs wrapper */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                <UsersTabs tab={tab} onChange={setTab} counts={counts} />
            </div>

            <UsersToolbar
                tab={tab}
                query={query}
                onQueryChange={setQuery}
                filters={filters}
                onFiltersChange={setFilters}
                sort={sort}
                onSortChange={(v) => setSort(v)}
            />

            <div className="rounded-2xl border border-slate-200 bg-white">
                <UsersTable
                    items={items}
                    tab={tab}
                    page={safePage}
                    pageSize={PAGE_SIZE}
                    totalItems={totalItems}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    onView={(id) =>
                        router.push(`/users/${encodeURIComponent(id)}${buildRowQuery(id)}`)
                    }
                    onEdit={(id) =>
                        router.push(`/users/${encodeURIComponent(id)}/edit${buildRowQuery(id)}`)
                    }
                />
            </div>
        </div>
    );
}
