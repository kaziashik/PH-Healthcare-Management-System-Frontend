import Link from "next/link";

export default function AboutUsPage() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">About PH Healthcare</h1>
      <p className="text-sm leading-6 text-muted-foreground">
        PH Healthcare connects patients with approved doctors for same-day
        visits. A doctor publishes a schedule, a patient pays the consultation
        fee through bKash, and the clinic assigns a 20-minute serial.
      </p>
      <p className="text-sm leading-6 text-muted-foreground">
        Admins review doctor applications before a profile is public. Super
        admins also manage admin accounts. Patients can cancel with a refund
        only when more than one hour remains before the visit.
      </p>
      <Link className="text-sm underline underline-offset-4" href="/doctors">
        See the doctor directory
      </Link>
    </section>
  );
}
