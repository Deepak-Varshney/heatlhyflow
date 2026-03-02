'use client';

import { useSearchParams } from 'next/navigation';
import { AlertTriangle, Lock, XCircle, Building2 } from 'lucide-react';
import Link from 'next/link';
import { PublicHeader } from '@/components/public-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function AccessBlockedPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');
  const message = searchParams.get('message');

  const getBlockedPageContent = () => {
    switch (reason) {
      case 'suspended':
        return {
          icon: Lock,
          title: 'Account Suspended',
          description: message || 'Your account has been temporarily suspended.',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          message:
            'This action was taken by our system administrators. If you believe this is a mistake, please contact support.',
          actionText: 'Contact Support',
        };
      case 'org-disabled':
        return {
          icon: Building2,
          title: 'Organization Disabled',
          description: message || 'Your organization has been disabled and is no longer accessible.',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          message:
            'Contact your organization administrator or our support team for more information.',
          actionText: 'Contact Support',
        };
      case 'inactive':
        return {
          icon: XCircle,
          title: 'Account Inactive',
          description: message || 'Your account has been marked as inactive.',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          message: 'Please contact our support team to reactivate your account.',
          actionText: 'Contact Support',
        };
      default:
        return {
          icon: AlertTriangle,
          title: 'Access Denied',
          description: 'You do not have permission to access this resource.',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          message: 'If you believe this is an error, please reach out to our support team.',
          actionText: 'Contact Support',
        };
    }
  };

  const content = getBlockedPageContent();
  const IconComponent = content.icon;

  return (
    <div className="min-h-screen bg-muted/20">
      <PublicHeader />
      <main className="min-h-[calc(100vh-3.5rem)]">
        <section className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-16">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="space-y-4 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted">
                <IconComponent className="size-7 text-destructive" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-2xl tracking-tight">{content.title}</CardTitle>
                <CardDescription className="text-base">{content.description}</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <Alert>
                <AlertTitle>Why this happened</AlertTitle>
                <AlertDescription>{message || content.message}</AlertDescription>
              </Alert>

              <div className="rounded-lg border bg-card p-4">
                <p className="text-sm font-medium">Recommended next steps</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  <li>Contact your organization administrator to verify account access.</li>
                  <li>Reach support if your access status should be active.</li>
                </ul>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild className="w-full sm:w-auto">
                  <a href="mailto:support@healthyflow.com?subject=Access%20Blocked%20Support%20Request">
                    {content.actionText}
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link href="/">Go to Home</Link>
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                <span>Issue Code</span>
                <Badge variant="secondary">{reason || 'ACCESS_DENIED'}</Badge>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
