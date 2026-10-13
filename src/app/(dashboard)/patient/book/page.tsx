import BookPanel from "@/components/modules/patient-book/book-panel";

export default function BookPage() {
  return (
    <section>
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight">Book a visit</h1>
        <p className="text-sm text-muted-foreground">
          Choose a doctor who is open later today, or on a later published day.
          Booking continues on bKash.
        </p>
      </div>
      <BookPanel />
    </section>
  );
}
