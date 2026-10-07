const prefix = "/doctor";

export const doctorRoutes = [
  {
    title: "Practice",
    items: [
      {
        title: "Overview",
        url: `${prefix}`,
      },
      {
        title: "Schedules",
        url: `${prefix}/schedules`,
      },
      {
        title: "Appointments",
        url: `${prefix}/appointments`,
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
      {
        title: "Change Password",
        url: "/change-password",
      },
    ],
  },
];
