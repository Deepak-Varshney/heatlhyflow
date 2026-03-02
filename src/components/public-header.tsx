'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { SignOutButton, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeSelector } from '@/components/theme-selector';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function PublicHeader() {
  const { theme, setTheme } = useTheme();
  const { user, isLoaded } = useUser();

  const displayName = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User';
  const email = user?.emailAddresses?.[0]?.emailAddress || '';

  return (
    <header className="px-4 sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
            HF
          </div>
          <span className="hidden sm:inline">HealthyFlow</span>
        </Link>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Theme Selector */}
          <ThemeSelector />

          {/* Dark Mode Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auth Controls */}
          {isLoaded && user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 rounded-md border px-2 py-1">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={user.imageUrl} alt={displayName} />
                  <AvatarFallback>{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="max-w-45 leading-tight">
                  <p className="truncate text-xs font-medium">{displayName}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{email}</p>
                </div>
              </div>
              <SignOutButton redirectUrl="/">
                <Button size="sm" variant="outline">Sign Out</Button>
              </SignOutButton>
            </div>
          ) : (
            <Link href="/auth/sign-in">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
