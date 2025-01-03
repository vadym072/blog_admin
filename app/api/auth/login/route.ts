import { verifyCredentials } from '@/lib/auth';
import { sign } from 'jsonwebtoken';
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API for authentication
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const result = await verifyCredentials(email, password);

    const token = sign({ id: result.user.id, email: result.user.email }, "secret-key", { expiresIn: "1h" })
    
    return new Response(JSON.stringify({...result, token}), {
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