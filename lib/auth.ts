import { compare } from 'bcryptjs';
import { prisma } from './db';

export async function verifyCredentials(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
      },
    };
  } catch (error) {
    console.error('Auth error:', error);
    throw new Error('Authentication failed');
  }
}