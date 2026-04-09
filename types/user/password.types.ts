export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}

export interface ChangePasswordResponseData {
    id: string;
    medicalEmail: string;
}

export interface ChangePasswordResponse {
    message: string;
    data: ChangePasswordResponseData;
}

export interface ChangePasswordErrorResponse {
    statusCode: number;
    path: string;
    message: string;
}