import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useApproveDoctor, useGetAllDoctors } from "@/hooks/doctor.hook";

import { ApproveDoctorPayload, DoctorParams } from "@/types";
import { useState } from "react";

interface Props extends DoctorParams {
  selectedId: string;
  onClose: () => void;
}

export default function DoctorReviewSheet({
  selectedId,
  onClose,
  ...params
}: Props) {
  const [confirmRejection, setConfirmRejection] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const { data } = useGetAllDoctors(params);
  const { mutate: verify, isPending } = useApproveDoctor(params);

  const selectedDoctor = data?.data?.find((doctor) => doctor.id === selectedId);

  const handleClose = () => {
    setConfirmRejection(false);
    setRejectionReason("");
    onClose();
  };

  const handleReviewAction = (status: "APPROVED" | "REJECTED") => {
    const reviewData: ApproveDoctorPayload = {
      doctorId: selectedId,
      verificationStatus: status,
      rejectionReason: rejectionReason,
    };

    verify(reviewData, {
      onSuccess: (res) => {
        console.log("Success", res);
        handleClose();
      },
      onError: (error) => {
        console.log("Error", error);
      },
    });
  };

  if (!selectedDoctor) {
    return null;
  }

  return (
    <Sheet open={!!selectedId} onOpenChange={handleClose}>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Review and take action</SheetTitle>
          <SheetDescription>This action cannot be undone.</SheetDescription>
        </SheetHeader>
        Doctor Name: {selectedDoctor.name}
        <SheetFooter>
          {confirmRejection ? (
            <div className="flex flex-col gap-3">
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />

              <div className="flex gap-2">
                <Button
                  onClick={handleClose}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleReviewAction("REJECTED")}
                  variant="destructive"
                  size="lg"
                  className="flex-1"
                  disabled={!rejectionReason}
                >
                  Confirm Rejection
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={() => setConfirmRejection(true)}
                variant="destructive"
                size="lg"
                className="flex-1"
              >
                Reject
              </Button>
              <Button
                onClick={() => handleReviewAction("APPROVED")}
                variant="default"
                size="lg"
                className="flex-1"
              >
                Approve
              </Button>
            </div>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
