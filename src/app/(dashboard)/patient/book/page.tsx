import BookPanel from "@/components/modules/patient-book/book-panel";

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ doctorId?: string; followUp?: string }>;
}) {
  const { doctorId, followUp } = await searchParams;

  return (
    <section>
      <BookPanel doctorId={doctorId} followUp={followUp === "1"} />
    </section>
  );
}
