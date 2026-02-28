import { useLocation, useNavigate } from 'react-router-dom';
import { Home, List, PlusCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/home', label: 'Home', icon: Home },
  { path: '/items', label: 'Items', icon: List },
  { path: '/create', label: 'Create', icon: PlusCircle },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background pb-safe"
      style={{ height: 'calc(56px + env(safe-area-inset-bottom))' }}
    >
      <div className="flex h-14 items-center justify-around">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== '/home' &&
              location.pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 px-3 py-1 touch-target transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground',
              )}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={cn(
                  'h-6 w-6',
                  item.path === '/create' && 'h-7 w-7',
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-[10px] font-medium leading-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
