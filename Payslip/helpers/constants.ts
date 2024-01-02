// Year objects (current year + 15 years)
const currentYear = new Date().getFullYear();
export const years = Array.from({ length: 16 }, (_, i) => ({
  value: (currentYear + i).toString(),
  label: (currentYear + i).toString(),
}));
