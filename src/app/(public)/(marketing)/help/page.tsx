import Link from "next/link";

const topics = [
  {
    title: "Booking",
    text: "Open Book from the patient dashboard. Only published schedules that start later today are listed.",
    href: "/patient/book",
  },
  {
    title: "Payment",
    text: "The booking button sends you to bKash. The appointment stays pending until the payment callback succeeds.",
    href: "/patient/payments",
  },
  {
    title: "Password",
    text: "Use Forgot password on the login page, or change it from the account menu after you sign in.",
    href: "/forgot-password",
  },
];

export default function HelpPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 md:py-16">
      <p className="text-sm font-medium text-primary">Clinic guide</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Help</h1>
      <div className="mt-6 flex flex-col gap-4">
        {topics.map((topic) => (
          <article key={topic.title} className="panel p-4">
            <h2 className="font-semibold">{topic.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{topic.text}</p>
            <Link
              className="mt-3 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
              href={topic.href}
            >
              Open
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
