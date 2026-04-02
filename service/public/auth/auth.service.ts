import { serviceClient } from "@/service/base/axios_client";
import type {
  RegisterRequest,
  RegisterResponse,
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "@/types/public/auth/auth.types";

export const registerUser = async (
  data: RegisterRequest,
): Promise<RegisterResponse> => {
  const response = await serviceClient.post<RegisterResponse>(
    `/auth/register`,
    data,
  );
  return response.data;
};

export const sendOtp = async (
  data: SendOtpRequest,
): Promise<SendOtpResponse> => {
  const response = await serviceClient.post<SendOtpResponse>(
    `/auth/send-otp`,
    data,
  );
  return response.data;
};

export const verifyOtp = async (
  data: VerifyOtpRequest,
): Promise<VerifyOtpResponse> => {
  const response = await serviceClient.post<VerifyOtpResponse>(
    `/auth/verify-otp`,
    data,
  );
  return response.data;
};

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await serviceClient.post<LoginResponse>(`/auth/login`, data);
  return response.data;
};

export const resetPassword = async (
  data: ResetPasswordRequest,
): Promise<ResetPasswordResponse> => {
  const response = await serviceClient.put<ResetPasswordResponse>(
    `/auth/reset-password`,
    data,
  );
  return response.data;
};
