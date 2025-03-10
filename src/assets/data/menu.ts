export const menuItems = [
  { label: "Dashboard", icon: "pi pi-home", link: "/dashboard" },
  { label: "Bookmarks", icon: "pi pi-bookmark", link: "/bookmarks" },
  {
    label: "Reports",
    icon: "pi pi-chart-pie",
    children: [
      {
        label: "Revenue",
        icon: "pi pi-chart-pie",
        children: [
          { label: "View", icon: "pi pi-table", link: "/reports/revenue/view" },
          { label: "Search", icon: "pi pi-search", link: "/reports/revenue/search" },
        ],
      },
      { label: "Expenses", icon: "pi pi-chart-line", link: "/reports/expenses" },
    ],
  },
  { label: "Team", icon: "pi pi-users", link: "/team" },
  { label: "Messages", icon: "pi pi-comments", badge: 3, link: "/messages" },
  { label: "Calendar", icon: "pi pi-calendar", link: "/calendar" },
];

export default menuItems;