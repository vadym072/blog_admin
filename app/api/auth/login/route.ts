import { verifyCredentials } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const result = await verifyCredentials(email, password);
    
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        message: error instanceof Error ? error.message : 'Authentication failed' 
      }),
      { 
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}