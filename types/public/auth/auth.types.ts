// ── Register ──

export type RegisterRequest = {
  fullLegalName: string;
  medicalEmail: string;
  professionalRole: string;
  password: string;
  forgetPassword: boolean;
};

export type RegisteredUser = {
  id: string;
  fullLegalName: string;
  medicalEmail: string;
  professionalRole: string;
  role?: string;
  createdAt?: string;
};

export type RegisterResponse = {
  message: string;
  statusCode?: number;
  data?: RegisteredUser;
  user?: RegisteredUser;
};

// ── OTP ──

export type SendOtpRequest = {
  email: string;
};

export type SendOtpResponse = {
  message: string;
  statusCode?: number;
};

export type VerifyOtpRequest = {
  email: string;
  otp: string;
};

export type VerifyOtpResponse = {
  message: string;
  statusCode?: number;
};

// ── Login ──

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginUser = {
  id: string;
  fullLegalName: string;
  medicalEmail: string;
  professionalRole: string;
  role?: string;
};

export type LoginResponse = {
  accessToken: string;
  user: LoginUser;
};

// ── Reset Password ──

export type ResetPasswordRequest = {
  email: string;
  password: string;
  forgetPassword: boolean;
};

export type ResetPasswordResponse = {
  message: string;
  statusCode?: number;
};
