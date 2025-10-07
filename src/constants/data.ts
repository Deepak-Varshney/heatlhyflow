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
    title: 'Pateints',
    url: '/dashboard/patients',
    icon: 'patient',
    shortcut: ['p', 'p'],
    isActive: false,
    items: []
  },
  {
    title: 'Appopintments',
    url: '/dashboard/appointments',
    icon: 'appointments',
    shortcut: ['a', 'a'],
    isActive: false,
    items: []
  },
  {
    title: 'Organization',
    url: '/dashboard/manage-client',
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
        url: '/profile',
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

export const doctorNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/doctor/dashboard',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Pateints',
    url: '/doctor/patients',
    icon: 'patient',
    shortcut: ['p', 'p'],
    isActive: false,
    items: []
  },
  {
    title: 'Appopintments',
    url: '/doctor/appointments',
    icon: 'appointments',
    shortcut: ['a', 'a'],
    isActive: false,
    items: []
  },
  {
    title: 'Organization',
    url: '/doctor/manage-client',
    icon: 'organization',
    shortcut: ['o', 'o'],
    isActive: false,
    items: []
  },
  {
    title: 'Profile',
    url: '/doctor/profile',
    icon: 'userPen',
    shortcut: ['m', 'm']
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
    title: 'Subscriptions',
    url: '/superadmin/subscriptions',
    icon: 'creditCard',
    isActive: false,
    shortcut: ['s', 's'],
    items: []
  }
];

export const receptionistNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/receptionist/dashboard',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Pateints',
    url: '/receptionist/patients',
    icon: 'patient',
    shortcut: ['p', 'p'],
    isActive: false,
    items: []
  },
  {
    title: 'Appopintments',
    url: '/receptionist/appointments',
    icon: 'appointments',
    shortcut: ['a', 'a'],
    isActive: false,
    items: []
  },
  {
    title: 'Organization',
    url: '/receptionist/manage-client',
    icon: 'organization',
    shortcut: ['o', 'o'],
    isActive: false,
    items: []
  }
];
