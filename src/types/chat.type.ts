export interface ChatDoctor {
  id: string;
  name: string;
  specialization: string;
  consultationFee: string | null;
}

export interface ChatResponse {
  sessionId: string;
  answer: string;
  doctors: ChatDoctor[];
}

export interface SendChatMessagePayload {
  message: string;
  sessionId?: string;
}
