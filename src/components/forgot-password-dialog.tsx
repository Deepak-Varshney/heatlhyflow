'use client';

import { useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AlertCircle, Loader2, Mail, CheckCircle, Lock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function ForgotPasswordDialog() {
  const { isLoaded, signIn } = useSignIn();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'request' | 'verify'>('request');

  const resetState = () => {
    setEmail('');
    setCode('');
    setNewPassword('');
    setError('');
    setSuccess(false);
    setStep('request');
  };

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await signIn?.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });

      setStep('verify');
    } catch (err: any) {
      console.error('Password reset error:', err);
      if (err.errors?.[0]?.message) {
        setError(err.errors[0].message);
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password: newPassword,
      });

      if (result?.status === 'complete') {
        setSuccess(true);
        setTimeout(() => {
          setOpen(false);
          resetState();
        }, 2000);
      } else {
        setError('Unable to complete the reset. Please try again.');
      }
    } catch (err: any) {
      console.error('Password reset verification error:', err);
      if (err.errors?.[0]?.message) {
        setError(err.errors[0].message);
      } else {
        setError('Invalid code or password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetState();
      }}
    >
      <DialogTrigger asChild>
        <button className="text-sm text-primary hover:underline font-medium transition-colors">
          Forgot password?
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-105">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            {step === 'request'
              ? "We'll email you a verification code to reset your password."
              : 'Enter the verification code and choose a new password.'}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={step === 'request' ? handleRequest : handleVerify}
          className="space-y-4"
        >
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Password updated successfully! You can sign in now.
              </AlertDescription>
            </Alert>
          )}

          {step === 'request' ? (
            <div className="space-y-2">
              <label htmlFor="reset-email" className="text-sm font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading || success}
                  required
                  className="pl-10"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2">
                <label htmlFor="reset-code" className="text-sm font-medium">
                  Verification Code
                </label>
                <Input
                  id="reset-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="Enter the 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={loading || success}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="new-password" className="text-sm font-medium">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Create a new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading || success}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep('request')}
                className="text-xs text-muted-foreground underline underline-offset-4 hover:text-primary"
                disabled={loading}
              >
                Use a different email
              </button>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={
              loading ||
              !isLoaded ||
              success ||
              (step === 'request' && !email.trim()) ||
              (step === 'verify' && (!code.trim() || !newPassword.trim()))
            }
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {step === 'request' ? 'Sending...' : 'Updating...'}
              </>
            ) : success ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Done
              </>
            ) : (
              step === 'request' ? 'Send Code' : 'Update Password'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
