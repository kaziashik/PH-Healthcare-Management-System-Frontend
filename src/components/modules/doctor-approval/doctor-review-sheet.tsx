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
import {
  BadgeCheck,
  Briefcase,
  Check,
  FileText,
  Files,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Stethoscope,
  UserRound,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { doctorInitials } from "../doctors/doctor-card";
import ResumePreview from "./resume-preview";

interface Props extends DoctorParams {
  selectedId: string;
  canDecide: boolean;
  onClose: () => void;
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl border bg-card/60 px-3 py-2.5">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <dt className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </dt>
        <dd className="mt-0.5 text-sm break-words">{value || "—"}</dd>
      </div>
    </div>
  );
}

function DocumentGroup({
  title,
  icon: Icon,
  documents,
  empty,
  onOpen,
}: {
  title: string;
  icon: LucideIcon;
  documents: ReviewDocument[];
  empty: string;
  onOpen: (document: ReviewDocument) => void;
}) {
  return (
    <div className="mt-4">
      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
        <Icon className="size-3.5" aria-hidden="true" />
        {title}
        <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">
          {documents.length}
        </span>
      </p>
      {documents.length === 0 ? (
        <p className="text-sm text-muted-foreground">{empty}</p>
      ) : (
        <div className="grid gap-2">
          {documents.map((document, index) => (
            <Button
              key={`${document.url}-${index}`}
              type="button"
              variant="outline"
              className="w-full justify-start"
              onClick={() => onOpen(document)}
            >
              <FileText aria-hidden="true" />
              <span className="truncate">{document.label}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {fileKind(document.url)}
              </span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

type ReviewDocument = {
  url: string;
  title: string;
  fileName: string;
  label: string;
  group: "resume" | "additional";
};

function fileKind(url: string) {
  const match = url.match(/\.([a-z0-9]+)(?:\?|$)/i);
  return match?.[1]?.toUpperCase() ?? "FILE";
}

function reviewDocuments(doctor: Doctor): ReviewDocument[] {
  const safeName = doctor.name.trim().replace(/\s+/g, "_") || "Doctor";
  const documents: ReviewDocument[] = [];

  if (doctor.resume) {
    documents.push({
      url: doctor.resume,
      title: `${doctor.name} CV`,
      fileName: `${safeName}_CV.pdf`,
      label: "Resume",
      group: "resume",
    });
  }

  const extras = Array.isArray(doctor.additionalFiles)
    ? doctor.additionalFiles
    : [];

  extras.forEach((file, index) => {
    if (!file?.url) return;
    const kind = fileKind(file.url).toLowerCase();
    documents.push({
      url: file.url,
      title: `${doctor.name} additional document ${index + 1}`,
      fileName: `${safeName}_additional_document_${index + 1}.${kind}`,
      label: `Additional document ${index + 1}`,
      group: "additional",
    });
  });

  return documents;
}

function profileRows(doctor: Doctor) {
  const fee =
    doctor.consultationFee === null || doctor.consultationFee === undefined
      ? ""
      : `৳${doctor.consultationFee}`;

  return [
    { icon: Mail, label: "Email", value: doctor.email },
    { icon: BadgeCheck, label: "License", value: doctor.licenseNumber },
    { icon: Phone, label: "Contact", value: doctor.contactNumber ?? "" },
    { icon: Stethoscope, label: "Specialization", value: doctor.specialization },
    { icon: GraduationCap, label: "Qualifications", value: doctor.qualifications },
    {
      icon: Briefcase,
      label: "Experience",
      value: `${doctor.experienceYears} years`,
    },
    { icon: Wallet, label: "Fee", value: fee },
    { icon: MapPin, label: "Address", value: doctor.address ?? "" },
    { icon: UserRound, label: "About", value: doctor.bio ?? "" },
  ];
}

export default function DoctorReviewSheet({
  selectedId,
  canDecide,
  onClose,
  ...params
}: Props) {
  const [confirmRejection, setConfirmRejection] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [preview, setPreview] = useState<ReviewDocument | null>(null);

  const { data } = useGetAllDoctors(params);
  const { mutate: verify, isPending } = useApproveDoctor();

  const selectedDoctor = data?.data?.find((doctor) => doctor.id === selectedId);

  const handleClose = () => {
    setConfirmRejection(false);
    setRejectionReason("");
    setPreview(null);
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

  const documents = reviewDocuments(selectedDoctor);

  return (
    <Sheet open={!!selectedId} onOpenChange={handleClose}>
      <SheetContent
        side="left"
        className="w-full gap-0 p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            {canDecide ? "Review this application" : "Doctor profile"}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-base font-semibold text-primary">
              {doctorInitials(selectedDoctor.name)}
            </span>
            <div className="min-w-0">
              <SheetTitle className="truncate text-lg">
                {selectedDoctor.name}
              </SheetTitle>
              <SheetDescription className="flex items-center gap-1.5">
                <Stethoscope className="size-3.5" aria-hidden="true" />
                {selectedDoctor.specialization}
              </SheetDescription>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {canDecide
              ? "Approving makes this doctor active. They get an email, appear for patients, and can create a schedule."
              : "This doctor is approved and can be booked."}
          </p>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <dl className="grid gap-2">
            {profileRows(selectedDoctor).map((row) => (
              <Detail key={row.label} {...row} />
            ))}
          </dl>
          <DocumentGroup
            title="Resume"
            icon={FileText}
            documents={documents.filter((document) => document.group === "resume")}
            empty="No resume uploaded."
            onOpen={setPreview}
          />
          <DocumentGroup
            title="Additional documents"
            icon={Files}
            documents={documents.filter(
              (document) => document.group === "additional",
            )}
            empty="No additional documents uploaded."
            onOpen={setPreview}
          />
        </div>
        {canDecide ? (
          <SheetFooter className="border-t bg-background">
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
                    <X aria-hidden="true" />
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
                  <X aria-hidden="true" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleReviewAction("APPROVED")}
                  size="lg"
                  className="flex-1 bg-[#0f766e] text-white hover:bg-[#115e59]"
                  disabled={isPending}
                >
                  <Check aria-hidden="true" />
                  Approve
                </Button>
              </div>
            )}
          </SheetFooter>
        ) : null}
      </SheetContent>
      <ResumePreview
        open={!!preview}
        url={preview?.url ?? null}
        title={preview?.title ?? ""}
        fileName={preview?.fileName ?? ""}
        onClose={() => setPreview(null)}
      />
    </Sheet>
  );
}
