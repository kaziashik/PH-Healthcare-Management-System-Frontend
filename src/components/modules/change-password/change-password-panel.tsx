"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import ChangePasswordForm from "@/components/form/change-password-form";
import SetPasswordForm from "@/components/form/set-password-form";
import { useGetMe } from "@/hooks/auth.hook";

export default function ChangePasswordPanel() {
  const router = useRouter();
  const { data } = useGetMe();
  const user = data?.data;
  const needsSetPassword = user?.role === "PATIENT" && !user.hasPassword;

  if (needsSetPassword) {
    return (
      <div className="flex w-full max-w-sm flex-col gap-5">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Set a password</h1>
          <p className="text-balance text-sm text-muted-foreground">
            This account does not have a password yet.
          </p>
        </div>
        <SetPasswordForm onDone={() => router.push("/patient/profile")} />
        <div className="text-center text-sm text-muted-foreground">
          <Link
            href="/patient/profile"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            Back to profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <ChangePasswordForm />
    </div>
  );
}
