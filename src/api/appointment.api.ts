import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types/api.type";
import type {
  Appointment,
  AppointmentListParams,
  AppointmentStatus,
  CreatePrescriptionPayload,
  PaymentListParams,
  PaymentRecord,
} from "@/types/appointment.type";

export function getDoctorAppointments(params: AppointmentListParams) {
  return apiClient<ApiResponse<Appointment[]>>(
    "/appointment/doctor-appointments",
    {
      params,
    },
  );
}

export function getMyAppointments(params: AppointmentListParams) {
  return apiClient<ApiResponse<Appointment[]>>("/appointment/my-appointments", {
    params,
  });
}

export function updateAppointmentStatus(
  appointmentId: string,
  status: Extract<AppointmentStatus, "ONGOING" | "COMPLETED">,
) {
  return apiClient<ApiResponse<Appointment>>(
    `/appointment/update-status/${appointmentId}`,
    { method: "PATCH", body: { status } },
  );
}

export function bookAppointment(payload: { scheduleId: string }) {
  return apiClient<ApiResponse<{ paymentUrl: string }>>(
    "/appointment/book-appointment",
    { method: "POST", body: payload },
  );
}

export function cancelAppointment(payload: { appointmentId: string }) {
  return apiClient<ApiResponse<unknown>>("/appointment/cancel-appointment", {
    method: "POST",
    body: payload,
  });
}

export function createPrescription(payload: CreatePrescriptionPayload) {
  return apiClient<ApiResponse<Appointment>>(
    "/prescription/create-prescription",
    {
      method: "POST",
      body: payload,
    },
  );
}

export function getMyPayments(params: PaymentListParams) {
  return apiClient<ApiResponse<PaymentRecord[]>>("/payment/my-payments", {
    params,
  });
}
