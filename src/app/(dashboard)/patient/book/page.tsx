import BookPanel from "@/components/modules/patient-book/book-panel";

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ doctorId?: string }>;
}) {
  const { doctorId } = await searchParams;

  return (
    <section>
      <BookPanel doctorId={doctorId} />
    </section>
  );
}
