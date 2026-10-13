import type { Schedule } from "./schedule.type";

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "BOOKED"
  | "CANCELLED"
  | "ONGOING"
  | "COMPLETED";

export type PaymentStatus =
  | "UNPAID"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export interface AppointmentPayment {
  id: string;
  status: PaymentStatus;
  amount: number | string;
  currency: string;
  paidAt: string | null;
  refundAmount: number | string | null;
  refundedAt: string | null;
}

export interface Appointment {
  id: string;
  status: AppointmentStatus;
  serialNumber: number | null;
  joiningTime: string | null;
  prescriptionUrl: string | null;
  createdAt: string;
  patient?: {
    id: string;
    name: string;
    email?: string;
    contactNumber?: string | null;
  };
  doctor?: {
    id: string;
    name: string;
    specialization: string;
    user?: { imageUrl?: string | null } | null;
  };
  schedule: Pick<
    Schedule,
    "id" | "startDateTime" | "endDateTime" | "meetingLink"
  >;
  payment: AppointmentPayment | null;
}

export interface AppointmentListParams {
  page?: number;
  limit?: number;
  status?: AppointmentStatus;
}

export interface MedicineInput {
  name: string;
  dosage: string;
  duration: string;
  instructions?: string;
}

export interface CreatePrescriptionPayload {
  appointmentId: string;
  findings: string;
  medicines: MedicineInput[];
}

export interface PaymentRecord {
  id: string;
  status: PaymentStatus;
  amount: number | string;
  currency: string;
  paidAt: string | null;
  refundAmount: number | string | null;
  refundReason: string | null;
  refundedAt: string | null;
  createdAt: string;
  appointment: {
    id: string;
    status: AppointmentStatus;
    doctor?: {
      id: string;
      name: string;
      specialization: string;
    };
    schedule?: Pick<Schedule, "startDateTime" | "endDateTime">;
  };
}

export interface PaymentListParams {
  page?: number;
  limit?: number;
}
