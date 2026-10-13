"use client";

import { Button } from "@/components/ui/button";

export default function PayChoiceNotice({
  open,
  paymentUrl,
  whenLabel,
  onClose,
}: {
  open: boolean;
  paymentUrl: string | null;
  whenLabel: string;
  onClose: () => void;
}) {
  if (!open || !paymentUrl) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="pay-choice-title"
        className="relative w-full max-w-md rounded-2xl border bg-popover p-6 text-popover-foreground shadow-lg"
      >
        <h2 id="pay-choice-title" className="text-lg font-semibold">
          Pay now or later
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {whenLabel ? `${whenLabel} is booked.` : "This time is booked."} You
          have to pay within 5 minutes. Otherwise this booking will be
          cancelled.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={() => window.location.assign(paymentUrl)}
          >
            Pay now
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Pay later
          </Button>
        </div>
      </div>
    </div>
  );
}
