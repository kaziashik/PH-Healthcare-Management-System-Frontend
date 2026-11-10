import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types";
import type { ChatResponse, SendChatMessagePayload } from "@/types/chat.type";

export function sendChatMessage(payload: SendChatMessagePayload) {
  return apiClient<ApiResponse<ChatResponse>>("/chat", {
    method: "POST",
    body: payload,
  });
}
