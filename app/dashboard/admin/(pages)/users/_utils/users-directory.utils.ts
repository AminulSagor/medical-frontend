import type { UserRow } from "../_components/users-table";
import type { UserTabKey } from "../_components/users-tabs";
import type { AdminDirectoryApiRole } from "@/types/admin/users.types";

export const PAGE_SIZE = 4;

export function formatJoinedDate(dateString: string) {
    if (!dateString) return "-";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
}

export function mapApiRoleToUiRole(
    role: AdminDirectoryApiRole
): UserRow["role"] | "User" {
    if (role === "student") return "Student";
    if (role === "instructor") return "Instructor";
    if (role === "admin") return "Admin";
    return "User";
}

export function mapTabToApiRole(
    tab: UserTabKey
): AdminDirectoryApiRole | undefined {
    if (tab === "instructors") return "instructor";
    return undefined;
}

export function buildUserRowQuery(row: UserRow) {
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
}