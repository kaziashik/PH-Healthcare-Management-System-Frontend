"use client";

import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useGetMe } from "@/hooks/auth.hook";
import AuthLoading from "./auth-loading";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data, isPending, isError } = useGetMe();
  const user = data?.data;
  const mustChangePassword = Boolean(user?.needPasswordChange);
  const onChangePasswordPage = pathname === "/change-password";

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (isError || !user) {
      router.replace("/login");
      return;
    }

    if (mustChangePassword && !onChangePasswordPage) {
      router.replace("/change-password");
    }
  }, [
    isPending,
    isError,
    user,
    mustChangePassword,
    onChangePasswordPage,
    router,
  ]);

  if (isPending) {
    return <AuthLoading />;
  }

  if (isError || !user || (mustChangePassword && !onChangePasswordPage)) {
    return <AuthLoading label=" Redirecting..." />;
  }

  return <>{children}</>;
}
