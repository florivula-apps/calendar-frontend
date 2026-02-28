import { useState, useCallback } from 'react';
import { useItems } from '@/hooks/useItems';
import { useQueryClient } from '@tanstack/react-query';
import ItemCard from '@/components/ItemCard';
import FloatingActionButton from '@/components/FloatingActionButton';
import PullToRefresh from '@/components/PullToRefresh';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Package, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Item } from '@/types';

const statusFilters = ['all', 'active', 'inactive', 'pending', 'archived'] as const;

export default function Items() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const { data, isLoading, refetch } = useItems(1, 50);
  const queryClient = useQueryClient();

  const items = data?.data ?? [];

  // Filter items based on search and status
  const filteredItems = items.filter((item: Item) => {
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === 'all' || item.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleRefresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['items'] });
    await refetch();
  }, [queryClient, refetch]);

  return (
    <PullToRefresh onRefresh={handleRefresh} className="h-full">
      <div className="space-y-4 p-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {statusFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className="touch-target"
            >
              <Badge
                variant={activeFilter === filter ? 'default' : 'outline'}
                className={cn(
                  'capitalize whitespace-nowrap px-3 py-1.5 text-sm cursor-pointer',
                  activeFilter === filter && 'bg-primary text-primary-foreground',
                )}
              >
                {filter}
              </Badge>
            </button>
          ))}
        </div>

        {/* Item List */}
        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-3 w-1/3" />
                </CardContent>
              </Card>
            ))
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item: Item) => (
              <ItemCard key={item.id} item={item} />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Package className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-base font-medium">
                  {searchQuery || activeFilter !== 'all'
                    ? 'No matching items'
                    : 'No items yet'}
                </p>
                <p className="text-sm text-muted-foreground mt-1 text-center">
                  {searchQuery || activeFilter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Tap the + button to create your first item'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results count */}
        {!isLoading && filteredItems.length > 0 && (
          <p className="text-center text-xs text-muted-foreground pb-4">
            Showing {filteredItems.length} of {items.length} items
          </p>
        )}
      </div>

      <FloatingActionButton />
    </PullToRefresh>
  );
}
