'use client';

import { Moon, Sun, Palette } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useThemeConfig } from '@/components/active-theme';
import Link from 'next/link';

const THEME_COLORS = [
  { name: 'Cyan', value: 'cyan' },
  { name: 'Rose Gold', value: 'rosegold' },
  { name: 'Blue', value: 'blue' },
  { name: 'Amber', value: 'amber' },
  { name: 'Purple', value: 'purple' },
  { name: 'Fuchsia', value: 'fuchsia' }
];

export function PublicHeader() {
  const { theme, setTheme } = useTheme();
  const { activeTheme, setActiveTheme } = useThemeConfig();

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
            HF
          </div>
          <span className="hidden sm:inline">HealthyFlow</span>
        </Link>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Theme Color Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Palette className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Theme Color</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {THEME_COLORS.map((themeColor) => (
                  <DropdownMenuItem
                    key={themeColor.value}
                    onClick={() => setActiveTheme(themeColor.value)}
                    className={activeTheme === themeColor.value ? 'bg-accent' : ''}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border-2 border-foreground/30"
                        style={{
                          backgroundColor: `hsl(var(--primary))`,
                        }}
                      />
                      <span>{themeColor.name}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

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

          {/* Sign In Button */}
          <Link href="/auth/sign-in">
            <Button size="sm">Sign In</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
