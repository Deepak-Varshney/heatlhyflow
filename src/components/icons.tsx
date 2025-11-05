import {
  IconAlertTriangle,
  IconArrowRight,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconCommand,
  IconCreditCard,
  IconFile,
  IconFileText,
  IconHelpCircle,
  IconPhoto,
  IconDeviceLaptop,
  IconLayoutDashboard,
  IconLoader2,
  IconLogin,
  IconProps,
  IconShoppingBag,
  IconMoon,
  IconDotsVertical,
  IconPizza,
  IconPlus,
  IconSettings,
  IconSun,
  IconTrash,
  IconBrandTwitter,
  IconUser,
  IconUserCircle,
  IconUserEdit,
  IconUserX,
  IconX,
  IconLayoutKanban,
  IconBrandGithub,
  IconEyeDiscount,
  // --- New Imports for Navigation ---
  IconUsers,          // For Patients and Users
  IconCalendarCheck,  // For Appointments
  IconBuildingHospital, // For Clinics (Super Admin)
  IconBuilding,       // For Organization
  IconStethoscope,    // An alternative for medical/doctor
  IconUserCog,        // For Profile/Account
  IconHospital,       // Another option for Clinics
  IconMan,            // A general user icon for single items
} from '@tabler/icons-react';

export type Icon = React.ComponentType<IconProps>;

export const Icons = {
  dashboard: IconLayoutDashboard,
  logo: IconCommand,
  login: IconLogin,
  close: IconX,
  product: IconShoppingBag,
  spinner: IconLoader2,
  kanban: IconLayoutKanban,
  chevronLeft: IconChevronLeft,
  chevronRight: IconChevronRight,
  trash: IconTrash,
  employee: IconUserX,
  post: IconFileText,
  page: IconFile, 
  userPen: IconUserCog,          // Updated: Better for 'Profile' (settings/edit)
  user2: IconUserCircle,
  media: IconPhoto,
  settings: IconSettings,
  billing: IconCreditCard,
  ellipsis: IconDotsVertical,
  add: IconPlus,
  warning: IconAlertTriangle,
  user: IconUser,
  arrowRight: IconArrowRight,
  help: IconHelpCircle,
  pizza: IconPizza,
  sun: IconSun,
  moon: IconMoon,
  laptop: IconDeviceLaptop,
  github: IconBrandGithub,
  twitter: IconBrandTwitter,
  check: IconCheck,
  doctor:IconEyeDiscount,
  // --- Navigation-Specific Icons (Replaced/Added) ---
  patient: IconUsers,             // Updated: Use 'Users' for a list of patients
  patients: IconUsers,            // Added: Alias for clarity
  appointments: IconCalendarCheck, // Added: Specific for appointments
  organization: IconBuilding,      // Added: Specific for organization/client management
  profile: IconUserCog,            // Added: Specific for profile/account settings
  users: IconUsers,                // Added: Specific for general 'Users' list (Super Admin)
  clinics: IconHospital,           // Added: Specific for 'Clinics' (Super Admin)
};