import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export async function getSession() {
  return await getServerSession();
}

export async function requireAuth() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }
  
  return session;
}