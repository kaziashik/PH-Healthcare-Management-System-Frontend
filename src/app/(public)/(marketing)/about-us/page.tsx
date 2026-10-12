import Link from "next/link";

const points = [
  {
    title: "Approved doctors only",
    text: "A profile stays off the public list until the doctor verifies email and an admin approves the application.",
  },
  {
    title: "Same-day serials",
    text: "Patients book before today's schedule starts. A successful bKash payment assigns the next 20-minute serial.",
  },
  {
    title: "Refund window",
    text: "A patient can cancel with a refund only when more than one hour remains before the visit.",
  },
];

export default function AboutUsPage() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:py-16 lg:grid-cols-2">
      <div className="rise-in">
        <p className="text-sm font-medium text-primary">About the clinic</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          Same-day visits with approved doctors
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          PH Healthcare connects patients with approved doctors. A doctor
          publishes a schedule, a patient pays the consultation fee through
          bKash, and the clinic assigns a 20-minute serial.
        </p>
        <ul className="mt-6 flex flex-col gap-4">
          {points.map((point) => (
            <li key={point.title}>
              <p className="font-semibold">{point.title}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {point.text}
              </p>
            </li>
          ))}
        </ul>
        <Link
          className="mt-6 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
          href="/doctors"
        >
          See the doctor directory
        </Link>
      </div>
      <div className="rise-in rise-in-late overflow-hidden rounded-3xl shadow-sm">
        <img
          src="/clinic/clinic-consult.jpg"
          alt="Private consultation room"
          className="h-80 w-full object-cover sm:h-[28rem]"
        />
      </div>
    </section>
  );
}
