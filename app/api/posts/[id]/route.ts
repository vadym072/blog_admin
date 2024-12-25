import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getPost, updatePost, deletePost } from '@/lib/api/posts';
import { postSchema } from '@/lib/validations/post';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Retrieve a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A post object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const post = await getPost(params.id);
    return NextResponse.json(post);
  } catch (error) {
    console.error('GET /api/posts/[id] error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * @swagger
 * /api/posts/{id}:
 *   patch:
 *     summary: Update a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the post
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               published:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await request.json();
    const body = postSchema.partial().parse(json);

    const post = await updatePost(params.id, body);
    return NextResponse.json(post);
  } catch (error) {
    console.error('PATCH /api/posts/[id] error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the post
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Post deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await deletePost(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('DELETE /api/posts/[id] error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}