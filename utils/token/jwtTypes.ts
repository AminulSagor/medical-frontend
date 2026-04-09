type UserRole = "admin" | "user";

export type JwtPayload = {
  sub?: string;              
  role?: UserRole;           
  medicalEmail?: string;     
  exp?: number;              
};