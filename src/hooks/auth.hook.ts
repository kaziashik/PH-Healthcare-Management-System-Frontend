import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  changePassword,
  facebookOAuth,
  forgotPassword,
  getMe,
  googleOAuth,
  resetPassword,
  setPassword,
  userLogin,
  userLogout,
  userRegistration,
  verifyAccount,
} from "@/api/auth.api";
import { pathAfterLogin } from "@/lib/auth-redirect";

export function useLogin() {
  return useMutation({
    mutationFn: userLogin,
  });
}

export function useVerifyAccount() {
  return useMutation({
    mutationFn: verifyAccount,
  });
}

export function useRegistration() {
  return useMutation({
    mutationFn: userRegistration,
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: userLogout,
  });
}

export function useGoogleOAuth() {
  return useMutation({
    mutationFn: googleOAuth,
  });
}

export function useFacebookOAuth() {
  return useMutation({
    mutationFn: facebookOAuth,
  });
}

export function useGetMe() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    retry: false,
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  });
}

export function useSetPassword() {
  return useMutation({
    mutationFn: setPassword,
  });
}

export function useContinueAfterAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return async () => {
    const me = await queryClient.fetchQuery({
      queryKey: ["user"],
      queryFn: getMe,
      staleTime: 0,
    });

    router.push(pathAfterLogin(me.data));
  };
}
