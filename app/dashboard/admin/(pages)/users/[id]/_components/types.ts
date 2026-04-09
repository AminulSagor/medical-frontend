export type UserRole = "Student" | "Instructor" | "Admin";

export type UserDetails = {
    id: string;
    name: string;
    role: UserRole;
    subtitle: string;
    credential: string;
    email: string;
    phone: string;
    npi: string;
    joined: string;

    stats: {
        rating: { value: string; sub: string };
        coursesTaught: { value: string; sub: string };
        activeStudents: { value: string; sub: string };
        studentSuccess: { value: string; sub: string };
    };

    notes: {
        title: string;
        body: string;
        updatedAt: string;
    };

    teaching: {
        activeCourses: Array<{
            id: string;
            label: string;
            code: string;
            title: string;
            date: string;
            location: string;
            statusLabel: string;
            statusValue: string;
            studentsText: string;
            statusTone: "in_progress" | "upcoming";
        }>;
        history: Array<{
            id: string;
            workshopName: string;
            dateCompleted: string;
            enrollment: string;
            rating: number;
            revenue: string;
        }>;
    };
};

export type StudentDetails = {
    id: string;
    name: string;
    role: "Student";
    credential: string;
    email: string;
    phone: string;
    joined: string;

    stats: {
        progress: { value: string; sub: string };
        totalSpent: { value: string; sub?: string };
        credits: { value: string; sub: string };
        attendance: { value: string; sub?: string };
    };

    profileMeta: {
        location: string;
    };

    courses: Array<{
        id: string;
        badgeTop: string;
        title: string;
        desc: string;
        status: "in_progress" | "completed";
        tags: string[];
    }>;

    purchases: Array<{
        id: string;
        date: string;
        item: string;
        total: string;
        status: "paid" | "refunded";
    }>;
};

export type View =
    | { kind: "student"; data: StudentDetails }
    | { kind: "instructor"; data: UserDetails };