export type AdminDirectoryApiRole = "student" | "user" | "admin" | "instructor";
export type AdminDirectoryStatus = "active" | "inactive";

export type GetMasterUsersDirectoryParams = {
    page?: number;
    limit?: number;
    role?: AdminDirectoryApiRole;
    search?: string;
};

export type MasterUsersDirectoryStatistics = {
    totalCommunity: number;
    activeStudents: number;
    growthPulse: string;
    engagementRate: string;
    roleDistribution: {
        student: number;
        user: number;
        admin: number;
        instructor?: number;
    };
};

export type MasterUsersDirectoryUserItem = {
    id: string;
    userIdentity: {
        name: string;
        email: string;
        profilePhoto: string | null;
    };
    role: AdminDirectoryApiRole;
    credential: string;
    status: AdminDirectoryStatus;
    courses: number;
    joinedDate: string;
    lastActive: string | null;
};

export type MasterUsersDirectoryResponse = {
    statistics: MasterUsersDirectoryStatistics;
    table: {
        data: MasterUsersDirectoryUserItem[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
};

export type AdminUserProfileResponse = {
    message: string;
    data: {
        id: string;
        fullName: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        profilePhoto: string | null;
        role: AdminDirectoryApiRole;
        professionalRole: string;
        professionalTitle: string;
        credentials: string;
        institutionOrHospital: string;
        npiNumber: string;
        status: AdminDirectoryStatus;
        isVerified: boolean;
        coursesCount: number;
        joinedDate: string;
        lastActive: string | null;
        updatedAt: string;
    };
};

export type UpdateAdminUserProfileRequest = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    title: string;
    professionalRole: string;
    role: AdminDirectoryApiRole;
    status: AdminDirectoryStatus;
    institutionOrHospital: string;
    npiNumber: string;
    profilePicture: string;
};

export type UpdateAdminUserProfileResponse = {
    message: string;
    data: {
        id: string;
        fullName: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        profilePhoto: string | null;
        role: AdminDirectoryApiRole;
        professionalRole: string;
        professionalTitle: string;
        credentials: string;
        institutionOrHospital: string;
        npiNumber: string;
        status: AdminDirectoryStatus;
    };
};

export type UpdateAdminUserStatusRequest = {
    status: AdminDirectoryStatus;
};

export type UpdateAdminUserStatusResponse = {
    message: string;
    data: {
        id: string;
        fullName: string;
        email: string;
        status: AdminDirectoryStatus;
        isVerified: boolean;
    };
};