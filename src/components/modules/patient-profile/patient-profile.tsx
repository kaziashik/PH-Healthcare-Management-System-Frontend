"use client";

import Link from "next/link";
import SetPasswordForm from "@/components/form/set-password-form";
import { useGetMe } from "@/hooks/auth.hook";

export default function PatientProfile() {
  const { data, isPending } = useGetMe();
  const user = data?.data;

  if (isPending || !user) {
    return <p className="text-sm text-muted-foreground">Loading profile...</p>;
  }

  return (
    <div className="flex max-w-md flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">
          {user.name} · {user.email}
        </p>
      </div>

      {user.hasPassword ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            This account already has a password.
          </p>
          <Link
            href="/change-password"
            className="text-sm font-medium underline underline-offset-4 hover:text-primary"
          >
            Change password
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold">Set a password</h2>
            <p className="text-sm text-muted-foreground">
              This account can sign in with Google. Set a password if you also
              want to sign in with email.
            </p>
          </div>
          <SetPasswordForm />
        </div>
      )}
    </div>
  );
}
