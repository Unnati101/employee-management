import { Menu } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { useAuth } from '@/context/AuthContext';

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur sm:px-6 lg:px-8">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick} aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </Button>
      <Logo className="lg:hidden" />
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        {user && (
          <div className="hidden items-center gap-2 sm:flex">
            <Avatar name={user.name} className="h-9 w-9" />
            <span className="text-sm font-medium">{user.name}</span>
          </div>
        )}
      </div>
    </header>
  );
}
