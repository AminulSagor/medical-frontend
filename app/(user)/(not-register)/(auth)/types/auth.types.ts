// app/(auth)/types/auth.types.ts
export type AuthSignupPayload = {
  fullName: string;
  email: string;
  role: string;
  password: string;
  acceptedTerms: boolean;
};

export type AuthErrors = Partial<Record<keyof AuthSignupPayload, string>>;
