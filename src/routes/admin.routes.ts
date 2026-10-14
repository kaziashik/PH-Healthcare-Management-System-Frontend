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
        title: "Approved doctors",
        url: `${prefix}/approved-doctors`,
      },
      {
        title: "Need approval",
        url: `${prefix}/need-approval`,
      },
      {
        title: "Patients",
        url: `${prefix}/patients`,
      },
      {
        title: "Admins",
        url: `${prefix}/admins`,
      },
      {
        title: "Analytics",
        url: `${prefix}/analytics`,
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
