import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Post } from '@prisma/client';

const POSTS_PER_PAGE = 6;

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const { toast } = useToast();

  const fetchPosts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts?page=${page}&limit=${POSTS_PER_PAGE}`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data.posts);
      setTotalPosts(data.total);
      setCurrentPage(page);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch posts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const getPost = async (id: string) => {
    const response = await fetch(`/api/posts/${id}`);
    if (!response.ok) throw new Error('Failed to fetch post');
    return response.json();
  };

  const createPost = async (data: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create post');
      await fetchPosts(1); // Reset to first page after creating
    } catch (error) {
      throw error;
    }
  };

  const updatePost = async (id: string, data: Partial<Post>) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update post');
      await fetchPosts(currentPage);
    } catch (error) {
      throw error;
    }
  };

  const deletePost = async (id: string) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete post');
      await fetchPosts(posts.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage);
    } catch (error) {
      throw error;
    }
  };

  return {
    posts,
    loading,
    currentPage,
    totalPages,
    fetchPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
  };
}