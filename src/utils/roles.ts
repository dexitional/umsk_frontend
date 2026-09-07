import { useUserStore } from './authService';

// A user's role for a module comes back from the backend shaped as
// { role: "<module>::<level>", app: "<moduleTag>", module: "<moduleTag>" }
// (see authController.ts's role mapping). This file is the single place
// that shape is read from, so module/level names only need to change here.
type UserRole = { role?: string; app?: string; module?: string };

export function getModuleRoles(user: any, app: string): UserRole[] {
  return user?.roles?.filter((r: UserRole) => r?.app?.toLowerCase() === app.toLowerCase()) || [];
}

export function hasAnyRole(moduleRoles: UserRole[] | undefined, allowed: string[]): boolean {
  return !!moduleRoles?.find((r) => allowed.includes(r?.role || ''));
}

// Roles for one module, e.g. const aisRoles = useModuleRoles('ais');
export function useModuleRoles(app: string): UserRole[] {
  const user = useUserStore((state: any) => state.user);
  return getModuleRoles(user, app);
}

// Direct boolean check, e.g. useHasRole('ais', ['student::admin', 'student::clerk'])
export function useHasRole(app: string, allowed: string[]): boolean {
  const moduleRoles = useModuleRoles(app);
  return hasAnyRole(moduleRoles, allowed);
}
