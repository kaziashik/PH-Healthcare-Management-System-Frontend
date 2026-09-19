
import AuthGuard from "@/components/auth/auth-auard";
import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return  <AuthGuard> {children}</AuthGuard>;
}
