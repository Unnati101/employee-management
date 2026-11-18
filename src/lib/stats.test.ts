import { describe, expect, it } from 'vitest';
import { computeStats } from '@/lib/stats';
import type { Employee } from '@/types';

const base: Employee = {
  id: '1',
  firstName: 'A',
  lastName: 'B',
  email: 'a@b.test',
  phone: '+1 555 0100',
  department: 'Engineering',
  role: 'Dev',
  status: 'Active',
  salary: 100000,
  joinDate: '2026-06-01',
  location: 'Remote',
};

describe('computeStats', () => {
  const now = new Date(2026, 5, 15);
  const employees: Employee[] = [
    base,
    { ...base, id: '2', status: 'On Leave', department: 'Design', joinDate: '2024-01-10' },
    { ...base, id: '3', status: 'Inactive', department: 'Design', joinDate: '2026-04-20' },
  ];
  const stats = computeStats(employees, now);

  it('counts totals and statuses', () => {
    expect(stats).toMatchObject({ total: 3, active: 1, onLeave: 1, inactive: 1 });
  });

  it('counts hires from the last 90 days', () => {
    expect(stats.newHires).toBe(2);
  });

  it('groups headcount by department, largest first', () => {
    expect(stats.byDepartment).toEqual([
      { name: 'Design', count: 2 },
      { name: 'Engineering', count: 1 },
    ]);
  });

  it('builds a 12-month hiring series ending in the current month', () => {
    expect(stats.hiresByMonth).toHaveLength(12);
    expect(stats.hiresByMonth[11]).toEqual({ month: 'Jun', hires: 1 });
    expect(stats.hiresByMonth[9]).toEqual({ month: 'Apr', hires: 1 });
  });
});
