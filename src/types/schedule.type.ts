export type ScheduleStatus = "DRAFT" | "PUBLISHED";

export interface Schedule {
  id: string;
  startDateTime: string;
  endDateTime: string;
  totalSlots: number;
  availableSlots: number;
  meetingLink: string;
  status: ScheduleStatus;
  doctorId: string;
  appointments?: {
    id: string;
    status: string;
    serialNumber: number | null;
  }[];
  doctor?: {
    id: string;
    name: string;
    specialization: string;
    consultationFee?: number | string | null;
  };
}

export interface OpenSlot {
  scheduleId: string;
  serialNumber: number;
  startDateTime: string;
  endDateTime: string;
}

export interface ScheduleListParams {
  page?: number;
  limit?: number;
  status?: ScheduleStatus;
  doctorId?: string;
}

export interface CreateSchedulePayload {
  startDateTime: string;
  endDateTime: string;
  meetingLink: string;
}

export interface UpdateSchedulePayload {
  startDateTime?: string;
  endDateTime?: string;
  meetingLink?: string;
}
