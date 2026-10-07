import type { User } from "@/types/user.type";

function dashboardPath(user: User) {
  if (user.role === "PATIENT") {
    return "/patient";
  }

  if (user.role === "DOCTOR") {
    return "/doctor";
  }

  if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
    return "/admin";
  }

  return "/";
}

export function pathAfterLogin(user: User) {
  if (user.needPasswordChange) {
    return "/change-password";
  }

  if (user.role === "PATIENT" && !user.hasPassword) {
    return "/patient/profile";
  }

  return dashboardPath(user);
}

export function pathAfterPasswordChange(user: User) {
  if (user.role === "PATIENT" && !user.hasPassword) {
    return "/patient/profile";
  }

  return dashboardPath(user);
}
