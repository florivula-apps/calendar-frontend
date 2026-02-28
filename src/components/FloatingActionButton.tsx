import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  to?: string;
  onClick?: () => void;
  className?: string;
}

export default function FloatingActionButton({
  to = '/create',
  onClick,
  className,
}: FloatingActionButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(to);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'fixed z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg active:scale-95 transition-transform',
        'bottom-[calc(56px+env(safe-area-inset-bottom)+16px)] right-4',
        className,
      )}
      aria-label="Create new item"
    >
      <Plus className="h-6 w-6" strokeWidth={2.5} />
    </button>
  );
}
