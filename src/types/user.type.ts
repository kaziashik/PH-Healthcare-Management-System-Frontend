export type UserRole = "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "PATIENT";

export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";

export interface PatientAccount {
  contactNumber: string | null;
  address: string | null;
  gender: "MALE" | "FEMALE" | "OTHER" | null;
  dateOfBirth: string | null;
  bloodGroup: string | null;
  medicalHistory: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  googleId: null | string;
  authProvider: string;
  emailVerified: boolean;
  role: UserRole;
  status: UserStatus;
  needPasswordChange: boolean;
  hasPassword: boolean;
  imageUrl: null | string;
  imagePublicId: null | string;
  isDeleted: boolean;
  deletedAt: null | string;
  createdAt: string;
  updatedAt: string;
  patient?: PatientAccount | null;
}

export interface CreateManagedAccountPayload {
  name: string;
  organizationEmail: string;
  personalEmail: string;
  contactNumber?: string;
  address?: string;
}

export interface UpdateAccountStatusPayload {
  userId: string;
  status: "ACTIVE" | "BLOCKED";
}

export interface AccountListParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: "ACTIVE" | "BLOCKED";
  sortOrder?: "asc" | "desc";
}

export interface AccountRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  createdAt: string;
  patient: {
    contactNumber: string | null;
    address: string | null;
  } | null;
  admin: {
    organizationEmail: string;
    personalEmail: string;
    contactNumber: string | null;
    address: string | null;
  } | null;
}
