import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types/api.type";
import type {
  AccountListParams,
  AccountRecord,
  CreateManagedAccountPayload,
  UpdateAccountStatusPayload,
  User,
} from "@/types/user.type";

export function getPatients(params: AccountListParams) {
  return apiClient<ApiResponse<AccountRecord[]>>("/user/patients", { params });
}

export function getAdmins(params: AccountListParams) {
  return apiClient<ApiResponse<AccountRecord[]>>("/user/admins", { params });
}

export function createAdmin(payload: CreateManagedAccountPayload) {
  return apiClient<ApiResponse<AccountRecord>>("/user/create-admin", {
    method: "POST",
    body: payload,
  });
}

export function createSuperAdmin(payload: CreateManagedAccountPayload) {
  return apiClient<ApiResponse<AccountRecord>>("/user/create-super-admin", {
    method: "POST",
    body: payload,
  });
}

export function updateMyProfile(payload: {
  name: string;
  contactNumber: string;
}) {
  return apiClient<ApiResponse<User>>("/user/my-profile", {
    method: "PATCH",
    body: payload,
  });
}

export function updateProfileImage(file: File) {
  const formData = new FormData();
  formData.append("profileImage", file);
  return apiClient<ApiResponse<User>>("/user/profile-image", {
    method: "PATCH",
    body: formData,
  });
}

export function updateAccountStatus(payload: UpdateAccountStatusPayload) {
  return apiClient<ApiResponse<AccountRecord>>("/user/account-status", {
    method: "PATCH",
    body: payload,
  });
}
