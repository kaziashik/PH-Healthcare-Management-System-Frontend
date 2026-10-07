import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DoctorReviewSheet from "./doctor-review-sheet";
import { useGetAllDoctors, useSuspenseGetAllDoctors } from "@/hooks/doctor.hook";
import { DoctorParams } from "@/types";
import { Dispatch, SetStateAction, useState } from "react";

interface Props extends DoctorParams {
  handleReview: Dispatch<SetStateAction<string>>;
}

export default function DoctorApprovalTable({handleReview, ...params}: Props) {



  //1 first step
  // const { data, isPending } = useGetAllDoctors();
  //      console.log("doctor_data",data);


  const { data } = useSuspenseGetAllDoctors({verificationStatus: "PENDING"});

  const doctors = data?.data || [];

  console.log("doctor_data", doctors);
  




  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead >License No.: </TableHead>
            <TableHead >Emaial.: </TableHead>
            <TableHead >Contact No: </TableHead>
            <TableHead >Specialization: </TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.map((doctor) => (
            <TableRow key={doctor.id}>
            <TableCell>{doctor.name}</TableCell>
            <TableCell>{doctor.licenseNumber}</TableCell>
            <TableCell>{doctor.email}</TableCell>
            <TableCell>{doctor.contactNumber ? doctor.contactNumber : " "}</TableCell>
            <TableCell>{doctor.specialization}</TableCell>
            <TableCell className="text-right">
              <Button variant={"outline"} onClick={()=>handleReview(doctor.id)}>Review</Button>
              {/* <DoctorReviewSheet /> */}
            </TableCell>
          </TableRow>))}
        </TableBody>
      </Table>
    </div>
  );
}
