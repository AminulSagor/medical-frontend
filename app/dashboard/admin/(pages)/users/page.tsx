"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import UsersHeader from "./_components/users-header";
import UsersTable, { UserRow } from "./_components/users-table";
import UsersTabs, { UserTabKey } from "./_components/users-tabs";
import UsersStatsRow, { type StatCard } from "./_components/users-stats-row";
import UsersToolbar from "./_components/users-toolbar";
import { getMasterUsersDirectory } from "@/service/admin/users.service";
import type {
    AdminDirectoryApiRole,
    MasterUsersDirectoryResponse,
} from "@/types/admin/users.types";

const PAGE_SIZE = 4;

function formatJoinedDate(dateString: string) {
    if (!dateString) return "-";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
}

function mapApiRoleToUiRole(
    role: AdminDirectoryApiRole
): UserRow["role"] | "User" {
    if (role === "student") return "Student";
    if (role === "instructor") return "Instructor";
    if (role === "admin") return "Admin";
    return "User";
}

function mapTabToApiRole(tab: UserTabKey): AdminDirectoryApiRole | undefined {
    if (tab === "instructors") return "instructor";
    return undefined;
}

export default function UsersPage() {
    const router = useRouter();

    const [tab, setTab] = useState<UserTabKey>("all");
    const [filters, setFilters] =
        useState<import("./_components/users-toolbar").FilterState>({});
    const [query, setQuery] = useState("");
    const [searchText, setSearchText] = useState("");
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState<
        import("./_components/users-toolbar").SortOption | undefined
    >(undefined);

    const [isLoading, setIsLoading] = useState(false);
    const [directoryData, setDirectoryData] =
        useState<MasterUsersDirectoryResponse | null>(null);

    const [masterCounts, setMasterCounts] = useState({
        all: 0,
        students: 0,
        instructors: 0,
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchText(query.trim());
            setPage(1);
        }, 400);

        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        setPage(1);
    }, [tab]);

    useEffect(() => {
        let ignore = false;

        const loadMasterCounts = async () => {
            try {
                const response = await getMasterUsersDirectory({
                    page: 1,
                    limit: PAGE_SIZE,
                    search: searchText || undefined,
                });

                const stats = response.statistics;

                if (!ignore) {
                    setMasterCounts({
                        all: stats?.totalCommunity ?? 0,
                        students:
                            (stats?.roleDistribution?.student ?? 0) +
                            (stats?.roleDistribution?.user ?? 0),
                        instructors: stats?.roleDistribution?.instructor ?? 0,
                    });
                }
            } catch (error) {
                console.error("Failed to load master counts:", error);
            }
        };

        loadMasterCounts();

        return () => {
            ignore = true;
        };
    }, [searchText]);

    useEffect(() => {
        let ignore = false;

        const loadUsers = async () => {
            try {
                setIsLoading(true);

                if (tab === "students") {
                    const [studentResponse, userResponse] = await Promise.all([
                        getMasterUsersDirectory({
                            page: 1,
                            limit: 100,
                            role: "student",
                            search: searchText || undefined,
                        }),
                        getMasterUsersDirectory({
                            page: 1,
                            limit: 100,
                            role: "user",
                            search: searchText || undefined,
                        }),
                    ]);

                    const mergedData = [
                        ...studentResponse.table.data,
                        ...userResponse.table.data,
                    ];

                    const sortedMergedData = mergedData.sort((a, b) => {
                        const left = new Date(b.joinedDate).getTime();
                        const right = new Date(a.joinedDate).getTime();
                        return left - right;
                    });

                    const start = (page - 1) * PAGE_SIZE;
                    const paginatedMergedData = sortedMergedData.slice(
                        start,
                        start + PAGE_SIZE
                    );

                    const mergedResponse: MasterUsersDirectoryResponse = {
                        statistics: {
                            ...studentResponse.statistics,
                            roleDistribution: {
                                ...studentResponse.statistics.roleDistribution,
                                student: studentResponse.table.meta.total,
                                user: userResponse.table.meta.total,
                            },
                        },
                        table: {
                            data: paginatedMergedData,
                            meta: {
                                page,
                                limit: PAGE_SIZE,
                                total:
                                    studentResponse.table.meta.total +
                                    userResponse.table.meta.total,
                                totalPages: Math.max(
                                    1,
                                    Math.ceil(
                                        (studentResponse.table.meta.total +
                                            userResponse.table.meta.total) /
                                        PAGE_SIZE
                                    )
                                ),
                            },
                        },
                    };

                    if (!ignore) {
                        setDirectoryData(mergedResponse);
                    }

                    return;
                }

                const apiRole = mapTabToApiRole(tab);

                const response = await getMasterUsersDirectory({
                    page,
                    limit: PAGE_SIZE,
                    role: apiRole,
                    search: searchText || undefined,
                });

                if (!ignore) {
                    setDirectoryData(response);
                }
            } catch (error) {
                console.error("Failed to load users directory:", error);
                if (!ignore) {
                    setDirectoryData(null);
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        };

        loadUsers();

        return () => {
            ignore = true;
        };
    }, [tab, page, searchText]);

    const items = useMemo<UserRow[]>(() => {
        const rows =
            directoryData?.table.data.map((user) => ({
                id: user.id,
                name: user.userIdentity.name,
                email: user.userIdentity.email,
                role:
                    mapApiRoleToUiRole(user.role) === "User"
                        ? "Student"
                        : (mapApiRoleToUiRole(user.role) as UserRow["role"]),
                credential: user.credential || "-",
                status: user.status,
                courses: user.courses ?? 0,
                joined: formatJoinedDate(user.joinedDate),
                profilePhoto: user.userIdentity.profilePhoto,
            })) ?? [];

        let nextRows = [...rows];

        if (filters.status) {
            nextRows = nextRows.filter((user) => user.status === filters.status);
        }

        if (filters.courses) {
            const courseCount = Number(filters.courses);
            if (!Number.isNaN(courseCount)) {
                nextRows = nextRows.filter((user) => user.courses === courseCount);
            }
        }

        if (tab === "students" && sort) {
            nextRows.sort((a, b) => {
                const left = a.name.toLowerCase();
                const right = b.name.toLowerCase();

                return sort === "asc"
                    ? left.localeCompare(right)
                    : right.localeCompare(left);
            });
        }

        return nextRows;
    }, [directoryData, filters, sort, tab]);

    const meta = directoryData?.table.meta;
    const totalItems = meta?.total ?? 0;
    const totalPages = meta?.totalPages ?? 1;
    const safePage = Math.min(page, Math.max(totalPages, 1));

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
                    onAction: () =>
                        router.push(
                            "/dashboard/admin/users/faculty/register-faculty"
                        ),
                };
    }, [tab, router]);

    const statsCards = useMemo<StatCard[]>(() => {
        const stats = directoryData?.statistics;

        return tab === "all"
            ? [
                {
                    title: "TOTAL COMMUNITY",
                    value: String(stats?.totalCommunity ?? 0),
                    subtitle: "Total registered users",
                    icon: "users",
                },
                {
                    title: "ACTIVE STUDENTS",
                    value: String(stats?.activeStudents ?? 0),
                    subtitle: "Currently enrolled",
                    icon: "grad",
                },
                {
                    title: "GROWTH PULSE",
                    value: stats?.growthPulse ?? "0%",
                    subtitle: "Community growth",
                    icon: "trend",
                },
                {
                    title: "ENGAGEMENT RATE",
                    value: stats?.engagementRate ?? "0%",
                    subtitle: "Avg. platform activity",
                    icon: "percent",
                },
            ]
            : tab === "students"
                ? [
                    {
                        title: "TOTAL STUDENTS",
                        value: String(
                            (stats?.roleDistribution?.student ?? 0) +
                            (stats?.roleDistribution?.user ?? 0)
                        ),
                        subtitle: "Registered students",
                        icon: "users",
                    },
                    {
                        title: "ACTIVE STUDENTS",
                        value: String(stats?.activeStudents ?? 0),
                        subtitle: "Currently active",
                        icon: "grad",
                    },
                    {
                        title: "GROWTH PULSE",
                        value: stats?.growthPulse ?? "0%",
                        subtitle: "Student growth trend",
                        icon: "trend",
                    },
                    {
                        title: "ENGAGEMENT RATE",
                        value: stats?.engagementRate ?? "0%",
                        subtitle: "Student engagement",
                        icon: "percent",
                    },
                ]
                : [
                    {
                        title: "TOTAL FACULTY",
                        value: String(stats?.roleDistribution?.instructor ?? 0),
                        subtitle: "Registered instructors",
                        icon: "users",
                    },
                    {
                        title: "ACTIVE STUDENTS",
                        value: String(stats?.activeStudents ?? 0),
                        subtitle: "Platform summary",
                        icon: "grad",
                    },
                    {
                        title: "GROWTH PULSE",
                        value: stats?.growthPulse ?? "0%",
                        subtitle: "Instructor growth trend",
                        icon: "trend",
                    },
                    {
                        title: "ENGAGEMENT RATE",
                        value: stats?.engagementRate ?? "0%",
                        subtitle: "Faculty engagement",
                        icon: "percent",
                    },
                ];
    }, [tab, directoryData]);

    const buildRowQuery = (row: UserRow) => {
        const q = new URLSearchParams({
            name: row.name,
            email: row.email,
            role: row.role,
            credential: row.credential,
            status: row.status,
            courses: String(row.courses),
            joined: row.joined,
        });

        return `?${q.toString()}`;
    };

    return (
        <div className="space-y-5">
            <UsersHeader
                title={headerConfig.title}
                subtitle={headerConfig.subtitle}
                actionLabel={
                    "actionLabel" in headerConfig ? headerConfig.actionLabel : undefined
                }
                onAction={
                    "onAction" in headerConfig ? headerConfig.onAction : undefined
                }
            />

            <UsersStatsRow cards={statsCards} />

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                <UsersTabs tab={tab} onChange={setTab} counts={masterCounts} />
            </div>

            <UsersToolbar
                tab={tab}
                query={query}
                onQueryChange={setQuery}
                filters={filters}
                onFiltersChange={setFilters}
                sort={sort}
                onSortChange={(value) => setSort(value)}
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
                    onView={(id) => {
                        const row = items.find((item) => item.id === id);
                        if (!row) return;

                        router.push(`/dashboard/admin/users/${encodeURIComponent(id)}${buildRowQuery(row)}`);
                    }}
                    onEdit={(id) => {
                        const row = items.find((item) => item.id === id);
                        if (!row) return;

                        router.push(`/dashboard/admin/users/${encodeURIComponent(id)}${buildRowQuery(row)}`);
                    }}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}