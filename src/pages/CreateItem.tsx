import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateItem } from '@/hooks/useItems';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Loader2, X } from 'lucide-react';
import type { Item } from '@/types';

const statusOptions: Item['status'][] = ['active', 'inactive', 'pending', 'archived'];

export default function CreateItem() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Item['status']>('active');
  const [category, setCategory] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const navigate = useNavigate();
  const { toast } = useToast();
  const createItem = useCreateItem();

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter a name for the item.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createItem.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        status,
        category: category.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
      });
      toast({
        title: 'Item created',
        description: 'Your new item has been created successfully.',
      });
      navigate('/items', { replace: true });
    } catch {
      toast({
        title: 'Creation failed',
        description: 'Could not create the item. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Enter item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Describe your item..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Status</Label>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setStatus(option)}
                className="touch-target"
              >
                <Badge
                  variant={status === option ? 'default' : 'outline'}
                  className={cn(
                    'capitalize px-4 py-2 text-sm cursor-pointer',
                    status === option && 'bg-primary text-primary-foreground',
                  )}
                >
                  {option}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium">
            Category
          </Label>
          <Input
            id="category"
            placeholder="e.g., Work, Personal, Urgent"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label htmlFor="tags" className="text-sm font-medium">
            Tags
          </Label>
          <div className="flex gap-2">
            <Input
              id="tags"
              placeholder="Add a tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              className="h-12 px-4"
              onClick={handleAddTag}
              disabled={!tagInput.trim()}
            >
              Add
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1.5 text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 rounded-full active:bg-accent"
                    aria-label={`Remove ${tag} tag`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="pt-2 pb-4">
          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold"
            size="lg"
            disabled={createItem.isPending}
          >
            {createItem.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Item'
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full h-12 mt-2 text-base"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
