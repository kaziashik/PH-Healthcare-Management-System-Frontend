import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  bookAppointment,
  cancelAppointment,
  createPrescription,
  getDoctorAppointments,
  getMyAppointments,
  getMyPayments,
  getPaymentSummary,
  payAppointment,
  updateAppointmentStatus,
} from "@/api/appointment.api";
import type {
  AppointmentListParams,
  AppointmentStatus,
  CreatePrescriptionPayload,
  PaymentListParams,
} from "@/types/appointment.type";

export function useGetDoctorAppointments(params: AppointmentListParams) {
  return useQuery({
    queryKey: ["doctor-appointments", params],
    queryFn: () => getDoctorAppointments(params),
  });
}

export function useGetMyAppointments(
  params: AppointmentListParams,
  enabled = true,
) {
  return useQuery({
    queryKey: ["patient-appointments", params],
    queryFn: () => getMyAppointments(params),
    enabled,
  });
}

export function useGetPaymentSummary() {
  return useQuery({
    queryKey: ["payment-summary"],
    queryFn: getPaymentSummary,
  });
}

export function useGetMyPayments(params: PaymentListParams) {
  return useQuery({
    queryKey: ["my-payments", params],
    queryFn: () => getMyPayments(params),
  });
}

function useRefreshVisits() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
    queryClient.invalidateQueries({ queryKey: ["patient-appointments"] });
    queryClient.invalidateQueries({ queryKey: ["my-payments"] });
    queryClient.invalidateQueries({ queryKey: ["todays-schedules"] });
    queryClient.invalidateQueries({ queryKey: ["future-schedules"] });
  };
}

export function useUpdateAppointmentStatus() {
  const refresh = useRefreshVisits();
  return useMutation({
    mutationFn: ({
      appointmentId,
      status,
    }: {
      appointmentId: string;
      status: Extract<AppointmentStatus, "ONGOING" | "COMPLETED">;
    }) => updateAppointmentStatus(appointmentId, status),
    onSuccess: refresh,
  });
}

export function useBookAppointment() {
  return useMutation({ mutationFn: bookAppointment });
}

export function usePayAppointment() {
  return useMutation({ mutationFn: payAppointment });
}

export function useCancelAppointment() {
  const refresh = useRefreshVisits();
  return useMutation({ mutationFn: cancelAppointment, onSuccess: refresh });
}

export function useCreatePrescription() {
  const refresh = useRefreshVisits();
  return useMutation({
    mutationFn: (payload: CreatePrescriptionPayload) =>
      createPrescription(payload),
    onSuccess: refresh,
  });
}
