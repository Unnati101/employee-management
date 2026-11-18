import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/format';

const GRADIENTS = [
  'from-indigo-500 to-violet-500',
  'from-sky-500 to-indigo-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-rose-500',
  'from-fuchsia-500 to-purple-500',
  'from-rose-500 to-orange-500',
];

function gradientFor(name: string) {
  const hash = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return GRADIENTS[hash % GRADIENTS.length];
}

interface AvatarProps {
  name: string;
  className?: string;
}

export function Avatar({ name, className }: AvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold text-white shadow-sm',
        gradientFor(name),
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
}
