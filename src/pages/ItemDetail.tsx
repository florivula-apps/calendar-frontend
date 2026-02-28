import { useParams, useNavigate } from 'react-router-dom';
import { useItem, useDeleteItem } from '@/hooks/useItems';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Calendar,
  Tag,
  FolderOpen,
  Trash2,
  Edit,
  MoreVertical,
  Loader2,
} from 'lucide-react';
import { formatDate, getStatusColor } from '@/lib/utils';

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: item, isLoading } = useItem(id!);
  const deleteItem = useDeleteItem();

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteItem.mutateAsync(id);
      toast({
        title: 'Item deleted',
        description: 'The item has been successfully deleted.',
      });
      navigate('/items', { replace: true });
    } catch {
      toast({
        title: 'Delete failed',
        description: 'Could not delete the item. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-lg font-medium">Item not found</p>
        <p className="text-sm text-muted-foreground mt-1">
          This item may have been deleted or does not exist.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate('/items')}
        >
          Back to Items
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {/* Title and Status */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-bold tracking-tight">{item.name}</h1>
          <Drawer>
            <DrawerTrigger asChild>
              <button className="touch-target flex items-center justify-center rounded-full active:bg-accent">
                <MoreVertical className="h-5 w-5" />
              </button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Actions</DrawerTitle>
                <DrawerDescription>
                  Choose an action for this item
                </DrawerDescription>
              </DrawerHeader>
              <div className="p-4 space-y-2">
                <Button
                  variant="outline"
                  className="w-full h-12 justify-start gap-3 text-base"
                  onClick={() => navigate(`/items/${id}/edit`)}
                >
                  <Edit className="h-5 w-5" />
                  Edit Item
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-12 justify-start gap-3 text-base text-destructive"
                  onClick={handleDelete}
                  disabled={deleteItem.isPending}
                >
                  {deleteItem.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Trash2 className="h-5 w-5" />
                  )}
                  Delete Item
                </Button>
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline" className="h-12">
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
        <Badge className={getStatusColor(item.status)} variant="secondary">
          {item.status}
        </Badge>
      </div>

      <Separator />

      {/* Description */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Description
          </h3>
          <p className="text-base leading-relaxed">
            {item.description || 'No description provided.'}
          </p>
        </CardContent>
      </Card>

      {/* Details */}
      <Card>
        <CardContent className="p-4 space-y-4">
          {item.category && (
            <div className="flex items-center gap-3">
              <FolderOpen className="h-5 w-5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Category</p>
                <p className="text-sm font-medium">{item.category}</p>
              </div>
            </div>
          )}

          {item.tags && item.tags.length > 0 && (
            <div className="flex items-start gap-3">
              <Tag className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Created</p>
              <p className="text-sm font-medium">{formatDate(item.createdAt)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Last Updated</p>
              <p className="text-sm font-medium">{formatDate(item.updatedAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pb-4">
        <Button
          variant="outline"
          className="h-12 text-base"
          onClick={() => navigate(`/items/${id}/edit`)}
        >
          <Edit className="mr-2 h-5 w-5" />
          Edit
        </Button>
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              className="h-12 text-base text-destructive"
            >
              <Trash2 className="mr-2 h-5 w-5" />
              Delete
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Delete Item</DrawerTitle>
              <DrawerDescription>
                Are you sure you want to delete "{item.name}"? This action
                cannot be undone.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button
                variant="destructive"
                className="h-12 text-base"
                onClick={handleDelete}
                disabled={deleteItem.isPending}
              >
                {deleteItem.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Yes, delete item'
                )}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="h-12 text-base">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
