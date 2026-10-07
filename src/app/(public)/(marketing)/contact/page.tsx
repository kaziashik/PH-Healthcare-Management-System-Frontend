import ContactForm from "@/components/form/contact-form";

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Contact</h1>
      <p className="mt-2 mb-6 text-sm text-muted-foreground">
        Send a message to the clinic inbox. Include your name, a working email,
        and enough detail for the team to reply.
      </p>
      <ContactForm />
    </section>
  );
}
