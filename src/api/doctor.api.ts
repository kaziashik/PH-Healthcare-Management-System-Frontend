import apiClient from "@/lib/apiClient";
import {
  ApiResponse,
  ApproveDoctorPayload,
  Doctor,
  DoctorApplicationPayload,
  DoctorParams,
  VerifyAccountPayload,
} from "@/types";

export function applyAsDoctor(payload: DoctorApplicationPayload) {
  const formData = new FormData();

  formData.append("data", JSON.stringify(payload.data));
  formData.append("resume", payload.resume);

  for (const file of payload.additionalFiles) {
    formData.append("additionalFiles", file);
  }

  return apiClient("/doctor/apply-as-doctor", {
    method: "POST",
    body: formData,
  });
}

export function verifyDoctorAccount(payload: VerifyAccountPayload) {
  return apiClient("/doctor/apply-as-doctor/verify-email", {
    method: "POST",
    body: payload,
  });
}


 //1 first step  chek the data befor insiali the data in ui
 
//  export function getAllDoctors() {
//   return apiClient("/doctor/all-doctors")
// }


export function getAllDoctors(params:DoctorParams) {
  return apiClient <ApiResponse<Doctor[]>>("/doctor/all-doctors",{
    params,
  })
}







export function approveDoctor(payload: ApproveDoctorPayload) {
  return apiClient("/doctor/approve-doctor", {
    method: "POST",
    body: payload,
  });
}
