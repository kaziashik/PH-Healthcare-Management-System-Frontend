import DoctorDetails from "@/components/modules/doctors/doctor-details";

export default async function DoctorDetailsPage({
  params,
}: {
  params: Promise<{ doctorId: string }>;
}) {
  const { doctorId } = await params;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <DoctorDetails doctorId={doctorId} />
    </section>
  );
}
