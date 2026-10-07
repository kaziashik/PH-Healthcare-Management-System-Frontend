import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types";
import type { ContactMessagePayload } from "@/types/contact.type";

export function sendContactMessage(payload: ContactMessagePayload) {
  return apiClient<ApiResponse<{ accepted: boolean }>>("/contact", {
    method: "POST",
    body: payload,
  });
}
