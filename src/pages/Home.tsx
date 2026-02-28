import { useAuth } from '@/hooks/useAuth';
import { useItems } from '@/hooks/useItems';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ItemCard from '@/components/ItemCard';
import FloatingActionButton from '@/components/FloatingActionButton';
import { Activity, Package, CheckCircle, Clock } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const { data, isLoading } = useItems(1, 5);

  const items = data?.data ?? [];

  const stats = {
    total: data?.total ?? 0,
    active: items.filter((i) => i.status === 'active').length,
    pending: items.filter((i) => i.status === 'pending').length,
  };

  return (
    <div className="space-y-6 p-4">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Hi, {user?.name?.split(' ')[0] || 'there'}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Here's what's happening today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {isLoading ? <Skeleton className="h-7 w-8" /> : stats.total}
              </p>
              <p className="text-xs text-muted-foreground">Total Items</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {isLoading ? <Skeleton className="h-7 w-8" /> : stats.active}
              </p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {isLoading ? <Skeleton className="h-7 w-8" /> : stats.pending}
              </p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
              <Activity className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {isLoading ? <Skeleton className="h-7 w-8" /> : items.length}
              </p>
              <p className="text-xs text-muted-foreground">Recent</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Items */}
      <div>
        <CardHeader className="px-0">
          <CardTitle className="text-lg">Recent Items</CardTitle>
        </CardHeader>
        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-3 w-1/4" />
                </CardContent>
              </Card>
            ))
          ) : items.length > 0 ? (
            items.map((item) => <ItemCard key={item.id} item={item} />)
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-base font-medium">No items yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Tap the + button to create your first item
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <FloatingActionButton />
    </div>
  );
}
