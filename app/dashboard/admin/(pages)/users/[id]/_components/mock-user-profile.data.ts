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

export const MOCK_INSTRUCTOR: Record<string, UserDetails> = {
    u1: {
        id: "u1",
        name: "Dr. Sarah Jenkins",
        role: "Instructor",
        subtitle: "Instructor Profile · Faculty Dossier",
        credential: "Anesthesiologist",
        email: "sjenkins@institute.edu",
        phone: "+1 (555) 012-3456",
        npi: "1092837465",
        joined: "Oct 12, 2023",
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
            activeCourses: [
                {
                    id: "c1",
                    label: "CLINICAL LAB",
                    code: "ID: AR-2026-ADV",
                    title: "Advanced Airway Management",
                    date: "March 12, 2026",
                    location: "Simulation Suite B",
                    statusLabel: "CLASS STATUS",
                    statusValue: "In Progress",
                    studentsText: "24 / 24 Students",
                    statusTone: "in_progress",
                },
                {
                    id: "c2",
                    label: "SPECIALIZED",
                    code: "ID: PED-2026-SIM",
                    title: "Pediatric Simulation Lab",
                    date: "April 05, 2026",
                    location: "Main Auditorium",
                    statusLabel: "CLASS STATUS",
                    statusValue: "Upcoming",
                    studentsText: "18 / 20 Students",
                    statusTone: "upcoming",
                },
            ],
            history: [
                {
                    id: "h1",
                    workshopName: "Difficult Airway Management",
                    dateCompleted: "Oct 24, 2025",
                    enrollment: "25/25",
                    rating: 5,
                    revenue: "$12,450",
                },
            ],
        },
    },
};

export const MOCK_STUDENT: Record<string, StudentDetails> = {
    u2: {
        id: "u2",
        name: "Marcus Thome",
        role: "Student",
        credential: "CRNA Student",
        email: "mthome@institute.edu",
        phone: "+1 (555) 012-3456",
        joined: "Nov 01, 2023",
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
                id: "s1",
                badgeTop: "ADVANCED MODULE",
                title: "Advanced Airway Management",
                desc:
                    "Comprehensive training in difficult airway algorithms, video laryngoscopy, and cricothyrotomy.",
                status: "in_progress",
                tags: ["IN-PERSON LABS", "Joined: Oct 20, 2025", "Booking: 1 Person"],
            },
            {
                id: "s2",
                badgeTop: "CORE SKILL",
                title: "Ultrasound Basics",
                desc:
                    "Introduction to point-of-care ultrasound (POCUS), knobology, and basic image acquisition techniques.",
                status: "completed",
                tags: ["ONLINE WEBINAR", "Joined: Nov 05, 2025", "Booking: 8 Persons"],
            },
        ],
        purchases: [
            { date: "Oct 24, 2026", item: "Adult Airway Algorithm Card", id: "#TX-985421", total: "$14.99", status: "paid" },
            { date: "Oct 20, 2026", item: "Advanced Airway Management", id: "#TX-98402", total: "$450.00", status: "paid" },
            { date: "Sep 12, 2026", item: "Difficult Airway Simulation Kit", id: "#TX-923831", total: "$125.00", status: "refunded" },
            { date: "Aug 05, 2026", item: "Ultrasound Basics Workshop", id: "#TX-871802", total: "$120.00", status: "paid" },
            { date: "Jul 22, 2026", item: "POCUS Guidebook (Digital)", id: "#TX-765221", total: "$29.99", status: "paid" },
            { date: "Oct 24, 2026", item: "Adult Airway Algorithm Card", id: "#TX-98421", total: "$14.99", status: "paid" },
            { date: "Oct 20, 2026", item: "Advanced Airway Management", id: "#TX-98402", total: "$450.00", status: "paid" },
            { date: "Sep 12, 2026", item: "Difficult Airway Simulation Kit", id: "#TX-92331", total: "$125.00", status: "refunded" },
            { date: "Aug 05, 2026", item: "Ultrasound Basics Workshop", id: "#TX-87102", total: "$120.00", status: "paid" },
            { date: "Jul 22, 2026", item: "POCUS Guidebook (Digital)", id: "#TX-76221", total: "$29.99", status: "paid" },
            { date: "Jun 18, 2026", item: "Airway Pocket Checklist", id: "#TX-70011", total: "$9.99", status: "paid" },
            { date: "May 10, 2026", item: "Airway Skills Workbook", id: "#TX-65510", total: "$19.99", status: "paid" },
            { date: "Apr 22, 2026", item: "Emergency Airway Flashcards", id: "#TX-61244", total: "$15.99", status: "paid" },
            { date: "Mar 15, 2026", item: "Airway Equipment Guide", id: "#TX-59881", total: "$39.99", status: "paid" },
            { date: "Feb 28, 2026", item: "Difficult Airway Case Library", id: "#TX-57220", total: "$89.00", status: "paid" },
            { date: "Jan 12, 2026", item: "Clinical Simulation Toolkit", id: "#TX-54002", total: "$210.00", status: "paid" },
            { date: "Dec 03, 2025", item: "POCUS Masterclass Bundle", id: "#TX-50011", total: "$320.00", status: "refunded" },
            { date: "Nov 21, 2025", item: "Advanced Laryngoscopy Module", id: "#TX-47210", total: "$149.99", status: "paid" },
            { date: "Oct 10, 2025", item: "Airway Emergency Scenarios", id: "#TX-44129", total: "$59.99", status: "paid" },
            { date: "Sep 01, 2025", item: "Cricothyrotomy Practical Guide", id: "#TX-40212", total: "$24.99", status: "paid" },
            { date: "Aug 14, 2025", item: "Airway Assessment Handbook", id: "#TX-36601", total: "$34.99", status: "paid" },
            { date: "Jul 05, 2025", item: "Ultrasound Fundamentals PDF", id: "#TX-33190", total: "$19.00", status: "paid" },
        ],
    },
};