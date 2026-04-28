"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import type { UserRow } from "../_components/users-table";
import type { UserTabKey } from "../_components/users-tabs";
import type { StatCard } from "../_components/users-stats-row";
import type { FilterState, SortOption } from "../_components/users-toolbar";
import type { MasterUsersDirectoryResponse } from "@/types/admin/users.types";
import {
    buildUserRowQuery,
    formatJoinedDate,
    mapApiRoleToUiRole,
} from "../_utils/users-directory.utils";

type UseUsersDirectoryViewModelParams = {
    tab: UserTabKey;
    filters: FilterState;
    sort: SortOption | undefined;
    directoryData: MasterUsersDirectoryResponse | null;
};

export function useUsersDirectoryViewModel({
    tab,
    filters,
    sort,
    directoryData,
}: UseUsersDirectoryViewModelParams) {
    const router = useRouter();

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
    const safePage = Math.min(meta?.page ?? 1, Math.max(totalPages, 1));

    const headerConfig = useMemo(() => {
        if (tab === "all") {
            return {
                title: "Master User Directory",
                subtitle:
                    "Manage and organize faculty, students, and staff across the institute.",
            };
        }

        if (tab === "students") {
            return {
                title: "Student Directory",
                subtitle:
                    "View enrollment metrics and financial performance for all students.",
            };
        }

        return {
            title: "Faculty Directory",
            subtitle: "Manage academic staff and clinical instructors.",
            actionLabel: "Add Faculty Member",
            onAction: () =>
                router.push("/dashboard/admin/users/faculty/register-faculty"),
        };
    }, [tab, router]);

    const statsCards = useMemo<StatCard[]>(() => {
        const stats = directoryData?.statistics;

        if (tab === "all") {
            return [
                {
                    title: "TOTAL COMMUNITY",
                    value: String(stats?.totalCommunity ?? 0),
                    subtitle: "Total registered users",
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
                    value: String(stats?.growthPulse ?? 0),
                    subtitle: "Community growth",
                    icon: "trend",
                },
                {
                    title: "ENGAGEMENT RATE",
                    value: stats?.engagementRate ?? "0%",
                    subtitle: "Avg. platform activity",
                    icon: "percent",
                },
            ];
        }

        if (tab === "students") {
            return [
                {
                    title: "TOTAL STUDENTS",
                    value: String(stats?.roleDistribution?.students ?? 0),
                    subtitle: "Registered students",
                    icon: "users",
                },
                {
                    title: "ACTIVE ENROLLMENTS",
                    value: String(stats?.activeEnrollments ?? 0),
                    subtitle: "Currently active",
                    icon: "grad",
                },
                {
                    title: "GROWTH PULSE",
                    value: String(stats?.studentGrowthPulse ?? 0),
                    subtitle: "Student growth trend",
                    icon: "trend",
                },
                {
                    title: "ENGAGEMENT RATE",
                    value: stats?.studentEngagementRate ?? "0%",
                    subtitle: "Student engagement",
                    icon: "percent",
                },
            ];
        }

        return [
            {
                title: "TOTAL FACULTY",
                value: String(stats?.roleDistribution?.instructors ?? 0),
                subtitle: "Full & part-time",
                badge: "+2 new",
                icon: "users",
            },
            {
                title: "ACTIVE INSTRUCTORS",
                value: String(stats?.activeInstructors ?? 0),
                subtitle: "Assigned to courses",
                icon: "grad",
            },
            {
                title: "INSTRUCTOR GROWTH PULSE",
                value: String(stats?.instructorGrowthPulse ?? 0),
                subtitle: "Instructor growth trend",
                icon: "trend",
            },
            {
                title: "TOTAL COURSES TAUGHT",
                value: String(stats?.instructorTotalWorkshopTaught ?? 0),
                subtitle: "Completed sessions",
                icon: "book",
            },
        ];
    }, [tab, directoryData]);

    const handleView = (id: string) => {
        const row = items.find((item) => item.id === id);
        if (!row) return;

        router.push(
            `/dashboard/admin/users/${encodeURIComponent(id)}${buildUserRowQuery(row)}`
        );
    };

    const handleEdit = (id: string) => {
        const row = items.find((item) => item.id === id);
        if (!row) return;

        router.push(
            `/dashboard/admin/users/${encodeURIComponent(id)}${buildUserRowQuery(row)}`
        );
    };

    return {
        items,
        safePage,
        totalItems,
        totalPages,
        headerConfig,
        statsCards,
        handleView,
        handleEdit,
    };
}