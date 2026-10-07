import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types/api.type";
import type {
  AccountListParams,
  AccountRecord,
  CreateManagedAccountPayload,
  UpdateAccountStatusPayload,
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

export function updateAccountStatus(payload: UpdateAccountStatusPayload) {
  return apiClient<ApiResponse<AccountRecord>>("/user/account-status", {
    method: "PATCH",
    body: payload,
  });
}
