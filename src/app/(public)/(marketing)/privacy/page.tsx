export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 md:py-16">
      <p className="text-sm font-medium text-primary">Clinic policy</p>
      <div className="panel mt-4 flex flex-col gap-4 p-6">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy</h1>
      <p className="text-sm leading-6 text-muted-foreground">
        Account email, name, and role are stored so the clinic can sign you in
        and route you to the correct dashboard. Doctor applications also store
        the BMDC registration number, qualifications, resume, and consultation
        fee.
      </p>
      <p className="text-sm leading-6 text-muted-foreground">
        Appointment payment references are sent to bKash. Prescriptions are
        stored with the completed visit and shown to that patient and doctor.
        Passwords are stored only as a hash.
      </p>
      </div>
    </section>
  );
}
