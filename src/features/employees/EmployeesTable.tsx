import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar } from '@/components/ui/Avatar';
import { Button, buttonVariants } from '@/components/ui/Button';
import { StatusBadge } from '@/features/employees/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/format';
import type { SortDirection, SortKey } from '@/lib/employeeFilters';
import { cn } from '@/lib/utils';
import type { Employee } from '@/types';

interface EmployeesTableProps {
  employees: Employee[];
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSort: (key: SortKey) => void;
  onDelete: (employee: Employee) => void;
}

const COLUMNS: { key: SortKey; label: string; className?: string }[] = [
  { key: 'name', label: 'Employee' },
  { key: 'department', label: 'Department' },
  { key: 'status', label: 'Status' },
  { key: 'joinDate', label: 'Joined' },
  { key: 'salary', label: 'Salary', className: 'text-right' },
];

function SortIcon({ active, direction }: { active: boolean; direction: SortDirection }) {
  if (!active) return <ArrowUpDown className="h-3.5 w-3.5 opacity-50" aria-hidden />;
  return direction === 'asc' ? <ArrowUp className="h-3.5 w-3.5" aria-hidden /> : <ArrowDown className="h-3.5 w-3.5" aria-hidden />;
}

function RowActions({ employee, onDelete }: { employee: Employee; onDelete: (employee: Employee) => void }) {
  const name = `${employee.firstName} ${employee.lastName}`;
  return (
    <div className="flex items-center justify-end gap-1">
      <Link to={`/employees/${employee.id}/edit`} className={buttonVariants({ variant: 'ghost', size: 'icon' })} aria-label={`Edit ${name}`}>
        <Pencil className="h-4 w-4" />
      </Link>
      <Button variant="ghost" size="icon" onClick={() => onDelete(employee)} aria-label={`Delete ${name}`} className="hover:text-destructive">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function EmployeesTable({ employees, sortKey, sortDirection, onSort, onDelete }: EmployeesTableProps) {
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
              {COLUMNS.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn('px-5 py-3 font-medium', column.className)}
                  aria-sort={sortKey === column.key ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  <button
                    type="button"
                    onClick={() => onSort(column.key)}
                    className="inline-flex items-center gap-1.5 rounded uppercase tracking-wide hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {column.label}
                    <SortIcon active={sortKey === column.key} direction={sortDirection} />
                  </button>
                </th>
              ))}
              <th scope="col" className="px-5 py-3 text-right font-medium">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {employees.map((employee) => {
              const name = `${employee.firstName} ${employee.lastName}`;
              return (
                <tr key={employee.id} className="transition-colors hover:bg-muted/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={name} />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{name}</p>
                        <p className="truncate text-xs text-muted-foreground">{employee.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">{employee.department}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={employee.status} />
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{formatDate(employee.joinDate)}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{formatCurrency(employee.salary)}</td>
                  <td className="px-5 py-3">
                    <RowActions employee={employee} onDelete={onDelete} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ul className="divide-y md:hidden">
        {employees.map((employee) => {
          const name = `${employee.firstName} ${employee.lastName}`;
          return (
            <li key={employee.id} className="space-y-3 p-4">
              <div className="flex items-center gap-3">
                <Avatar name={name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{name}</p>
                  <p className="truncate text-xs text-muted-foreground">{employee.email}</p>
                </div>
                <RowActions employee={employee} onDelete={onDelete} />
              </div>
              <p className="text-sm">
                {employee.role} &middot; {employee.department}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <StatusBadge status={employee.status} />
                <span>Joined {formatDate(employee.joinDate)}</span>
                <span>{formatCurrency(employee.salary)}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
