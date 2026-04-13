export interface SubscriberProfileResponse {
    profile: {
        id: string;
        fullName: string;
        email: string;
        phone: string | null;
        status: "ACTIVE" | "UNSUBSCRIBED" | "BOUNCED" | "SUPPRESSED" | string;
        clinicalRole: string | null;
        institution: string | null;
        acquisitionSource: string | null;
        joinedDate: string;
    };
    cards: {
        engagementRatePercent: number;
        totalReceived: number;
        courseAttendanceCount: number;
        lifetimeValue: number;
    };
    adminNotes: Array<{
        id: string;
        note: string;
        createdAt: string;
        createdByAdminId: string;
    }>;
}