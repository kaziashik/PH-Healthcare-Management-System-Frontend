const prefix = "/admin";

export const adminRoutes = [
  {
    title: "Management",
    items: [
      {
        title: "Overview",
        url: `${prefix}`,
      },
      {
        title: "Doctor Approval",
        url: `${prefix}/approve-doctor`,
      },
      {
        title: "Patients",
        url: `${prefix}/patients`,
      },
      {
        title: "Admins",
        url: `${prefix}/admins`,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Change Password",
        url: "/change-password",
      },
    ],
  },
];
