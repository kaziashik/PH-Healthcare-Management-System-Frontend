import PaymentsPanel from "@/components/modules/patient-payments/payments-panel";

export default function PaymentsPage() {
  return (
    <section>
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <p className="text-sm text-muted-foreground">
          bKash payments and refunds for your visits.
        </p>
      </div>
      <PaymentsPanel />
    </section>
  );
}
