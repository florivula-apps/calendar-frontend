import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 bg-background">
      <FileQuestion className="h-20 w-20 text-muted-foreground mb-6" />
      <h1 className="text-3xl font-bold tracking-tight mb-2">
        Page not found
      </h1>
      <p className="text-base text-muted-foreground text-center mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button
        onClick={() => navigate('/home')}
        className="h-12 px-8 text-base font-semibold"
        size="lg"
      >
        Go Home
      </Button>
    </div>
  );
}
