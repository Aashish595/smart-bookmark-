'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/browser';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface BookmarkItemProps {
  bookmark: {
    id: string;
    title: string;
    url: string;
    created_at: string;
  };
}

export default function BookmarkItem({ bookmark }: BookmarkItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClient();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmark.id);

      if (error) {
        toast.error('Failed to delete bookmark');
        return;
      }

      toast.success('Bookmark deleted');
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{bookmark.title}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-1">{bookmark.url}</p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1"
          >
            <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-1" />
              Visit
            </a>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
