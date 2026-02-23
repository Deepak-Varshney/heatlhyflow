import { NavItem } from '@/types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Patients',
    url: '/dashboard/patients',
    icon: 'patient',
    shortcut: ['p', 'p'],
    isActive: false,
    items: []
  },
  {
    title: 'Appointments',
    url: '/dashboard/appointments',
    icon: 'appointments',
    shortcut: ['a', 'a'],
    isActive: false,
    items: []
  },
  {
    title: 'Organization',
    url: '/dashboard/organization',
    icon: 'organization',
    shortcut: ['o', 'o'],
    isActive: false,
    items: []
  },
  {
    title: 'Account',
    url: '#',
    icon: 'user2',
    isActive: true,
    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Login',
        shortcut: ['l', 'l'],
        url: '/',
        icon: 'login'
      }
    ]
  }
];
export const superAdminNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/superadmin/dashboard',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Users',
    url: '/superadmin/users',
    icon: 'users',
    isActive: false,
    shortcut: ['u', 'u'],
    items: []
  },
  {
    title: 'Clinics',
    url: '/superadmin/clinics',
    icon: 'clinics',
    isActive: false,
    shortcut: ['c', 'c'],
    items: []
  },
  {
    title: 'Onboarding Requests',
    url: '/superadmin/join-requests',
    icon: 'page',
    isActive: false,
    shortcut: ['j', 'j'],
    items: []
  },
  {
    title: 'Subscriptions',
    url: '/superadmin/subscriptions',
    icon: 'billing',
    isActive: false,
    shortcut: ['s', 's'],
    items: []
  }
];

export const getNavItemsForRole = (role?: string) => {
  if (role === 'SUPERADMIN' || role === 'DEVIL') {
    return superAdminNavItems;
  }

  if (role === 'ADMIN') {
    return navItems;
  }

  if (role === 'RECEPTIONIST') {
    return navItems.filter((item) => item.title !== 'Organization');
  }

  return navItems;
};
