export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'DOCTOR' | 'RECEPTIONIST' | 'UNASSIGNED' | 'DEVIL';

export const PERMISSIONS = {
  superadmin: {
    canDeletePermanently: true,
    canManageUsers: true,
    canManageOrganizations: true,
    canManageAppointments: true,
    canManagePatients: true,
  },
  doctor: {
    canDeletePermanently: false,
    canManageUsers: false,
    canManageOrganizations: false,
    canManageAppointments: true,
    canManagePatients: true,
  },
  receptionist: {
    canDeletePermanently: false,
    canManageUsers: false,
    canManageOrganizations: false,
    canManageAppointments: true,
    canManagePatients: true,
  },
};

export function isSuperadmin(role?: string): boolean {
  return role === 'SUPERADMIN' || role === 'DEVIL';
}

export function isDoctor(role?: string): boolean {
  return role === 'DOCTOR';
}

export function isReceptionist(role?: string): boolean {
  return role === 'RECEPTIONIST';
}
