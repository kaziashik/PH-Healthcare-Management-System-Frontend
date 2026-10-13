import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types/api.type";
import type {
  CreateSchedulePayload,
  OpenSlot,
  Schedule,
  ScheduleListParams,
  UpdateSchedulePayload,
} from "@/types/schedule.type";

export function getMySchedules(params: ScheduleListParams) {
  return apiClient<ApiResponse<Schedule[]>>("/schedule/my-schedules", {
    params,
  });
}

export function getTodaysSchedules(params: ScheduleListParams) {
  return apiClient<ApiResponse<Schedule[]>>("/schedule/todays-schedule", {
    params,
  });
}

export function getDoctorOpenSlots(doctorId: string) {
  return apiClient<ApiResponse<OpenSlot[]>>(
    `/schedule/open-slots/${doctorId}`,
  );
}

export function getFutureSchedules(params: ScheduleListParams) {
  return apiClient<ApiResponse<Schedule[]>>("/schedule/future-schedules", {
    params,
  });
}

export function createSchedule(payload: CreateSchedulePayload) {
  return apiClient<ApiResponse<Schedule>>("/schedule/create-schedule", {
    method: "POST",
    body: payload,
  });
}

export function updateSchedule(
  scheduleId: string,
  payload: UpdateSchedulePayload,
) {
  return apiClient<ApiResponse<Schedule>>(
    `/schedule/update-schedule/${scheduleId}`,
    { method: "PATCH", body: payload },
  );
}

export function publishSchedule(scheduleId: string) {
  return apiClient<ApiResponse<Schedule>>(
    `/schedule/publish-schedule/${scheduleId}`,
    { method: "PATCH" },
  );
}

export function deleteSchedule(scheduleId: string) {
  return apiClient<ApiResponse<Schedule>>(`/schedule/${scheduleId}`, {
    method: "DELETE",
  });
}
