import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';
import { Separator } from '../ui/separator';
import { Breadcrumbs } from '../breadcrumbs';
import SearchInput from '../search-input';
import { UserNav } from './user-nav';
import { ThemeSelector } from '../theme-selector';
import { ModeToggle } from './ThemeToggle/theme-toggle';
import CtaGithub from './cta-github';
import Link from 'next/link';
import { Button } from '../ui/button';
import { User } from 'lucide-react';
import { getMongoUser } from '@/lib/CheckUser';

export default async function Header() {
  const user = await getMongoUser();


  return (
    <header className='flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 h-4' />
        <Breadcrumbs />
      </div>

      <div className='flex items-center gap-2 px-4'>
        {/* Unassigned Role */}
        {user?.role === "UNASSIGNED" && (
          <Link href="/dashboard/onboarding">
            <Button
              variant="outline"
              className="hidden md:inline-flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Complete Profile
            </Button>
            <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
              <User className="h-4 w-4" />
            </Button>
          </Link>
        )}
        <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
          <User className="h-4 w-4" />
        </Button>
        <div className='hidden md:flex'>
          <SearchInput />
        </div>
        <UserNav />
        <ModeToggle />
        <ThemeSelector />
      </div>
    </header>
  );
}
