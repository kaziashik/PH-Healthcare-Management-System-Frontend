"use client";

import {
  CalendarClock,
  Check,
  Clock,
  FileText,
  Stethoscope,
  Undo2,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import ResumePreview from "@/components/modules/doctor-approval/resume-preview";
import ListPager from "@/components/modules/list-pager";
import { doctorInitials } from "@/components/modules/doctors/doctor-card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import apiClient from "@/lib/apiClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetMyPayments } from "@/hooks/appointment.hook";
import { formatVisitRange } from "@/lib/visit-time";
import type { PaymentRecord, PaymentStatus } from "@/types/appointment.type";

const statusMeta: Record<
  PaymentStatus,
  { label: string; icon: LucideIcon; className: string }
> = {
  PAID: {
    label: "Paid",
    icon: Check,
    className: "bg-primary/15 text-primary",
  },
  UNPAID: {
    label: "Unpaid",
    icon: Clock,
    className: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  },
  FAILED: {
    label: "Failed",
    icon: X,
    className: "bg-destructive/10 text-destructive",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: X,
    className: "bg-destructive/10 text-destructive",
  },
  REFUNDED: {
    label: "Refunded",
    icon: Undo2,
    className: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  },
};

function DoctorFace({
  name,
  imageUrl,
}: {
  name: string;
  imageUrl?: string | null;
}) {
  const [failed, setFailed] = useState(false);
  const photo = !failed && imageUrl?.trim() ? imageUrl : "";

  if (photo) {
    return (
      <img
        src={photo}
        alt=""
        className="size-10 shrink-0 rounded-full object-cover"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
      {doctorInitials(name)}
    </span>
  );
}

function money(currency: string, amount: number | string | null | undefined) {
  if (amount == null || amount === "") return "—";
  if (currency === "BDT") return `৳${amount}`;
  return `${currency} ${amount}`;
}

function formatPaidAt(iso: string | null) {
  if (!iso) return "—";
  const normalized = iso
    .replace(/T(\d{2}):(\d{2}):(\d{2}):(\d+)/, "T$1:$2:$3.$4")
    .replace(" GMT", "")
    .replace(/([+-])(\d{2})(\d{2})$/, "$1$2:$3");
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function PaymentsPanel() {
  const [page, setPage] = useState(1);
  const [openingId, setOpeningId] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<{
    url: string;
    fileName: string;
  } | null>(null);
  const { data, isPending, isError } = useGetMyPayments({ page, limit: 10 });
  const payments = data?.data ?? [];

  const closeReceipt = () => {
    setReceipt((current) => {
      if (current) URL.revokeObjectURL(current.url);
      return null;
    });
  };

  const openReceipt = async (payment: PaymentRecord) => {
    setOpeningId(payment.id);
    try {
      const blob = await apiClient<Blob, "blob">(
        `/payment/${payment.id}/receipt`,
        {
          responseType: "blob",
        },
      );
      const url = URL.createObjectURL(blob);
      setReceipt((current) => {
        if (current) URL.revokeObjectURL(current.url);
        return { url, fileName: "invoice.pdf" };
      });
    } catch {
      toast.add({
        title: "Could not open receipt",
        description: "The receipt is available after the payment is paid.",
        type: "error",
      });
    } finally {
      setOpeningId(null);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {isPending ? (
        <p className="text-sm text-muted-foreground">Loading payments...</p>
      ) : null}
      {isError ? (
        <p className="text-sm text-destructive">Could not load payments.</p>
      ) : null}

      {!isPending && !isError ? (
        <div className="panel">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor</TableHead>
                <TableHead>Visit</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Receipt</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Refund</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>No payments yet.</TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => {
                  const doctorName = payment.appointment.doctor?.name ?? "Doctor";
                  const statusView = statusMeta[payment.status];
                  const StatusIcon = statusView.icon;
                  const visit = payment.appointment.schedule
                    ? formatVisitRange(
                        payment.appointment.schedule.startDateTime,
                        payment.appointment.schedule.endDateTime,
                      )
                    : "—";

                  return (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <DoctorFace
                            name={doctorName}
                            imageUrl={payment.appointment.doctor?.user?.imageUrl}
                          />
                          <div className="min-w-0">
                            <p className="font-medium">{doctorName}</p>
                            <p className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Stethoscope
                                className="size-3.5 shrink-0"
                                aria-hidden="true"
                              />
                              <span className="truncate">
                                {payment.appointment.doctor?.specialization}
                              </span>
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarClock
                            className="size-3.5 shrink-0 text-muted-foreground"
                            aria-hidden="true"
                          />
                          {visit}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5 font-medium">
                          <Wallet
                            className="size-3.5 text-muted-foreground"
                            aria-hidden="true"
                          />
                          {money(payment.currency, payment.amount)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${statusView.className}`}
                        >
                          <StatusIcon className="size-3.5" aria-hidden="true" />
                          {statusView.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        {payment.status === "PAID" ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={openingId === payment.id}
                            onClick={() => openReceipt(payment)}
                          >
                            {openingId === payment.id ? (
                              <Spinner />
                            ) : (
                              <FileText aria-hidden="true" />
                            )}
                            View receipt
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>{formatPaidAt(payment.paidAt)}</TableCell>
                      <TableCell>
                        {payment.refundAmount != null
                          ? money(payment.currency, payment.refundAmount)
                          : "—"}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      ) : null}

      <ListPager
        page={page}
        totalPages={data?.meta?.totalPages ?? 1}
        onPageChange={setPage}
      />

      <ResumePreview
        open={!!receipt}
        url={receipt?.url ?? null}
        title="Appointment Invoice"
        fileName={receipt?.fileName ?? "invoice.pdf"}
        asPdf
        onClose={closeReceipt}
      />
    </div>
  );
}
