// {
//             title: "Managment",
//             url: "#",
//             items: [
//                 {
//                     title: "Overview",
//                     url: `${prefix}`,
//                 },
//                 {
//                     title: "Doctor Aoorval",
//                     url: `$/{prefix}/approve-doctor`,
//                 },
//             ],
//         },

export interface SidebarItem {
  title: string;
  url: string;
}

export interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

export type SidebarItems = SidebarGroup[];
