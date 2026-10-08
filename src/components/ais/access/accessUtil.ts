// Shared bits for the Access Control (user roles) screens. The catalogue is
// App > Module > Role, a role's tag is `module::role`, and a person holds at
// most one role per module.
const { REACT_APP_API_URL } = import.meta.env;

export type Holder = { userRoleId: number; tag: string; name?: string; groupId?: number; assignedAt?: string };
export type CatalogRole = { id: number; title: string; description?: string; role: string; holders: Holder[] };
export type CatalogModule = { id: number; tag: string; title: string; description?: string; roles: CatalogRole[] };
export type CatalogApp = { tag: string; title: string; modules: CatalogModule[] };
export type HeldRole = { userRoleId: number; roleId: number; role?: string; title?: string; module?: string; moduleTitle?: string; app?: string; active?: boolean; note?: string; assignedAt?: string };
export type AccessPerson = { tag: string; name?: string; detail?: string; unit?: string; groupId?: number | null; hasAccount?: boolean; roles: HeldRole[] };
export type Overview = { apps: CatalogApp[]; users: AccessPerson[] };

export const STUDENT_GROUP = 1;

export const photoUrl = (tag?: string) => `${REACT_APP_API_URL}/auth/photos/?tag=${encodeURIComponent(tag || "")}`;

export const initials = (name?: string, tag?: string) =>
  (name || tag || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

export const titleCase = (s?: string) => (s || "").replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// roleId -> where it sits in the catalogue.
export function indexCatalog(apps: CatalogApp[]) {
  const roles = new Map<number, { app: CatalogApp; module: CatalogModule; role: CatalogRole }>();
  for (const app of apps || []) for (const module of app.modules) for (const role of module.roles) roles.set(role.id, { app, module, role });
  return roles;
}
