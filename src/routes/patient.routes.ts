const prefix = "/patient";

export const patientRoutes = [
  {
    title: "Care",
    items: [
      {
        title: "Overview",
        url: `${prefix}`,
      },
      {
        title: "Book",
        url: `${prefix}/book`,
      },
      {
        title: "Appointments",
        url: `${prefix}/appointments`,
      },
      {
        title: "Payments",
        url: `${prefix}/payments`,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Profile",
        url: `${prefix}/profile`,
      },
    ],
  },
];
