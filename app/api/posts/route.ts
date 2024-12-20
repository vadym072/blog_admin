import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getPosts, createPost } from '@/lib/api/posts';
import { postSchema } from '@/lib/validations/post';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');

    const { posts, total } = await getPosts(session.user.id, page, limit);
    return NextResponse.json({ posts, total });
  } catch (error) {
    console.error('GET /api/posts error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await request.json();
    const body = postSchema.parse(json);

    const post = await createPost({
      ...body,
      image: body.image || null,
      authorId: session.user.id,
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('POST /api/posts error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}