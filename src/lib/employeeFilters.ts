import type { Employee } from '@/types';

export type SortKey = 'name' | 'department' | 'status' | 'joinDate' | 'salary';
export type SortDirection = 'asc' | 'desc';

export interface EmployeeFilters {
  query: string;
  department: string;
  status: string;
}

export const ALL = 'All';

const fullName = (e: Employee) => `${e.firstName} ${e.lastName}`;

export function filterEmployees(employees: Employee[], filters: EmployeeFilters): Employee[] {
  const query = filters.query.trim().toLowerCase();
  return employees.filter((e) => {
    if (filters.department !== ALL && e.department !== filters.department) return false;
    if (filters.status !== ALL && e.status !== filters.status) return false;
    if (!query) return true;
    return [fullName(e), e.email, e.role, e.location].some((field) => field.toLowerCase().includes(query));
  });
}

export function sortEmployees(employees: Employee[], key: SortKey, direction: SortDirection): Employee[] {
  const factor = direction === 'asc' ? 1 : -1;
  const compare = (a: Employee, b: Employee): number => {
    switch (key) {
      case 'name':
        return fullName(a).localeCompare(fullName(b));
      case 'department':
        return a.department.localeCompare(b.department);
      case 'status':
        return a.status.localeCompare(b.status);
      case 'joinDate':
        return a.joinDate.localeCompare(b.joinDate);
      case 'salary':
        return a.salary - b.salary;
    }
  };
  return [...employees].sort((a, b) => compare(a, b) * factor);
}
