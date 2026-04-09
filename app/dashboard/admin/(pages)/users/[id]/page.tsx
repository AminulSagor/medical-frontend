"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { MOCK_INSTRUCTOR, MOCK_STUDENT } from "./_components/mock-user-profile.data";
import StudentProfileView from "./_components/student/student-profile-view";
import InstructorProfileView from "./_components/instructor/instructor-profile-view";
import type {
    View,
    UserRole,
    StudentDetails,
    UserDetails,
} from "./_components/types";
import { getAdminUserById } from "@/service/admin/users.service";

export default function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const params = useParams<{ id: string }>();

    const id = typeof params?.id === "string" ? params.id : "";
    const roleFromQuery = (searchParams.get("role") as UserRole | null) ?? null;

    const [view, setView] = useState<View | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fallbackView = useMemo<View | null>(() => {
        const key = decodeURIComponent(id || "");

        if (MOCK_INSTRUCTOR[key]) {
            return { kind: "instructor", data: MOCK_INSTRUCTOR[key] };
        }

        if (MOCK_STUDENT[key]) {
            return { kind: "student", data: MOCK_STUDENT[key] };
        }

        const name = searchParams.get("name") ?? "";
        const email = searchParams.get("email") ?? "";
        const credential = searchParams.get("credential") ?? "";
        const joined = searchParams.get("joined") ?? "";

        if (!name || !roleFromQuery) return null;

        if (roleFromQuery === "Student") {
            const coursesCount = Number(searchParams.get("courses") ?? "0");

            const student: StudentDetails = {
                id: key,
                name,
                role: "Student",
                credential: credential || "Student",
                email,
                phone: "+1 (555) 012-3456",
                joined: joined || "—",
                stats: {
                    progress: { value: "75%", sub: "Overall completion" },
                    totalSpent: { value: "$595.00" },
                    credits: { value: "12.0", sub: "CME" },
                    attendance: { value: "100%" },
                },
                profileMeta: {
                    location: "Houston Medical Center",
                },
                courses: [
                    {
                        id: "tmp-1",
                        badgeTop: "ENROLLED COURSES",
                        title: `Courses: ${Number.isNaN(coursesCount) ? 0 : coursesCount}`,
                        desc: "Connect API later to show real enrolled courses.",
                        status: "in_progress",
                        tags: ["UI Only", "From table query params"],
                    },
                ],
                purchases: [
                    {
                        date: "Oct 24, 2026",
                        item: "Adult Airway Algorithm Card",
                        id: "#TX-985421",
                        total: "$14.99",
                        status: "paid",
                    },
                ],
            };

            return { kind: "student", data: student };
        }

        if (roleFromQuery === "Instructor") {
            const instructor: UserDetails = {
                id: key,
                name,
                role: "Instructor",
                subtitle: "Instructor Profile · Faculty Dossier",
                credential: credential || "Instructor",
                email,
                phone: "+1 (555) 012-3456",
                npi: "1092837465",
                joined: joined || "—",
                stats: {
                    rating: { value: "4.9", sub: "/ 5.0" },
                    coursesTaught: { value: "24", sub: "Completed" },
                    activeStudents: { value: "42", sub: "Enrolled" },
                    studentSuccess: { value: "96%", sub: "Completion" },
                },
                notes: {
                    title: "INTERNAL ADMIN NOTES",
                    body:
                        "Highly recommended for complex pediatric simulations.\n\nAvailable for extra shifts during Q3 training window 2026.\nCertified for Level 4 airway equipment maintenance.",
                    updatedAt: "UPDATED FEB 14, 2026",
                },
                teaching: {
                    activeCourses: [],
                    history: [],
                },
            };

            return { kind: "instructor", data: instructor };
        }

        return null;
    }, [id, roleFromQuery, searchParams]);

    useEffect(() => {
        let ignore = false;

        const loadUser = async () => {
            try {
                setIsLoading(true);

                const response = await getAdminUserById(decodeURIComponent(id));
                const user = response.data;

                if (ignore) return;

                if (user.role === "instructor") {
                    const instructor: UserDetails = {
                        id: user.id,
                        name: user.fullName,
                        role: "Instructor",
                        subtitle: "Instructor Profile · Faculty Dossier",
                        credential:
                            user.professionalTitle ||
                            user.credentials ||
                            user.professionalRole ||
                            "Instructor",
                        email: user.email,
                        phone: user.phoneNumber || "+1 (555) 012-3456",
                        npi: user.npiNumber || "—",
                        joined: user.joinedDate || "—",
                        stats: {
                            rating: { value: "4.9", sub: "/ 5.0" },
                            coursesTaught: {
                                value: String(user.coursesCount ?? 0),
                                sub: "Completed",
                            },
                            activeStudents: { value: "42", sub: "Enrolled" },
                            studentSuccess: { value: "96%", sub: "Completion" },
                        },
                        notes: {
                            title: "INTERNAL ADMIN NOTES",
                            body:
                                "Highly recommended for complex pediatric simulations.\n\nAvailable for extra shifts during Q3 training window 2026.\nCertified for Level 4 airway equipment maintenance.",
                            updatedAt: user.updatedAt || "—",
                        },
                        teaching: {
                            activeCourses: [],
                            history: [],
                        },
                    };

                    setView({ kind: "instructor", data: instructor });
                    return;
                }

                const student: StudentDetails = {
                    id: user.id,
                    name: user.fullName,
                    role: "Student",
                    credential:
                        user.professionalTitle ||
                        user.credentials ||
                        user.professionalRole ||
                        "Student",
                    email: user.email,
                    phone: user.phoneNumber || "+1 (555) 012-3456",
                    joined: user.joinedDate || "—",
                    stats: {
                        progress: { value: "75%", sub: "Overall completion" },
                        totalSpent: { value: "$595.00" },
                        credits: { value: "12.0", sub: "CME" },
                        attendance: { value: "100%" },
                    },
                    profileMeta: {
                        location: user.institutionOrHospital || "—",
                    },
                    courses: [
                        {
                            id: "tmp-1",
                            badgeTop: "ENROLLED COURSES",
                            title: `Courses: ${user.coursesCount ?? 0}`,
                            desc: "Connect API later to show real enrolled courses.",
                            status: "in_progress",
                            tags: ["API Profile", "Temporary UI"],
                        },
                    ],
                    purchases: [
                        {
                            date: "Oct 24, 2026",
                            item: "Adult Airway Algorithm Card",
                            id: "#TX-985421",
                            total: "$14.99",
                            status: "paid",
                        },
                    ],
                };

                setView({ kind: "student", data: student });
            } catch {
                if (!ignore) {
                    setView(fallbackView);
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        };

        if (id) {
            loadUser();
        }

        return () => {
            ignore = true;
        };
    }, [id, fallbackView]);

    if (isLoading) {
        return <div className="p-6 text-sm text-slate-500">Loading...</div>;
    }

    if (!view) {
        return (
            <div className="space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                    <div className="text-sm font-semibold text-slate-900">
                        User not found
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                        No data for id: <span className="font-mono">{id}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => router.push("/dashboard/admin/users")}
                        className="mt-4 inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]"
                    >
                        Back
                    </button>
                </div>
            </div>
        );
    }

    return view.kind === "student" ? (
        <StudentProfileView data={view.data} />
    ) : (
        <InstructorProfileView data={view.data} id={decodeURIComponent(id)} />
    );
}