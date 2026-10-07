export default function TermsPage() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-14 sm:px-6 md:py-16">
      <h1 className="text-3xl font-bold tracking-tight">Terms</h1>
      <p className="text-sm leading-6 text-muted-foreground">
        A booking is confirmed when bKash reports a successful payment. The
        consultation fee shown on the doctor profile is the amount charged.
      </p>
      <p className="text-sm leading-6 text-muted-foreground">
        Patients may cancel a booked visit. A refund is issued only when the
        cancellation is more than one hour before the schedule starts. Doctors
        must be approved before a schedule can be offered to patients.
      </p>
    </section>
  );
}
