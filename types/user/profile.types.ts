export interface UserProfileApiData {
    profilePicture: string | null;
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string | null;
    title: string | null;
    role: string | null;
    institutionOrHospital: string | null;
    npiNumber: string | null;
}

export interface GetUserProfileResponse {
    message: string;
    data: UserProfileApiData;
}

export interface UpdateUserProfilePayload {
    profilePicture: string | null;
    firstName: string;
    lastName: string;
    phoneNumber: string | null;
    title: string | null;
    role: string | null;
    institutionOrHospital: string | null;
    npiNumber: string | null;
}

export interface UpdateUserProfileResponse {
    message: string;
    data: UserProfileApiData;
}