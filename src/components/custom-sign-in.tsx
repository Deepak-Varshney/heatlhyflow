'use client';

import { useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { AlertCircle, Loader2, Mail, Lock, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ForgotPasswordDialog } from '@/components/forgot-password-dialog';

export function CustomSignIn() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    setError('');

    try {
      const result = await signIn.create({
        strategy: 'password',
        identifier: email,
        password: password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/dashboard');
      } else if (result.status === 'needs_identifier') {
        setError('Please enter a valid email');
      } else {
        setError('Sign in failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      if (err.errors?.[0]?.message) {
        setError(err.errors[0].message);
      } else {
        setError('Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Card className="border-0 shadow-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur">
        <CardHeader className="space-y-3 pb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
              <span className="font-bold">HF</span>
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, var(--primary), #06b6d4)' }}>
              HealthyFlow
            </CardTitle>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Welcome Back</p>
            <CardDescription className="text-sm">
              Sign in to access your healthcare dashboard
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert variant="destructive" className="animate-in fade-in">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4" style={{ color: 'var(--primary)' }} />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="pl-10 h-11 border-2 border-gray-200 dark:border-gray-700 transition-all dark:bg-slate-800 dark:text-white"
                  style={{ '--tw-ring-color': 'var(--primary)' } as any}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = ''}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Password
                </label>
                <ForgotPasswordDialog />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4" style={{ color: 'var(--primary)' }} />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="pl-10 h-11 border-2 border-gray-200 dark:border-gray-700 transition-all dark:bg-slate-800 dark:text-white"
                  style={{ '--tw-ring-color': 'var(--primary)' } as any}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = ''}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-white font-semibold shadow-md hover:shadow-lg transition-all"
              style={{ backgroundColor: 'var(--primary)' }}
              disabled={loading || !isLoaded}
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-7 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white dark:bg-slate-900 px-2 text-gray-500 dark:text-gray-400 font-medium">
                  New to HealthyFlow?
                </span>
              </div>
            </div>

            <Link href="/onboarding">
              <Button 
                variant="outline" 
                className="w-full h-11 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold transition-all"
                style={{ borderColor: 'var(--primary)', '--hover-bg': 'var(--primary)' } as any}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--primary) 5%, transparent)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                size="lg"
              >
                Request Access
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-5">
            By signing in, you agree to our{' '}
            <Link href="#" className="hover:underline font-medium" style={{ color: 'var(--primary)' }}>
              Terms of Service
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
