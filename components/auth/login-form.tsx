'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error('Invalid credentials');
      }

      if (result?.ok) {
        toast({
          title: 'Success',
          description: 'Welcome back!',
        });
        
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Login failed',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-background/95 backdrop-blur-sm p-8 rounded-lg shadow-2xl max-w-md mx-auto"
    >
      <div className="flex justify-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="p-4 bg-indigo-600 dark:bg-indigo-500 rounded-full shadow-lg"
        >
          <Lock className="w-8 h-8 text-white" />
        </motion.div>
      </div>
      <h2 className="text-3xl font-bold text-center mb-2 text-foreground">Dr Emmanuel Elard</h2>
      <p className="text-center text-muted-foreground mb-8">Sign in to manage your blog</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-12"
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full h-12"
            disabled={loading}
          />
        </div>
        <Button
          type="submit"
          className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors"
          disabled={loading}
        >
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center space-x-2"
            >
              <span className="inline-block w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
              <span>Signing in...</span>
            </motion.div>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>
    </motion.div>
  );
}