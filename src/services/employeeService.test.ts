import { describe, expect, it } from 'vitest';
import { DuplicateEmailError, EmployeeNotFoundError, employeeService } from '@/services/employeeService';
import type { EmployeeInput } from '@/types';

const input: EmployeeInput = {
  firstName: 'Test',
  lastName: 'Person',
  email: 'test.person@aurelia.example',
  phone: '+1 555 0199',
  department: 'Finance',
  role: 'Analyst',
  status: 'Active',
  salary: 70000,
  joinDate: '2026-01-05',
  location: 'Remote',
};

describe('employeeService', () => {
  it('seeds sample data on first read', async () => {
    expect((await employeeService.list()).length).toBeGreaterThan(10);
  });

  it('creates, updates, and removes an employee', async () => {
    const created = await employeeService.create(input);
    expect((await employeeService.list())[0].id).toBe(created.id);

    const updated = await employeeService.update(created.id, { ...input, role: 'Senior Analyst' });
    expect((await employeeService.get(created.id)).role).toBe(updated.role);

    await employeeService.remove(created.id);
    await expect(employeeService.get(created.id)).rejects.toBeInstanceOf(EmployeeNotFoundError);
  });

  it('rejects a duplicate email on create and update', async () => {
    const created = await employeeService.create(input);
    await expect(employeeService.create({ ...input, email: input.email.toUpperCase() })).rejects.toBeInstanceOf(DuplicateEmailError);

    const [other] = (await employeeService.list()).filter((e) => e.id !== created.id);
    await expect(employeeService.update(created.id, { ...input, email: other.email })).rejects.toBeInstanceOf(DuplicateEmailError);
  });
});
