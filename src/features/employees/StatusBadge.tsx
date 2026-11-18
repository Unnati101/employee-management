import { Badge } from '@/components/ui/Badge';
import type { EmployeeStatus } from '@/types';

const VARIANTS = {
  Active: 'success',
  'On Leave': 'warning',
  Inactive: 'muted',
} as const;

export function StatusBadge({ status }: { status: EmployeeStatus }) {
  return (
    <Badge variant={VARIANTS[status]}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {status}
    </Badge>
  );
}
