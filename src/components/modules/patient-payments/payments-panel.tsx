"use client";

import { useState } from "react";
import ListPager from "@/components/modules/list-pager";
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

export default function PaymentsPanel() {
  const [page, setPage] = useState(1);
  const { data, isPending, isError } = useGetMyPayments({ page, limit: 10 });
  const payments = data?.data ?? [];

  return (
    <div className="flex flex-col gap-5">
      {isPending ? (
        <p className="text-sm text-muted-foreground">Loading payments...</p>
      ) : null}
      {isError ? (
        <p className="text-sm text-destructive">Could not load payments.</p>
      ) : null}

      {!isPending && !isError ? (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor</TableHead>
                <TableHead>Visit</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Refund</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>No payments yet.</TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {payment.appointment.doctor?.name ?? "—"}
                    </TableCell>
                    <TableCell>
                      {payment.appointment.schedule
                        ? formatVisitRange(
                            payment.appointment.schedule.startDateTime,
                            payment.appointment.schedule.endDateTime,
                          )
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {payment.currency} {payment.amount}
                    </TableCell>
                    <TableCell>{payment.status}</TableCell>
                    <TableCell>{payment.paidAt ?? "—"}</TableCell>
                    <TableCell>
                      {payment.refundAmount != null
                        ? `${payment.refundAmount}`
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))
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
    </div>
  );
}
