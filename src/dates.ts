const pad = (n: number) => String(n).padStart(2, '0');
export const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parseISO = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};
export const todayISO = () => toISO(new Date());
export const inDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toISO(d);
};
const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
export const monthShort = (iso: string) => MONTHS[parseISO(iso).getMonth()];
export const dayNum = (iso: string) => parseISO(iso).getDate();
export const weekday = (iso: string) => DAYS[parseISO(iso).getDay()];
export const monthName = (d: Date) =>
  d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
export const isValidISO = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(parseISO(s).getTime());
