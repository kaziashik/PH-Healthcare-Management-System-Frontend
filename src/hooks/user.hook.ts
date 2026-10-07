import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAdmin,
  createSuperAdmin,
  getAdmins,
  getPatients,
  updateAccountStatus,
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

export function useUpdateAccountStatus() {
  const refreshAccounts = useRefreshAccounts();

  return useMutation({
    mutationFn: updateAccountStatus,
    onSuccess: refreshAccounts,
  });
}
