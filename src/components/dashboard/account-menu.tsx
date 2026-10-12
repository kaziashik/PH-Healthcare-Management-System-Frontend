"use client";

import { useQueryClient } from "@tanstack/react-query";
import AccountPill from "@/components/layout/account-pill";
import ThemeToggle from "@/components/theme/theme-toggle";
import { toast } from "@/components/ui/toast";
import { useGetMe, useLogout } from "@/hooks/auth.hook";

const barButton =
  "border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white";

export default function AccountMenu() {
  const { data } = useGetMe();
  const { mutate: logout } = useLogout();
  const queryClient = useQueryClient();
  const user = data?.data;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.add({
          title: "Signed out",
          description: "You have left your account.",
          type: "success",
        });
        queryClient.removeQueries({ queryKey: ["user"] });
        window.location.assign("/");
      },
      onError: () => {
        toast.add({
          title: "Logout failed",
          description: "Something went wrong.",
          type: "error",
        });
      },
    });
  };

  return (
    <div className="ml-auto flex items-center gap-2">
      <ThemeToggle className={barButton} />
      {user ? (
        <AccountPill
          name={user.name}
          email={user.email}
          role={user.role}
          onLogout={handleLogout}
        />
      ) : null}
    </div>
  );
}
