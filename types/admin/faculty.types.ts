export type AssignedRole = "instructor" | "faculty" | "admin";

export interface RegisterFacultyRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  imageUrl: string;
  primaryClinicalRole: string;
  medicalDesignation: string;
  institutionOrHospital: string;
  npiNumber: string;
  assignedRole: AssignedRole;
}

export interface Faculty {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  imageUrl: string;
  primaryClinicalRole: string;
  medicalDesignation: string;
  institutionOrHospital: string;
  npiNumber: string;
  assignedRole: AssignedRole;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterFacultyResponse {
  message: string;
  data: Faculty;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SearchFacultyResponse {
  message: string;
  meta: PaginationMeta;
  data: Faculty[];
}
