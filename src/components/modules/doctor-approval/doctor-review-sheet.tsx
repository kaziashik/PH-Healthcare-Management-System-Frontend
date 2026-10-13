import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useApproveDoctor, useGetAllDoctors } from "@/hooks/doctor.hook";
import type { ApproveDoctorPayload, Doctor, DoctorParams } from "@/types";
import { useState } from "react";

interface Props extends DoctorParams {
  selectedId: string;
  canDecide: boolean;
  onClose: () => void;
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5">{value || "—"}</dd>
    </div>
  );
}

function profileRows(doctor: Doctor) {
  const fee =
    doctor.consultationFee === null || doctor.consultationFee === undefined
      ? ""
      : `৳${doctor.consultationFee}`;

  return [
    ["Name", doctor.name],
    ["Email", doctor.email],
    ["License", doctor.licenseNumber],
    ["Contact", doctor.contactNumber ?? ""],
    ["Specialization", doctor.specialization],
    ["Qualifications", doctor.qualifications],
    ["Experience", `${doctor.experienceYears} years`],
    ["Fee", fee],
    ["Address", doctor.address ?? ""],
    ["About", doctor.bio ?? ""],
  ] as const;
}

export default function DoctorReviewSheet({
  selectedId,
  canDecide,
  onClose,
  ...params
}: Props) {
  const [confirmRejection, setConfirmRejection] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const { data } = useGetAllDoctors(params);
  const { mutate: verify, isPending } = useApproveDoctor();

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
      rejectionReason,
    };

    verify(reviewData, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  if (!selectedDoctor) {
    return null;
  }

  return (
    <Sheet open={!!selectedId} onOpenChange={handleClose}>
      <SheetContent side="left" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {canDecide ? "Review this application" : "Doctor profile"}
          </SheetTitle>
          <SheetDescription>
            {canDecide
              ? "Approving makes this doctor active. They get an email, appear for patients, and can create a schedule."
              : "This doctor is approved and can be booked."}
          </SheetDescription>
        </SheetHeader>
        <dl className="grid gap-3 px-4">
          {profileRows(selectedDoctor).map(([label, value]) => (
            <Detail key={label} label={label} value={value} />
          ))}
          {selectedDoctor.resume ? (
            <div>
              <dt className="text-xs text-muted-foreground">Resume</dt>
              <dd className="mt-0.5">
                <a
                  className="underline underline-offset-4"
                  href={selectedDoctor.resume}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open resume
                </a>
              </dd>
            </div>
          ) : null}
        </dl>
        {canDecide ? (
          <SheetFooter>
            {confirmRejection ? (
              <div className="flex flex-col gap-3">
                <Textarea
                  value={rejectionReason}
                  onChange={(event) => setRejectionReason(event.target.value)}
                  placeholder="Why is this application rejected?"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => setConfirmRejection(false)}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    disabled={isPending}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => handleReviewAction("REJECTED")}
                    variant="destructive"
                    size="lg"
                    className="flex-1"
                    disabled={!rejectionReason.trim() || isPending}
                  >
                    Confirm rejection
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
                  disabled={isPending}
                >
                  Reject
                </Button>
                <Button
                  onClick={() => handleReviewAction("APPROVED")}
                  size="lg"
                  className="flex-1"
                  disabled={isPending}
                >
                  Approve
                </Button>
              </div>
            )}
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
