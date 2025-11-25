import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SignIn as ClerkSignInForm } from '@clerk/nextjs';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image'; // Import the Next.js Image component

export const metadata: Metadata = {
  title: 'Sign In | HealthyFlow',
  description: 'Securely access your HealthyFlow account.'
};

export default function SignInViewPage() {
  return (
    <div className='relative flex min-h-screen flex-col items-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      {/* Replaced the confusing "Login" link with a clear "Sign Up" call to action */}
      <Link
        href='/auth/sign-up' // Point this to your actual sign-up page
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute top-4 right-4 z-10 text-white hover:bg-white/20 hover:text-white md:top-8 md:right-8' // Added text-white for visibility
        )}
      >
        Sign Up
      </Link>

      {/* Left Panel: The Branding Side */}
      <div className='relative hidden h-full flex-col bg-muted p-10 text-white lg:flex'>
        {/* Using a high-quality, relevant background image */}
        <div className='absolute inset-0'>
          <Image
            src='/logo.png'
            alt='A healthcare professional assisting a patient'
            fill
            style={{ objectFit: 'cover' }}
          />
          {/* A calming blue overlay to ensure text is readable */}
          <div className='absolute inset-0 bg-primary opacity-60' />
        </div>

        <div className='relative z-20 flex items-center text-lg font-medium'>
          {/* A more fitting logo for a healthcare app (e.g., a medical cross) */}
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='mr-2 h-6 w-6'
          >
            <path d='M12 5v14M5 12h14' /> {/* Simple Plus/Cross Icon */}
          </svg>
          HealthyFlow
        </div>

        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-xl'>
              &ldquo;Welcome to a smarter, simpler way to manage your health.
              Secure, streamlined, and always accessible.&rdquo;
            </p>
            <footer className='text-sm'>The HealthyFlow Team</footer>
          </blockquote>
        </div>
      </div>

      {/* Right Panel: The Form Side */}
      {/* Added min-h-screen for small screens and overflow-y-auto for scrollability */}
      <div className='flex min-h-screen flex-col items-center justify-center p-4 lg:p-8 bg-white lg:min-h-0 lg:h-full overflow-y-auto'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] flex-grow'> {/* Added flex-grow */}
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Welcome Back
            </h1>
            <p className='text-muted-foreground text-sm'>
              Enter your credentials to access your account
            </p>
          </div>

          <ClerkSignInForm />

          <p className='text-muted-foreground px-8 text-center text-sm'>
            By continuing, you agree to our{' '}
            <Link
              href='/terms'
              className='hover:text-primary underline underline-offset-4'
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href='/privacy'
              className='hover:text-primary underline underline-offset-4'
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}