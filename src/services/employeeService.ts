import { createSeedEmployees } from '@/data/employees';
import type { Employee, EmployeeInput } from '@/types';

// MOCK SERVICE: persists to the browser's localStorage. Swap the bodies for real API calls later.

const STORAGE_KEY = 'aurelia.mock.employees';
const LATENCY_MS = import.meta.env.MODE === 'test' ? 0 : 300;

export class DuplicateEmailError extends Error {
  constructor() {
    super('An employee with this email already exists');
    this.name = 'DuplicateEmailError';
  }
}

export class EmployeeNotFoundError extends Error {
  constructor() {
    super('Employee not found');
    this.name = 'EmployeeNotFoundError';
  }
}

const wait = () => new Promise<void>((resolve) => setTimeout(resolve, LATENCY_MS));

function write(employees: Employee[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
}

function read(): Employee[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as Employee[];
    } catch {
      // Corrupted storage falls through to reseeding.
    }
  }
  const seeded = createSeedEmployees();
  write(seeded);
  return seeded;
}

function createId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `emp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function hasEmail(employees: Employee[], email: string, ignoreId?: string) {
  const normalized = email.trim().toLowerCase();
  return employees.some((e) => e.id !== ignoreId && e.email.toLowerCase() === normalized);
}

export const employeeService = {
  async list(): Promise<Employee[]> {
    await wait();
    return read();
  },

  async get(id: string): Promise<Employee> {
    await wait();
    const employee = read().find((e) => e.id === id);
    if (!employee) throw new EmployeeNotFoundError();
    return employee;
  },

  async create(input: EmployeeInput): Promise<Employee> {
    await wait();
    const employees = read();
    if (hasEmail(employees, input.email)) throw new DuplicateEmailError();
    const created: Employee = { ...input, id: createId() };
    write([created, ...employees]);
    return created;
  },

  async update(id: string, input: EmployeeInput): Promise<Employee> {
    await wait();
    const employees = read();
    if (!employees.some((e) => e.id === id)) throw new EmployeeNotFoundError();
    if (hasEmail(employees, input.email, id)) throw new DuplicateEmailError();
    const updated: Employee = { ...input, id };
    write(employees.map((e) => (e.id === id ? updated : e)));
    return updated;
  },

  async remove(id: string): Promise<void> {
    await wait();
    const employees = read();
    if (!employees.some((e) => e.id === id)) throw new EmployeeNotFoundError();
    write(employees.filter((e) => e.id !== id));
  },
};
