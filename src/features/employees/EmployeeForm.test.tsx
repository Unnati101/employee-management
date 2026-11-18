import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EmployeeForm } from '@/features/employees/EmployeeForm';
import { DuplicateEmailError } from '@/services/employeeService';

function setup(onSubmit = vi.fn().mockResolvedValue(undefined)) {
  const onCancel = vi.fn();
  render(<EmployeeForm submitLabel="Save" onSubmit={onSubmit} onCancel={onCancel} />);
  return { onSubmit, onCancel, user: userEvent.setup() };
}

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('First name'), 'Jane');
  await user.type(screen.getByLabelText('Last name'), 'Doe');
  await user.type(screen.getByLabelText('Email'), 'jane.doe@aurelia.example');
  await user.type(screen.getByLabelText('Phone'), '+1 555 0123');
  await user.type(screen.getByLabelText('Location'), 'Austin, TX');
  await user.selectOptions(screen.getByLabelText('Department'), 'Design');
  await user.type(screen.getByLabelText('Job title'), 'Designer');
  await user.type(screen.getByLabelText('Join date'), '2026-03-02');
  await user.type(screen.getByLabelText('Annual salary (USD)'), '90000');
}

describe('EmployeeForm', () => {
  it('shows validation messages and does not submit empty data', async () => {
    const { onSubmit, user } = setup();
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText('First name must be at least 2 characters')).toBeInTheDocument();
    expect(screen.getByText('Select a department')).toBeInTheDocument();
    expect(screen.getByText('Enter a valid salary')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits typed values when the form is valid', async () => {
    const { onSubmit, user } = setup();
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      firstName: 'Jane',
      department: 'Design',
      status: 'Active',
      salary: 90000,
    });
  });

  it('shows a duplicate email error on the email field', async () => {
    const { user } = setup(vi.fn().mockRejectedValue(new DuplicateEmailError()));
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText('An employee with this email already exists')).toBeInTheDocument();
  });

  it('calls onCancel', async () => {
    const { onCancel, user } = setup();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalled();
  });
});
