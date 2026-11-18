import { z } from 'zod';
import { DEPARTMENTS, STATUSES } from '@/lib/constants';

export const employeeSchema = z.object({
  firstName: z.string().trim().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().trim().min(2, 'Last name must be at least 2 characters'),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  phone: z.string().trim().regex(/^\+?[\d\s().-]{7,20}$/, 'Enter a valid phone number'),
  department: z.enum(DEPARTMENTS, { errorMap: () => ({ message: 'Select a department' }) }),
  role: z.string().trim().min(2, 'Job title is required'),
  status: z.enum(STATUSES, { errorMap: () => ({ message: 'Select a status' }) }),
  salary: z
    .number({ required_error: 'Salary is required', invalid_type_error: 'Enter a valid salary' })
    .min(1, 'Salary must be greater than 0')
    .max(10_000_000, 'Salary is too large'),
  joinDate: z
    .string()
    .min(1, 'Join date is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date'),
  location: z.string().trim().min(2, 'Location is required'),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;
