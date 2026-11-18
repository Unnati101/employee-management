import { ArrowLeft, UserX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { buttonVariants } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmployeeForm } from '@/features/employees/EmployeeForm';
import type { EmployeeFormValues } from '@/features/employees/employeeSchema';
import { employeeService } from '@/services/employeeService';
import type { Employee } from '@/types';

type LoadState = { status: 'loading' } | { status: 'missing' } | { status: 'ready'; employee: Employee };

export function EmployeeFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = id !== undefined;
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    employeeService
      .get(id)
      .then((employee) => !cancelled && setState({ status: 'ready', employee }))
      .catch(() => !cancelled && setState({ status: 'missing' }));
    return () => {
      cancelled = true;
    };
  }, [id]);

  const goBack = () => navigate('/employees');

  const handleSubmit = async (values: EmployeeFormValues) => {
    if (id) {
      await employeeService.update(id, values);
      toast.success('Employee updated');
    } else {
      await employeeService.create(values);
      toast.success('Employee added');
    }
    goBack();
  };

  return (
    <>
      <Link to="/employees" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to employees
      </Link>
      <PageHeader
        title={isEdit ? 'Edit employee' : 'Add employee'}
        description={isEdit ? 'Update the details below and save your changes.' : 'Fill in the details to add a new team member.'}
      />
      <Card className="max-w-3xl">
        <CardContent>
          {!isEdit ? (
            <EmployeeForm submitLabel="Add employee" onSubmit={handleSubmit} onCancel={goBack} />
          ) : state.status === 'loading' ? (
            <div className="space-y-4" role="status" aria-label="Loading employee">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          ) : state.status === 'missing' ? (
            <EmptyState
              icon={UserX}
              title="Employee not found"
              description="This employee may have been removed."
              action={
                <Link to="/employees" className={buttonVariants({ variant: 'outline' })}>
                  Back to employees
                </Link>
              }
            />
          ) : (
            <EmployeeForm
              initialValues={state.employee}
              submitLabel="Save changes"
              onSubmit={handleSubmit}
              onCancel={goBack}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
}
