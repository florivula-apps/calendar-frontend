import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { truncate, formatRelativeTime, getStatusColor } from '@/lib/utils';
import type { Item } from '@/types';

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      className="active:bg-accent/50 transition-colors cursor-pointer"
      onClick={() => navigate(`/items/${item.id}`)}
      role="button"
      tabIndex={0}
      aria-label={`View ${item.name}`}
    >
      <CardContent className="flex items-center gap-3 p-4">
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-base truncate">{item.name}</h3>
            <Badge
              className={getStatusColor(item.status)}
              variant="secondary"
            >
              {item.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-1">
            {truncate(item.description, 80)}
          </p>
          <div className="flex items-center gap-2">
            {item.category && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {item.category}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(item.updatedAt)}
            </span>
          </div>
        </div>

        {/* Chevron */}
        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
      </CardContent>
    </Card>
  );
}
