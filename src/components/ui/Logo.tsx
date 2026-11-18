import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-500 text-white shadow-md">
        <Sparkles className="h-5 w-5" aria-hidden />
      </span>
      <span className="whitespace-nowrap font-display text-xl font-semibold tracking-tight">Aurelia HR</span>
    </div>
  );
}
