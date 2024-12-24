import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getPosts, createPost } from '@/lib/api/posts';
import { postSchema } from '@/lib/validations/post';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API for managing posts
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Retrieve a list of posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: A list of posts
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export async function GET(request: Request) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return new NextResponse('Unauthorized', { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');

    const { posts, total } = await getPosts(page, limit);
    return NextResponse.json({ posts, total });
  } catch (error) {
    console.error('GET /api/posts error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
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
 *       201:
 *         description: Post created successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
export async function POST(request: Request) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return new NextResponse('Unauthorized', { status: 401 });
    // }

    const json = await request.json();
    const body = postSchema.parse(json);

    const post = await createPost({
      ...body,
      image: body.image || null,
      authorId: "cm4x3a3810000jthj0rftxt94",
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('POST /api/posts error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}