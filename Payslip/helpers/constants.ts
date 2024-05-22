// Year objects (current year + 15 years)
const currentYear = new Date().getFullYear();
// export const years = Array.from({ length: 16 }, (_, i) => ({
//   value: (currentYear + i).toString(),
//   label: (currentYear + i).toString(),
// }));

export const years = [
  {
    value: 2023,
    label: "2023",
  },
  {
    value: 2024,
    label: "2024",
  },
  {
    value: 2025,
    label: "2025",
  },
];
