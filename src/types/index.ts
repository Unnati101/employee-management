import type { DEPARTMENTS, STATUSES } from '@/lib/constants';

export type Department = (typeof DEPARTMENTS)[number];
export type EmployeeStatus = (typeof STATUSES)[number];

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: Department;
  role: string;
  status: EmployeeStatus;
  salary: number;
  /** ISO date, YYYY-MM-DD */
  joinDate: string;
  location: string;
}

export type EmployeeInput = Omit<Employee, 'id'>;

export interface User {
  id: string;
  name: string;
  email: string;
}
