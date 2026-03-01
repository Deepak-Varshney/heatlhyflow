'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';
import PageContainer from '@/components/layout/page-container';

export default function NotFound() {
  const router = useRouter();

  return (
   <PageContainer scrollable>
     <div className="w-full min-h-screen flex flex-col">
      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-2xl">
          {/* Error Card */}
          <Card className="border-0 shadow-lg bg-linear-to-br from-card to-card/80">
            <CardHeader className="text-center pb-8">
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-destructive/10 blur-2xl rounded-full"></div>
                  <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-destructive/5 border-2 border-destructive/20">
                    <AlertCircle className="w-12 h-12 text-destructive" />
                  </div>
                </div>
              </div>

              {/* Status Code */}
              <div className="mb-4">
                <h1 className="text-5xl md:text-6xl font-black text-foreground mb-2">
                  404
                </h1>
                <div className="h-1 w-24 bg-linear-to-r from-destructive to-orange-500 mx-auto rounded-full"></div>
              </div>

              {/* Title & Description */}
              <CardTitle className="text-2xl md:text-3xl mb-3">
                Page Not Found
              </CardTitle>
              <CardDescription className="text-sm max-w-lg mx-auto">
                The page you're looking for doesn't exist or may have been moved. Let's get you back on the right track.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Action Buttons */}
              <div className="grid sm:grid-cols-2 gap-3">
                <Button
                  onClick={() => router.back()}
                  variant="default"
                  size="lg"
                  className="flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Go Back
                </Button>

                <Button
                  onClick={() => router.push('/dashboard')}
                  variant="outline"
                  size="lg"
                  className="flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Back to Dashboard
                </Button>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">What went wrong?</span>
                </div>
              </div>

              {/* Troubleshooting Section */}
              <div className="bg-muted/30 rounded-lg p-6 space-y-3">
                <h3 className="font-semibold text-foreground mb-4">Common reasons:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="text-destructive font-bold mt-1">•</span>
                    <span className="text-sm text-muted-foreground">The URL may have been typed incorrectly</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-destructive font-bold mt-1">•</span>
                    <span className="text-sm text-muted-foreground">The page may have been removed or relocated</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-destructive font-bold mt-1">•</span>
                    <span className="text-sm text-muted-foreground">You may not have permission to access this page</span>
                  </li>
                </ul>
              </div>

              {/* Footer Help Text */}
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Error Reference: <code className="bg-muted px-2 py-1 rounded">404-NOT-FOUND</code>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
   </PageContainer>
  );
}
