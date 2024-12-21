'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/posts/post-card';
import { PostDialog } from '@/components/posts/post-dialog';
import { Pagination } from '@/components/ui/pagination';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { usePosts } from '@/hooks/use-posts';
import type { Post } from '@prisma/client';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { status } = useAuth();
  const { posts, loading, currentPage, totalPages, fetchPosts, createPost, updatePost, deletePost } = usePosts();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      fetchPosts(1);
    }
  }, [status]);

  const handleCreate = async (data: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createPost(data);
      toast({
        title: 'Success',
        description: 'Post created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create post',
        variant: 'destructive',
      });
    }
  };

  // const handleEdit = (post: Post) => {
  //   setSelectedPost(post);
  //   setIsDialogOpen(true);
  // };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/posts/${id}`);
  };

  const handleUpdate = async (data: Partial<Post>) => {
    if (!selectedPost) return;
    try {
      await updatePost(selectedPost.id, data);
      toast({
        title: 'Success',
        description: 'Post updated successfully',
      });
      setSelectedPost(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update post',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteClick = (post: Post) => {
    setSelectedPost(post);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPost) return;
    try {
      await deletePost(selectedPost.id);
      toast({
        title: 'Success',
        description: 'Post deleted successfully',
      });
      setSelectedPost(null);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete post',
        variant: 'destructive',
      });
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Blog Posts</h2>
        <Button
          //   onClick={() => {
          //   setSelectedPost(null);
          //   setIsDialogOpen(true);
          // }}

          onClick={() => router.push('/dashboard/posts/create')}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onEdit={() => handleEdit(post.id)}
            onDelete={() => handleDeleteClick(post)}
          />
        ))}
        {posts.length === 0 && !loading && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No posts found. Create your first post!</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => fetchPosts(page)}
        />
      )}

      <PostDialog
        post={selectedPost || undefined}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={selectedPost ? handleUpdate : handleCreate}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}