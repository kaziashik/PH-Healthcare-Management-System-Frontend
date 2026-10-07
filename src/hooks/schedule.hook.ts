import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSchedule,
  deleteSchedule,
  getMySchedules,
  getTodaysSchedules,
  publishSchedule,
  updateSchedule,
} from "@/api/schedule.api";
import type {
  ScheduleListParams,
  UpdateSchedulePayload,
} from "@/types/schedule.type";

export function useGetMySchedules(params: ScheduleListParams) {
  return useQuery({
    queryKey: ["schedules", params],
    queryFn: () => getMySchedules(params),
  });
}

export function useGetTodaysSchedules(params: ScheduleListParams) {
  return useQuery({
    queryKey: ["todays-schedules", params],
    queryFn: () => getTodaysSchedules(params),
  });
}

function useRefreshSchedules() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["schedules"] });
    queryClient.invalidateQueries({ queryKey: ["todays-schedules"] });
  };
}

export function useCreateSchedule() {
  const refresh = useRefreshSchedules();
  return useMutation({ mutationFn: createSchedule, onSuccess: refresh });
}

export function useUpdateSchedule() {
  const refresh = useRefreshSchedules();
  return useMutation({
    mutationFn: ({
      scheduleId,
      payload,
    }: {
      scheduleId: string;
      payload: UpdateSchedulePayload;
    }) => updateSchedule(scheduleId, payload),
    onSuccess: refresh,
  });
}

export function usePublishSchedule() {
  const refresh = useRefreshSchedules();
  return useMutation({ mutationFn: publishSchedule, onSuccess: refresh });
}

export function useDeleteSchedule() {
  const refresh = useRefreshSchedules();
  return useMutation({ mutationFn: deleteSchedule, onSuccess: refresh });
}
