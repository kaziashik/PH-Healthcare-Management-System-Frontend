import type { User } from "@/types/user.type";

export function pathAfterLogin(user: User) {
  if (user.needPasswordChange) {
    return "/change-password";
  }

  if (user.role === "PATIENT" && !user.hasPassword) {
    return "/patient/profile";
  }

  return "/";
}

export function pathAfterPasswordChange(user: User) {
  if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
    return "/admin";
  }

  if (user.role === "PATIENT") {
    return "/patient/profile";
  }

  return "/";
}
