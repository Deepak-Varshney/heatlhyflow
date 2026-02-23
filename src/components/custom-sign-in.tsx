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
      <Card className="border-0 shadow-lg bg-white/95 backdrop-blur">
        <CardHeader className="space-y-3 pb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-bold">HF</span>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              HealthyFlow
            </CardTitle>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700">Welcome Back</p>
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
              <label htmlFor="email" className="text-sm font-semibold text-gray-900">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-blue-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="pl-10 h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-semibold text-gray-900">
                  Password
                </label>
                <ForgotPasswordDialog />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-blue-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="pl-10 h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-md hover:shadow-lg transition-all"
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
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-500 font-medium">
                  New to HealthyFlow?
                </span>
              </div>
            </div>

            <Link href="/onboarding">
              <Button 
                variant="outline" 
                className="w-full h-11 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 text-gray-700 font-semibold transition-all"
                size="lg"
              >
                Request Access
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <p className="text-xs text-gray-500 text-center mt-5">
            By signing in, you agree to our{' '}
            <Link href="#" className="text-blue-600 hover:underline font-medium">
              Terms of Service
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
