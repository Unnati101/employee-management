import { ChevronLeft, ChevronRight, Plus, Search, SearchX, UserPlus, X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button, buttonVariants } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Dialog } from '@/components/ui/Dialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/ui/PageHeader';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmployeesTable } from '@/features/employees/EmployeesTable';
import { useEmployees } from '@/hooks/useEmployees';
import { ALL, filterEmployees, sortEmployees, type SortDirection, type SortKey } from '@/lib/employeeFilters';
import { DEPARTMENTS, STATUSES } from '@/lib/constants';
import { employeeService } from '@/services/employeeService';
import type { Employee } from '@/types';

const PAGE_SIZE = 8;

export function EmployeesPage() {
  const { employees, loading, error, reload } = useEmployees();
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<Employee | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtersActive = query !== '' || department !== ALL || status !== ALL;

  const results = useMemo(
    () => sortEmployees(filterEmployees(employees, { query, department, status }), sortKey, sortDirection),
    [employees, query, department, status, sortKey, sortDirection],
  );

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageRows = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const rangeStart = results.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, results.length);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
    setPage(1);
  };

  const clearFilters = () => {
    setQuery('');
    setDepartment(ALL);
    setStatus(ALL);
    setPage(1);
  };

  const closeDialog = useCallback(() => setToDelete(null), []);

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await employeeService.remove(toDelete.id);
      toast.success(`${toDelete.firstName} ${toDelete.lastName} was removed`);
      setToDelete(null);
      await reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not delete employee');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Employees"
        description="Search, filter, and manage everyone on your team."
        actions={
          <Link to="/employees/new" className={buttonVariants()}>
            <Plus className="h-4 w-4" aria-hidden />
            Add employee
          </Link>
        }
      />

      <Card>
        <div className="flex flex-col gap-3 border-b p-4 sm:p-5 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, email, role, or location"
              aria-label="Search employees"
              className="pl-9"
            />
          </div>
          <div className="grid gap-3 min-[480px]:grid-cols-2 lg:flex">
            <Select
              aria-label="Filter by department"
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setPage(1);
              }}
              className="lg:w-48"
            >
              <option value={ALL}>All departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
            <Select
              aria-label="Filter by status"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="lg:w-40"
            >
              <option value={ALL}>All statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </div>
          {filtersActive && (
            <Button variant="ghost" onClick={clearFilters}>
              <X className="h-4 w-4" aria-hidden />
              Clear
            </Button>
          )}
        </div>

        {loading ? (
          <div className="space-y-3 p-5" role="status" aria-label="Loading employees">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-14" />
            ))}
          </div>
        ) : error ? (
          <div className="p-10 text-center" role="alert">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => void reload()}>
              Try again
            </Button>
          </div>
        ) : employees.length === 0 ? (
          <EmptyState
            icon={UserPlus}
            title="No employees yet"
            description="Add your first employee to get started."
            action={
              <Link to="/employees/new" className={buttonVariants()}>
                Add employee
              </Link>
            }
          />
        ) : results.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No matching employees"
            description="Try a different search or clear the filters."
            action={
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <>
            <EmployeesTable
              employees={pageRows}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
              onDelete={setToDelete}
            />
            <nav aria-label="Pagination" className="flex flex-col items-center justify-between gap-3 border-t p-4 sm:flex-row sm:px-5">
              <p className="text-sm text-muted-foreground" aria-live="polite">
                Showing {rangeStart}&ndash;{rangeEnd} of {results.length}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                  Previous
                </Button>
                <span className="px-2 text-sm">
                  Page {currentPage} of {pageCount}
                </span>
                <Button variant="outline" size="sm" onClick={() => setPage(currentPage + 1)} disabled={currentPage === pageCount}>
                  Next
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </Button>
              </div>
            </nav>
          </>
        )}
      </Card>

      <Dialog
        open={toDelete !== null}
        onClose={closeDialog}
        title="Delete employee?"
        description={toDelete ? `${toDelete.firstName} ${toDelete.lastName} will be permanently removed. This cannot be undone.` : undefined}
        footer={
          <>
            <Button variant="outline" onClick={closeDialog} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => void confirmDelete()} loading={deleting}>
              Delete
            </Button>
          </>
        }
      />
    </>
  );
}
