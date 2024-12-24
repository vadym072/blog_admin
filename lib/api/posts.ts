import { prisma } from '@/lib/db';
import type { Post } from '@prisma/client';

export async function getPosts(page = 1, limit = 6) {
  try {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.post.count(),
    ]);

    return { posts, total };
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Failed to fetch posts');
  }
}

export async function createPost(data: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    return await prisma.post.create({ data });
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('Failed to create post');
  }
}

export async function getPost(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id }
    });
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  } catch (error) {
    console.error('Error updating post:', error);
    throw new Error('Failed to update post');
  }
}

export async function updatePost(id: string, data: Partial<Post>) {
  try {
    return await prisma.post.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error('Error updating post:', error);
    throw new Error('Failed to update post');
  }
}

export async function deletePost(id: string) {
  try {
    return await prisma.post.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    throw new Error('Failed to delete post');
  }
}