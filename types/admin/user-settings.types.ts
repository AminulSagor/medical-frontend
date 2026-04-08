/**
 * Admin Profile Email Settings Types
 */

export interface UpdateEmailRequest {
  newEmail: string;
}

export interface AdminUserProfile {
  id: string;
  fullLegalName: string;
  medicalEmail: string;
  professionalRole: string;
  profilePhotoUrl: string | null;
  password: string;
  isVerified: boolean;
  role: string;
  status: string;
  credentials: string | null;
  coursesCount: number;
  lastActiveAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateEmailResponse extends AdminUserProfile {}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdatePasswordResponse extends AdminUserProfile {}
