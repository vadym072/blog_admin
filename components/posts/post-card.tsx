import { Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Post } from '@prisma/client';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface PostCardProps {
  post: Post;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PostCard({ post, onEdit, onDelete }: PostCardProps) {
  const getCategoryColor = (category: string) => {
    const colors = {
      INNOVATIONS: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      TREATMENTS: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      WELL_BEING: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      CARE: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      EDUCATION: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 hover:shadow-lg transition-shadow duration-200 bg-card">
        {post.image && (
          <div className="relative h-48 mb-4 rounded-md overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className={getCategoryColor(post.category)}>
            {post.category.replace('_', ' ')}
          </Badge>
          <Badge variant="outline" className={post.published ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}>
            {post.published ? 'Published' : 'Draft'}
          </Badge>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-card-foreground">{post.title}</h3>
        <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(post.id)}
              className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(post.id)}
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <span className="text-sm text-muted-foreground">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
      </Card>
    </motion.div>
  );
}