// types/account-settings/security-password-type.ts
export type SecurityPasswordDraft = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type SecurityPasswordPayload = {
  currentPassword: string;
  newPassword: string;
};