import { describe, expect, it } from 'vitest';
import { createSeedEmployees } from '@/data/employees';
import { ALL, filterEmployees, sortEmployees } from '@/lib/employeeFilters';

const employees = createSeedEmployees(new Date(2026, 5, 15));

describe('filterEmployees', () => {
  it('returns everyone when no filter is active', () => {
    expect(filterEmployees(employees, { query: '', department: ALL, status: ALL })).toHaveLength(employees.length);
  });

  it('matches the search text against name, email, role, and location', () => {
    const result = filterEmployees(employees, { query: 'amelia', department: ALL, status: ALL });
    expect(result.map((e) => e.firstName)).toEqual(['Amelia']);
  });

  it('combines department and status filters', () => {
    const result = filterEmployees(employees, { query: '', department: 'Engineering', status: 'On Leave' });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((e) => e.department === 'Engineering' && e.status === 'On Leave')).toBe(true);
  });
});

describe('sortEmployees', () => {
  it('sorts by salary in both directions without mutating the input', () => {
    const copy = [...employees];
    const asc = sortEmployees(employees, 'salary', 'asc');
    const desc = sortEmployees(employees, 'salary', 'desc');
    expect(asc[0].salary).toBeLessThanOrEqual(asc[1].salary);
    expect(desc[0].salary).toBeGreaterThanOrEqual(desc[1].salary);
    expect(employees).toEqual(copy);
  });

  it('sorts by name alphabetically', () => {
    const names = sortEmployees(employees, 'name', 'asc').map((e) => `${e.firstName} ${e.lastName}`);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });
});
