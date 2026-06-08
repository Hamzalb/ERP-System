import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatCurrency = (amount: number, currency = 'USD', locale = 'en-US') =>
  new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);

export const formatNumber = (n: number, locale = 'en-US') =>
  new Intl.NumberFormat(locale).format(n);

export const formatDate = (date: string | Date, locale = 'en-US') =>
  new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(date));

export const formatDateTime = (date: string | Date, locale = 'en-US') =>
  new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date));

export const formatRelative = (date: string | Date) => {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
};

export const truncate = (str: string, max = 50) =>
  str.length > max ? `${str.slice(0, max)}...` : str;

export const initials = (name: string) =>
  name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

export const getStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    active: 'success', inactive: 'warning', archived: 'default', terminated: 'danger',
    pending: 'warning', approved: 'success', rejected: 'danger', cancelled: 'default',
    paid: 'success', draft: 'default', sent: 'info', overdue: 'danger',
    new: 'info', contacted: 'warning', qualified: 'success', won: 'success', lost: 'danger',
    present: 'success', absent: 'danger', late: 'warning',
  };
  return map[status] || 'default';
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
