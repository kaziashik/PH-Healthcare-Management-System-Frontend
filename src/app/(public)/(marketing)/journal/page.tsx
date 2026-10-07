import Link from "next/link";

const posts = [
  {
    title: "How a same-day visit is booked",
    text: "Doctors publish one calendar date, between 3 and 8 hours. Patients pay the consultation fee and receive the next free 20-minute serial.",
  },
  {
    title: "When a cancellation is refunded",
    text: "bKash refunds the payment only if the patient cancels more than one hour before the schedule starts. Later cancellations keep the fee.",
  },
  {
    title: "What happens after the visit",
    text: "The doctor marks the visit ongoing, then completed, and writes findings plus at least one medicine. The patient opens the prescription from the appointments list.",
  },
];

export default function JournalPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 md:py-16">
      <h1 className="text-3xl font-bold tracking-tight">Journal</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Notes on how the clinic actually runs a visit.
      </p>
      <div className="mt-6 flex flex-col gap-4">
        {posts.map((post) => (
          <article key={post.title} className="panel p-4">
            <h2 className="text-lg font-semibold">{post.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {post.text}
            </p>
          </article>
        ))}
      </div>
      <Link
        className="mt-6 inline-block text-sm underline underline-offset-4"
        href="/doctors"
      >
        Find a doctor
      </Link>
    </section>
  );
}
