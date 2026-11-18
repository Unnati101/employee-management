import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { employeeSchema, type EmployeeFormValues } from '@/features/employees/employeeSchema';
import { DEPARTMENTS, STATUSES } from '@/lib/constants';
import { DuplicateEmailError } from '@/services/employeeService';

interface EmployeeFormProps {
  initialValues?: EmployeeFormValues;
  submitLabel: string;
  onSubmit: (values: EmployeeFormValues) => Promise<void>;
  onCancel: () => void;
}

const DEFAULT_VALUES: Partial<EmployeeFormValues> = { status: 'Active' };

export function EmployeeForm({ initialValues, submitLabel, onSubmit, onCancel }: EmployeeFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialValues ?? DEFAULT_VALUES,
  });

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(values);
    } catch (error) {
      if (error instanceof DuplicateEmailError) {
        setError('email', { message: error.message });
        return;
      }
      setError('root', { message: error instanceof Error ? error.message : 'Something went wrong' });
    }
  });

  const invalid = (name: keyof EmployeeFormValues) => ({
    'aria-invalid': !!errors[name],
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  });

  return (
    <form onSubmit={submit} noValidate className="space-y-8">
      {errors.root && (
        <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errors.root.message}
        </p>
      )}

      <fieldset className="space-y-5">
        <legend className="font-display text-lg font-semibold">Personal details</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="firstName" label="First name" error={errors.firstName?.message}>
            <Input id="firstName" autoComplete="given-name" {...invalid('firstName')} {...register('firstName')} />
          </Field>
          <Field id="lastName" label="Last name" error={errors.lastName?.message}>
            <Input id="lastName" autoComplete="family-name" {...invalid('lastName')} {...register('lastName')} />
          </Field>
          <Field id="email" label="Email" error={errors.email?.message}>
            <Input id="email" type="email" autoComplete="off" {...invalid('email')} {...register('email')} />
          </Field>
          <Field id="phone" label="Phone" error={errors.phone?.message}>
            <Input id="phone" type="tel" autoComplete="off" placeholder="+1 555 0100" {...invalid('phone')} {...register('phone')} />
          </Field>
          <Field id="location" label="Location" error={errors.location?.message} className="sm:col-span-2">
            <Input id="location" placeholder="City, State or Remote" {...invalid('location')} {...register('location')} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="font-display text-lg font-semibold">Employment</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="department" label="Department" error={errors.department?.message}>
            <Select id="department" {...invalid('department')} {...register('department')}>
              <option value="">Select department</option>
              {DEPARTMENTS.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </Select>
          </Field>
          <Field id="role" label="Job title" error={errors.role?.message}>
            <Input id="role" {...invalid('role')} {...register('role')} />
          </Field>
          <Field id="status" label="Status" error={errors.status?.message}>
            <Select id="status" {...invalid('status')} {...register('status')}>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          </Field>
          <Field id="joinDate" label="Join date" error={errors.joinDate?.message}>
            <Input id="joinDate" type="date" {...invalid('joinDate')} {...register('joinDate')} />
          </Field>
          <Field id="salary" label="Annual salary (USD)" error={errors.salary?.message}>
            <Input id="salary" type="number" min={0} step={1000} inputMode="numeric" {...invalid('salary')} {...register('salary', { valueAsNumber: true })} />
          </Field>
        </div>
      </fieldset>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
