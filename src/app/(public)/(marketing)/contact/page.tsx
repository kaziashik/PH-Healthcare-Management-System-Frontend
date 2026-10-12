import ContactForm from "@/components/form/contact-form";

const notes = [
  "Use this form for questions that are not a booking.",
  "Visits are booked from an open schedule on the doctor directory.",
  "Include a working email so the clinic can reply.",
];

export default function ContactPage() {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:py-16 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div>
        <p className="text-sm font-medium text-primary">Clinic inbox</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">Contact</h1>
        <p className="mt-3 mb-6 max-w-xl text-sm leading-6 text-muted-foreground">
          Send a message with your name, a working email, and enough detail for
          the team to reply.
        </p>
        <ContactForm />
      </div>
      <aside className="panel h-fit p-5">
        <h2 className="font-semibold">Before you write</h2>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
          {notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </aside>
    </section>
  );
}
