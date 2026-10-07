import Link from "next/link";

const groups = [
  {
    title: "Care",
    links: [
      { label: "Find a doctor", href: "/doctors" },
      { label: "Patient sign in", href: "/login" },
      { label: "Create a patient account", href: "/register" },
      { label: "Apply as a doctor", href: "/apply" },
    ],
  },
  {
    title: "Clinic",
    links: [
      { label: "About", href: "/about-us" },
      { label: "Journal", href: "/journal" },
      { label: "Help", href: "/help" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Sign in", href: "/login" },
    ],
  },
];

const scenes = [
  { src: "/clinic/clinic-reception.jpg", alt: "Bright clinic reception" },
  { src: "/clinic/clinic-consult.jpg", alt: "Private consultation room" },
  { src: "/clinic/clinic-corridor.jpg", alt: "Quiet hospital corridor" },
  { src: "/clinic/clinic-waiting.jpg", alt: "Waiting room with soft daylight" },
];

export default function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="overflow-hidden border-b" aria-label="Clinic rooms">
        <div className="clinic-slide flex w-max gap-3 px-3 py-4">
          {["first", "repeat"].map((copy) => (
            <div
              key={copy}
              className="flex gap-3"
              aria-hidden={copy === "repeat"}
            >
              {scenes.map((scene) => (
                <img
                  key={`${copy}-${scene.src}`}
                  src={scene.src}
                  alt={copy === "first" ? scene.alt : ""}
                  className="h-36 w-64 rounded-lg object-cover sm:h-44 sm:w-80"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-4 md:py-16">
        <div>
          <p className="font-semibold">PH Healthcare</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Same-day doctor visits, bKash payment, and prescriptions for
            patients in Bangladesh.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Write to the clinic from the contact page. Visits are booked only
            through an open schedule.
          </p>
        </div>
        {groups.map((group) => (
          <div key={group.title}>
            <p className="font-semibold">{group.title}</p>
            <ul className="mt-3 space-y-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t px-4 py-4 text-center text-sm text-muted-foreground">
        PH Healthcare. Payments are processed by bKash.
      </div>
    </footer>
  );
}
