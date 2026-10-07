import type { Dispatch, SetStateAction } from "react";
import AccountStatusButton from "@/components/modules/account-status/account-status-button";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSuspenseGetAllDoctors } from "@/hooks/doctor.hook";
import type { DoctorParams } from "@/types";

interface Props extends DoctorParams {
  handleReview: Dispatch<SetStateAction<string>>;
}

export default function DoctorApprovalTable({
  handleReview,
  ...params
}: Props) {
  //1 first step
  // const { data, isPending } = useGetAllDoctors();
  //      console.log("doctor_data",data);

  const { data } = useSuspenseGetAllDoctors(params);

  const doctors = data?.data || [];

  return (
    <div className="panel">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>License No.: </TableHead>
            <TableHead>Emaial.: </TableHead>
            <TableHead>Contact No: </TableHead>
            <TableHead>Specialization: </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7}>No doctors found.</TableCell>
            </TableRow>
          ) : null}
          {doctors.map((doctor) => (
            <TableRow key={doctor.id}>
              <TableCell>{doctor.name}</TableCell>
              <TableCell>{doctor.licenseNumber}</TableCell>
              <TableCell>{doctor.email}</TableCell>
              <TableCell>
                {doctor.contactNumber ? doctor.contactNumber : " "}
              </TableCell>
              <TableCell>{doctor.specialization}</TableCell>
              <TableCell>{doctor.user?.status}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant={"outline"}
                    onClick={() => handleReview(doctor.id)}
                  >
                    Review
                  </Button>
                  {doctor.user ? (
                    <AccountStatusButton
                      userId={doctor.userId}
                      status={doctor.user.status}
                    />
                  ) : null}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
