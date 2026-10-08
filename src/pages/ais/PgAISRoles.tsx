import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  HiOutlineChevronDown,
  HiOutlineKey,
  HiOutlineMagnifyingGlass,
  HiOutlinePlus,
  HiOutlineSquares2X2,
  HiOutlineUserGroup,
  HiOutlineXMark,
} from "react-icons/hi2";
import { Link, useLoaderData, useNavigate, useRevalidator } from "react-router-dom";
import StaffPicker, { Avatar } from "../../components/ais/access/StaffPicker";
import { AccessPerson, CatalogModule, CatalogRole, Overview, STUDENT_GROUP, titleCase } from "../../components/ais/access/accessUtil";
import Service from "../../utils/aisService";

// Access Control: who can do what, across the App > Module > Role catalogue.
// "People" lists everyone holding roles; "Modules" lists every role with its
// holders, where people can be added or removed in place. Every change goes
// through the same whole-set save as the person workspace (/ais/roles/:tag).
export async function loader() {
  const overview = await Service.fetchAccessOverview();
  return { overview };
}

function PgAISRoles() {
  const { overview }: any = useLoaderData();
  const { apps = [], users = [] }: Overview = overview || {};
  const [view, setView] = useState<"people" | "modules">("people");
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const term = search.trim().toLowerCase();

  const allModules = apps.flatMap((a) => a.modules);
  const stats = {
    people: users.length,
    assignments: users.reduce((n, u) => n + u.roles.length, 0),
    covered: allModules.filter((m) => m.roles.some((r) => r.holders.length)).length,
    modules: allModules.length,
    students: users.filter((u) => u.groupId === STUDENT_GROUP).length,
  };

  // Assign `role` to a person (replacing any other role they hold in the
  // module) or revoke it, by saving their whole role set.
  const usersByTag = useMemo(() => new Map(users.map((u) => [u.tag, u])), [users]);
  const applyChange = async (tag: string, name: string, module: CatalogModule, role: CatalogRole, grant: boolean) => {
    const current = usersByTag.get(tag)?.roles.map((r) => r.roleId) || [];
    const moduleRoleIds = module.roles.map((r) => r.id);
    const replacing = grant ? module.roles.find((r) => r.id !== role.id && current.includes(r.id)) : null;
    const question = grant
      ? replacing
        ? `${name} already has ${titleCase(replacing.title)} in ${module.title}. Replace it with ${titleCase(role.title)}?`
        : `Give ${name} the ${titleCase(role.title)} role in ${module.title}?`
      : `Remove ${titleCase(role.title)} (${module.title}) from ${name}?`;
    if (!window.confirm(question)) return;
    const next = grant ? [...current.filter((id) => !moduleRoleIds.includes(id)), role.id] : current.filter((id) => id !== role.id);
    try {
      await Service.saveUserAccess(tag, next);
      toast.success(grant ? `${name} now has ${role.role}.` : `${role.role} removed from ${name}.`);
      revalidator.revalidate();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Access could not be saved.", { duration: 8000 });
    }
  };

  const people = users.filter((u) => !term || [u.name, u.tag, u.detail, u.unit, ...u.roles.map((r) => r.role)].some((t) => t?.toLowerCase().includes(term)));

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-5 md:space-y-6 animate-fade-in-up">
      <div className="relative overflow-hidden rounded-xl bg-primary/90 px-5 py-3.5 md:px-7 md:py-4 shadow-md shadow-slate-500/10">
        <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/5 blur-2xl" />
        <div className="relative flex items-center gap-3">
          <span className="flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white/90">
            <HiOutlineKey className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-base md:text-lg font-semibold tracking-wide text-white">Access Control</h1>
            <p className="text-[0.7rem] md:text-xs text-white/60">Assign system roles by person or by module -- one role per module</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="People with access" value={stats.people} />
        <StatCard label="Role assignments" value={stats.assignments} />
        <StatCard label="Modules covered" value={`${stats.covered}/${stats.modules}`} />
        <StatCard label="Student accounts with roles" value={stats.students} warn={stats.students > 0} />
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 md:flex-row md:items-center">
        <div className="flex rounded-lg bg-slate-100 p-1">
          {[
            { key: "people", label: "People", Icon: HiOutlineUserGroup },
            { key: "modules", label: "Modules", Icon: HiOutlineSquares2X2 },
          ].map(({ key, label, Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key as any)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold md:text-sm ${view === key ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 px-3 focus-within:border-primary/40">
          <HiOutlineMagnifyingGlass className="h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={view === "people" ? "Search people or roles…" : "Search modules, roles or holders…"}
            className="w-full border-0 bg-transparent px-0 py-2 text-sm focus:ring-0"
          />
        </div>
        <button type="button" onClick={() => setAdding((v) => !v)} className="flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary-dark md:text-sm">
          <HiOutlinePlus className="h-4 w-4" /> Grant access
        </button>
      </div>

      {adding ? (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <p className="mb-2 text-xs font-medium text-slate-600">Pick a staff member to open their access workspace.</p>
          <StaffPicker autoFocus onPick={(s) => navigate(encodeURIComponent(s.tag))} />
        </div>
      ) : null}

      {view === "people" ? (
        people.length ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {people.map((u) => (
              <PersonCard key={u.tag} person={u} />
            ))}
          </div>
        ) : (
          <Empty text={term ? "No one matches the search." : "No one holds a role yet."} />
        )
      ) : (
        <div className="space-y-6">
          {apps
            .filter((a) => a.modules.length)
            .map((app) => {
              const modules = app.modules.filter(
                (m) => !term || [m.title, m.tag, ...m.roles.flatMap((r) => [r.title, r.role, ...r.holders.map((h) => h.name || h.tag)])].some((t) => t?.toLowerCase().includes(term))
              );
              if (!modules.length) return null;
              return (
                <section key={app.tag} className="space-y-3">
                  <h2 className="flex items-baseline gap-2 text-sm font-semibold text-slate-700">
                    {app.tag.toUpperCase()} <span className="text-xs font-normal text-slate-400">{app.title}</span>
                  </h2>
                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    {modules.map((m) => (
                      <ModuleCard key={m.id} module={m} onChange={applyChange} />
                    ))}
                  </div>
                </section>
              );
            })}
        </div>
      )}

      <p className="text-xs text-slate-400">Role changes take effect the next time a person signs in.</p>
    </div>
  );
}

function PersonCard({ person }: { person: AccessPerson }) {
  const [open, setOpen] = useState(false);
  const byApp = person.roles.reduce<Record<string, number>>((a, r) => ((a[r.app || "other"] = (a[r.app || "other"] || 0) + 1), a), {});
  const shown = open ? person.roles : person.roles.slice(0, 6);
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        <Avatar tag={person.tag} name={person.name} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-800">{person.name || person.tag}</p>
          <p className="truncate text-xs text-slate-400">
            {person.tag}
            {person.detail ? ` · ${person.detail}` : ""}
          </p>
        </div>
        {person.groupId === STUDENT_GROUP ? <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[0.6rem] font-bold uppercase text-amber-700">Student</span> : null}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {Object.entries(byApp).map(([app, n]) => (
          <span key={app} className="rounded-md bg-primary/5 px-2 py-0.5 text-[0.65rem] font-semibold text-primary">
            {app.toUpperCase()} · {n}
          </span>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {shown.map((r) => (
          <span key={r.userRoleId} title={r.moduleTitle} className={`rounded-full border px-2 py-0.5 text-[0.65rem] ${r.active === false ? "border-dashed border-slate-300 text-slate-400" : "border-slate-200 text-slate-600"}`}>
            {r.role}
          </span>
        ))}
        {person.roles.length > 6 ? (
          <button type="button" onClick={() => setOpen((v) => !v)} className="flex items-center gap-0.5 text-[0.65rem] font-semibold text-primary">
            {open ? "Show less" : `+${person.roles.length - 6} more`} <HiOutlineChevronDown className={`h-3 w-3 ${open ? "rotate-180" : ""}`} />
          </button>
        ) : null}
      </div>
      <Link to={encodeURIComponent(person.tag)} className="mt-4 rounded-lg border border-slate-200 py-1.5 text-center text-xs font-semibold text-primary hover:bg-primary/5">
        Manage access
      </Link>
    </div>
  );
}

function ModuleCard({ module, onChange }: { module: CatalogModule; onChange: (tag: string, name: string, m: CatalogModule, r: CatalogRole, grant: boolean) => void }) {
  const [addingTo, setAddingTo] = useState<number | null>(null);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-700">{module.title}</span>
          <code className="rounded bg-slate-100 px-1.5 text-[0.65rem] text-slate-500">{module.tag}</code>
        </div>
        {module.description ? <p className="mt-0.5 text-xs text-slate-400">{module.description}</p> : null}
      </div>
      <div className="divide-y divide-slate-100">
        {module.roles.map((r) => (
          <div key={r.id} className="px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-xs font-semibold text-slate-700">{titleCase(r.title)}</span>
                <span className="ml-2 text-[0.65rem] text-slate-400">{r.holders.length} holder{r.holders.length === 1 ? "" : "s"}</span>
                {r.description ? <p className="truncate text-[0.7rem] text-slate-400">{r.description}</p> : null}
              </div>
              <button
                type="button"
                onClick={() => setAddingTo(addingTo === r.id ? null : r.id)}
                className="flex shrink-0 items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[0.65rem] font-semibold text-primary hover:bg-primary/5"
              >
                <HiOutlinePlus className="h-3 w-3" /> Add
              </button>
            </div>
            {r.holders.length ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {r.holders.map((h) => (
                  <span key={h.userRoleId} className={`flex items-center gap-1.5 rounded-full border py-0.5 pl-0.5 pr-1 text-[0.7rem] ${h.groupId === STUDENT_GROUP ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-slate-50"}`}>
                    <Avatar tag={h.tag} name={h.name} size="sm" />
                    <Link to={encodeURIComponent(h.tag)} className="max-w-[10rem] truncate font-medium text-slate-600 hover:text-primary">
                      {h.name || h.tag}
                    </Link>
                    <button type="button" title="Remove" onClick={() => onChange(h.tag, h.name || h.tag, module, r, false)} className="rounded-full p-0.5 text-slate-400 hover:bg-rose-100 hover:text-rose-600">
                      <HiOutlineXMark className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : null}
            {addingTo === r.id ? (
              <div className="mt-2">
                <StaffPicker
                  autoFocus
                  placeholder={`Give ${titleCase(r.title)} to…`}
                  exclude={r.holders.map((h) => h.tag)}
                  onPick={(s) => {
                    setAddingTo(null);
                    onChange(s.tag, s.name, module, r, true);
                  }}
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, warn }: { label: string; value: number | string; warn?: boolean }) {
  return (
    <div className={`rounded-2xl border px-4 py-3 ${warn ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-white"}`}>
      <p className={`text-xl font-semibold ${warn ? "text-amber-700" : "text-slate-800"}`}>{value}</p>
      <p className="text-[0.7rem] font-medium uppercase tracking-wider text-slate-400">{label}</p>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-2xl border border-dashed border-slate-200 bg-white py-12 text-center text-sm text-slate-400">{text}</p>;
}

export default PgAISRoles;
