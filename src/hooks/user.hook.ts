import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAdmin,
  createSuperAdmin,
  getAdmins,
  getPatients,
  updateAccountStatus,
  updateMyProfile,
  updateProfileImage,
} from "@/api/user.api";
import type { AccountListParams } from "@/types/user.type";

export function useGetPatients(params: AccountListParams) {
  return useQuery({
    queryKey: ["patients", params],
    queryFn: () => getPatients(params),
  });
}

export function useGetAdmins(params: AccountListParams) {
  return useQuery({
    queryKey: ["admins", params],
    queryFn: () => getAdmins(params),
  });
}

function useRefreshAccounts() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["patients"] });
    queryClient.invalidateQueries({ queryKey: ["admins"] });
    queryClient.invalidateQueries({ queryKey: ["doctors"] });
  };
}

export function useCreateAdmin() {
  const refreshAccounts = useRefreshAccounts();

  return useMutation({
    mutationFn: createAdmin,
    onSuccess: refreshAccounts,
  });
}

export function useCreateSuperAdmin() {
  const refreshAccounts = useRefreshAccounts();

  return useMutation({
    mutationFn: createSuperAdmin,
    onSuccess: refreshAccounts,
  });
}

function useRefreshMe() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["user"] });
    queryClient.invalidateQueries({ queryKey: ["doctors"] });
  };
}

export function useUpdateMyProfile() {
  const refreshMe = useRefreshMe();

  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: refreshMe,
  });
}

export function useUpdateProfileImage() {
  const refreshMe = useRefreshMe();

  return useMutation({
    mutationFn: updateProfileImage,
    onSuccess: refreshMe,
  });
}

export function useUpdateAccountStatus() {
  const refreshAccounts = useRefreshAccounts();

  return useMutation({
    mutationFn: updateAccountStatus,
    onSuccess: refreshAccounts,
  });
}
