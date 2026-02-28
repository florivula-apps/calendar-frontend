import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  className?: string;
}

const pageTitles: Record<string, string> = {
  '/home': 'Home',
  '/items': 'Items',
  '/create': 'Create Item',
  '/profile': 'Profile',
};

export default function MobileHeader({
  title,
  showBack,
  rightAction,
  className,
}: MobileHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const displayTitle = title || pageTitles[location.pathname] || 'App';
  const shouldShowBack =
    showBack ??
    !['/home', '/items', '/profile'].includes(location.pathname);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 flex h-12 items-center border-b bg-background px-2 pt-safe',
        className,
      )}
    >
      <div className="flex h-full w-full items-center">
        {/* Left section */}
        <div className="flex w-12 items-center justify-center">
          {shouldShowBack && (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center touch-target rounded-full active:bg-accent"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Title */}
        <div className="flex-1 text-center">
          <h1 className="text-base font-semibold truncate">{displayTitle}</h1>
        </div>

        {/* Right section */}
        <div className="flex w-12 items-center justify-center">
          {rightAction || (
            <button
              className="flex items-center justify-center touch-target rounded-full active:bg-accent opacity-0 pointer-events-none"
              aria-hidden
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
