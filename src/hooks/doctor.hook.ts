import {
  applyAsDoctor,
  approveDoctor,
  getAllDoctors,
  verifyDoctorAccount,
} from "@/api";
import { DoctorParams } from "@/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

export function useApplyAsDoctor() {
  return useMutation({
    mutationFn: applyAsDoctor,
  });
}

export function useVerifyDoctorAccount() {
  return useMutation({
    mutationFn: verifyDoctorAccount,
  });
}





 //1 first step  chek the data befor insiali the data in ui

//  export function useGetAllDoctors() {
//   return useQuery({
//     queryKey: ["doctors"],
//     queryFn: () => getAllDoctors(),
//   });
// }





export function useGetAllDoctors(params: DoctorParams) {
  return useQuery({
    queryKey: ["doctors", params],
     queryFn: () => getAllDoctors(params),
  });
}




export function useSuspenseGetAllDoctors(params: DoctorParams) {
  return useSuspenseQuery({
    queryKey: ["doctors", params],
    queryFn: () => getAllDoctors(params),
  });
}




export function useApproveDoctor(params: DoctorParams) {
  return useMutation({
    mutationFn: approveDoctor,
  });
}
