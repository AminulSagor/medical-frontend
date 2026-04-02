// app/(auth)/types/auth.types.ts
export type AuthSignupPayload = {
  fullLegalName: string;
  medicalEmail: string;
  professionalRole: string;
  password: string;
  acceptedTerms: boolean;
};

export type AuthErrors = Partial<Record<keyof AuthSignupPayload, string>>;
