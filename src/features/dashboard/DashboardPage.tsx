import { CalendarPlus, Palmtree, Plus, UserCheck, Users } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '@/components/ui/Avatar';
import { Button, buttonVariants } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/context/AuthContext';
import { DepartmentChart, HiresChart, StatusChart } from '@/features/dashboard/DashboardCharts';
import { StatCard } from '@/features/dashboard/StatCard';
import { useEmployees } from '@/hooks/useEmployees';
import { formatDate } from '@/lib/format';
import { computeStats } from '@/lib/stats';

export function DashboardPage() {
  const { user } = useAuth();
  const { employees, loading, error, reload } = useEmployees();
  const stats = useMemo(() => computeStats(employees), [employees]);
  const recentHires = useMemo(
    () => [...employees].sort((a, b) => b.joinDate.localeCompare(a.joinDate)).slice(0, 5),
    [employees],
  );
  const firstName = user?.name.split(' ')[0] ?? 'there';

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${firstName}. Here is how your team looks today.`}
        actions={
          <Link to="/employees/new" className={buttonVariants()}>
            <Plus className="h-4 w-4" aria-hidden />
            Add employee
          </Link>
        }
      />

      {error ? (
        <Card className="p-6 text-center" role="alert">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => void reload()}>
            Try again
          </Button>
        </Card>
      ) : (
        <>
          <section aria-label="Employee statistics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total employees" value={stats.total} hint="Across all departments" icon={Users} loading={loading} />
            <StatCard label="Active" value={stats.active} hint="Currently working" icon={UserCheck} loading={loading} />
            <StatCard label="On leave" value={stats.onLeave} hint="Temporarily away" icon={Palmtree} loading={loading} />
            <StatCard label="New hires" value={stats.newHires} hint="Joined in the last 90 days" icon={CalendarPlus} loading={loading} />
          </section>

          <section aria-label="Charts" className="mt-6 grid gap-6 lg:grid-cols-3">
            {loading ? (
              <>
                <Skeleton className="h-96 lg:col-span-2" />
                <Skeleton className="h-96" />
                <Skeleton className="h-96 lg:col-span-2" />
              </>
            ) : (
              <>
                <HiresChart data={stats.hiresByMonth} />
                <StatusChart data={stats.byStatus} />
                <DepartmentChart data={stats.byDepartment} />
              </>
            )}
            <Card>
              <CardHeader>
                <CardTitle>Recent hires</CardTitle>
                <CardDescription>Latest people to join</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Skeleton key={i} className="h-12" />
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {recentHires.map((employee) => {
                      const name = `${employee.firstName} ${employee.lastName}`;
                      return (
                        <li key={employee.id} className="flex items-center gap-3">
                          <Avatar name={name} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{name}</p>
                            <p className="truncate text-xs text-muted-foreground">{employee.role}</p>
                          </div>
                          <span className="shrink-0 text-xs text-muted-foreground">{formatDate(employee.joinDate)}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>
          </section>
        </>
      )}
    </>
  );
}
