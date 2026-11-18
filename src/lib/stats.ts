import { parseISODate } from '@/lib/format';
import type { Employee } from '@/types';

export interface DashboardStats {
  total: number;
  active: number;
  onLeave: number;
  inactive: number;
  newHires: number;
  byDepartment: { name: string; count: number }[];
  byStatus: { name: string; value: number }[];
  hiresByMonth: { month: string; hires: number }[];
}

const NEW_HIRE_WINDOW_DAYS = 90;
const DAY_MS = 24 * 60 * 60 * 1000;

export function computeStats(employees: Employee[], now: Date = new Date()): DashboardStats {
  const active = employees.filter((e) => e.status === 'Active').length;
  const onLeave = employees.filter((e) => e.status === 'On Leave').length;
  const inactive = employees.filter((e) => e.status === 'Inactive').length;

  const newHires = employees.filter((e) => {
    const age = now.getTime() - parseISODate(e.joinDate).getTime();
    return age >= 0 && age <= NEW_HIRE_WINDOW_DAYS * DAY_MS;
  }).length;

  const departmentCounts = new Map<string, number>();
  for (const employee of employees) {
    departmentCounts.set(employee.department, (departmentCounts.get(employee.department) ?? 0) + 1);
  }
  const byDepartment = [...departmentCounts]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const hiresByMonth = Array.from({ length: 12 }, (_, index) => {
    const start = new Date(now.getFullYear(), now.getMonth() - (11 - index), 1);
    const hires = employees.filter((e) => {
      const joined = parseISODate(e.joinDate);
      return joined.getFullYear() === start.getFullYear() && joined.getMonth() === start.getMonth();
    }).length;
    return { month: start.toLocaleString('en-US', { month: 'short' }), hires };
  });

  return {
    total: employees.length,
    active,
    onLeave,
    inactive,
    newHires,
    byDepartment,
    byStatus: [
      { name: 'Active', value: active },
      { name: 'On Leave', value: onLeave },
      { name: 'Inactive', value: inactive },
    ],
    hiresByMonth,
  };
}
