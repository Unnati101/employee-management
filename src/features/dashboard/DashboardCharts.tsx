import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import type { DashboardStats } from '@/lib/stats';

const PRIMARY = '#6366f1';
const STATUS_COLORS: Record<string, string> = {
  Active: '#10b981',
  'On Leave': '#f59e0b',
  Inactive: '#94a3b8',
};

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '0.75rem',
  color: 'hsl(var(--foreground))',
  boxShadow: '0 8px 24px -8px rgb(0 0 0 / 0.2)',
};

export function HiresChart({ data }: { data: DashboardStats['hiresByMonth'] }) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Hiring trend</CardTitle>
        <CardDescription>New hires over the last 12 months</CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="hiresFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={PRIMARY} stopOpacity={0.35} />
                <stop offset="100%" stopColor={PRIMARY} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="hires" name="Hires" stroke={PRIMARY} strokeWidth={2.5} fill="url(#hiresFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function StatusChart({ data }: { data: DashboardStats['byStatus'] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workforce status</CardTitle>
        <CardDescription>Current employment status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3} stroke="none">
                {data.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="mt-2 space-y-2">
          {data.map((entry) => (
            <li key={entry.name} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[entry.name] }} aria-hidden />
                {entry.name}
              </span>
              <span className="font-medium">{entry.value}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function DepartmentChart({ data }: { data: DashboardStats['byDepartment'] }) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Headcount by department</CardTitle>
        <CardDescription>Employees per team</CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} interval={0} tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(var(--muted))' }} />
            <Bar dataKey="count" name="Employees" fill={PRIMARY} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
