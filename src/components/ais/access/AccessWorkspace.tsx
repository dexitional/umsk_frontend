import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  HiOutlineArrowPath,
  HiOutlineDocumentDuplicate,
  HiOutlineExclamationTriangle,
  HiOutlineMagnifyingGlass,
  HiOutlineNoSymbol,
  HiOutlineShieldCheck,
} from "react-icons/hi2";
import Service from "../../../utils/aisService";
import { PageHero } from "../../PageHero";
import StaffPicker, { Avatar } from "./StaffPicker";
import { AccessPerson, CatalogModule, indexCatalog, Overview, STUDENT_GROUP, titleCase } from "./accessUtil";

type Props = {
  overview: Overview;
  person: AccessPerson;
  canEdit: boolean;
  onSaved?: () => void;
};

type Change = { module: CatalogModule; before: number | null; after: number | null };

// One person's access across every app: each module offers "No access" or
// exactly one of its roles (the one-role-per-module rule is built into the
// control). Edits stay as a draft, compared live against what's saved, until
// "Save changes" sends the whole set in one request.
function AccessWorkspace({ overview, person, canEdit, onSaved }: Props) {
  const apps = (overview?.apps || []).filter((a) => a.modules.length);
  const index = useMemo(() => indexCatalog(apps), [overview]);

  // Saved state: module -> role, plus held roles that aren't in the active
  // catalogue (disabled roles/modules) -- those are kept unless removed.
  const { saved, others } = useMemo(() => {
    const saved = new Map<number, number>();
    const others: typeof person.roles = [];
    for (const r of person?.roles || []) {
      const hit = index.get(r.roleId);
      if (hit) saved.set(hit.module.id, r.roleId);
      else others.push(r);
    }
    return { saved, others };
  }, [person, index]);

  const [draft, setDraft] = useState<Map<number, number>>(() => new Map(saved));
  const [dropOthers, setDropOthers] = useState<Set<number>>(new Set());
  const [appTag, setAppTag] = useState(apps[0]?.tag);
  const [search, setSearch] = useState("");
  const [onlyAssigned, setOnlyAssigned] = useState(!canEdit);
  const [note, setNote] = useState("");
  const [copying, setCopying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showChanges, setShowChanges] = useState(false);

  const changes: Change[] = useMemo(() => {
    const out: Change[] = [];
    for (const app of apps)
      for (const m of app.modules) {
        const before = saved.get(m.id) ?? null, after = draft.get(m.id) ?? null;
        if (before !== after) out.push({ module: m, before, after });
      }
    return out;
  }, [draft, saved]);
  const grants = changes.filter((c) => c.after != null && c.before == null).length;
  const revokes = changes.filter((c) => c.after == null).length + dropOthers.size;
  const swaps = changes.filter((c) => c.after != null && c.before != null).length;
  const dirty = changes.length > 0 || dropOthers.size > 0;

  const choose = (moduleId: number, roleId: number | null) => {
    if (!canEdit) return;
    const next = new Map(draft);
    if (roleId == null) next.delete(moduleId);
    else next.set(moduleId, roleId);
    setDraft(next);
  };

  const countFor = (tag: string, map: Map<number, number>) => apps.find((a) => a.tag === tag)?.modules.filter((m) => map.has(m.id)).length ?? 0;
  const totalHeld = draft.size + others.length - dropOthers.size;
  const app = apps.find((a) => a.tag === appTag) || apps[0];
  const term = search.trim().toLowerCase();
  const modules = (app?.modules || []).filter((m) => {
    if (onlyAssigned && !draft.has(m.id) && !saved.has(m.id)) return false;
    if (!term) return true;
    return [m.title, m.tag, m.description, ...m.roles.map((r) => r.title)].some((t) => t?.toLowerCase().includes(term));
  });

  const roleLabel = (roleId: number | null) => {
    if (roleId == null) return "No access";
    const hit = index.get(roleId);
    return hit ? titleCase(hit.role.title) : `#${roleId}`;
  };

  const copyFrom = async (staff: { tag: string; name: string }) => {
    setCopying(false);
    try {
      const other: any = await Service.fetchUserAccess(staff.tag);
      const map = new Map<number, number>();
      for (const r of other?.roles || []) {
        const hit = index.get(r.roleId);
        if (hit) map.set(hit.module.id, r.roleId);
      }
      if (!window.confirm(`Replace the current selection with ${staff.name}'s access (${map.size} role${map.size === 1 ? "" : "s"})? Nothing is saved until you click Save changes.`)) return;
      setDraft(map);
      toast.success(`Loaded ${staff.name}'s access -- review and save.`);
    } catch {
      toast.error("Couldn't load that staff member's access.");
    }
  };

  const clearApp = () => {
    if (!app || !window.confirm(`Remove all ${app.tag.toUpperCase()} access from the selection?`)) return;
    const next = new Map(draft);
    app.modules.forEach((m) => next.delete(m.id));
    setDraft(next);
  };

  const discard = () => {
    setDraft(new Map(saved));
    setDropOthers(new Set());
    setNote("");
    setShowChanges(false);
  };

  const save = async () => {
    setSaving(true);
    try {
      const roleIds = [...draft.values(), ...others.filter((o) => !dropOthers.has(o.roleId)).map((o) => o.roleId)];
      const res: any = await Service.saveUserAccess(person.tag, roleIds, note);
      toast.success(`Access saved: ${res?.granted?.length || 0} granted, ${res?.revoked?.length || 0} revoked.`);
      setNote("");
      setShowChanges(false);
      onSaved?.();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Access could not be saved.", { duration: 8000 });
    } finally {
      setSaving(false);
    }
  };

  const isStudent = person?.groupId === STUDENT_GROUP;

  return (
    <div className="space-y-4 pb-24">
      {/* Person -- same hero as the module pages, with their photo in
          place of the module icon. */}
      <PageHero>
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex w-full min-w-0 items-center gap-4 sm:w-auto sm:flex-1">
            <div className="flex shrink-0 items-center justify-center rounded-2xl border border-blue-200/60 bg-gradient-to-br from-white to-blue-100 p-1.5">
              {/* Inner radius = container's rounded-2xl (16px) minus its p-1.5 (6px). */}
              <Avatar tag={person.tag} name={person.name} size="lg" rounded="rounded-[10px]" />
            </div>
            <div className="min-w-0">
              <p className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">Access Control</p>
              <h1 className="break-words text-2xl font-bold tracking-tight text-primary sm:text-3xl">{person.name || person.tag}</h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
                {person.tag}
                {person.detail ? ` · ${person.detail}` : ""}
                {person.unit ? ` · ${person.unit}` : ""}
              </p>
            </div>
          </div>
          <div className="flex max-w-full flex-wrap gap-2">
            <Stat label="Roles" value={totalHeld} />
            {apps.map((a) => (
              <Stat key={a.tag} label={a.tag.toUpperCase()} value={countFor(a.tag, draft)} muted />
            ))}
          </div>
        </div>
      </PageHero>

      {person.hasAccount === false ? (
        <Banner tone="amber">This person has no portal account yet, so roles can't be assigned. Stage their account first.</Banner>
      ) : null}
      {isStudent ? (
        <Banner tone="amber">This is a student account. Staff roles normally shouldn't be held by students -- review and remove any that aren't intended.</Banner>
      ) : null}

      {/* Toolbar */}
      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-3 md:p-4">
        <div className="flex flex-wrap items-center gap-2">
          {apps.map((a) => {
            const active = a.tag === app?.tag;
            const n = countFor(a.tag, draft);
            return (
              <button
                key={a.tag}
                type="button"
                onClick={() => setAppTag(a.tag)}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors md:text-sm ${
                  active ? "bg-primary text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
                title={a.title}
              >
                {a.tag.toUpperCase()}
                <span className={`rounded-full px-1.5 text-[0.65rem] ${active ? "bg-white/20" : n ? "bg-primary/10 text-primary" : "bg-slate-200 text-slate-500"}`}>
                  {n}/{a.modules.length}
                </span>
              </button>
            );
          })}
          <span className="hidden text-xs text-slate-400 md:inline">{app?.title}</span>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 px-3 focus-within:border-primary/40">
            <HiOutlineMagnifyingGlass className="h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter modules or roles…"
              className="w-full border-0 bg-transparent px-0 py-2 text-sm focus:ring-0"
            />
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-600">
            <input type="checkbox" checked={onlyAssigned} onChange={(e) => setOnlyAssigned(e.target.checked)} className="rounded border-slate-300 text-primary focus:ring-primary/30" />
            Assigned only
          </label>
          {canEdit && person.hasAccount !== false ? (
            <div className="flex gap-2">
              <button type="button" onClick={() => setCopying((v) => !v)} className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                <HiOutlineDocumentDuplicate className="h-4 w-4" /> Copy from…
              </button>
              <button type="button" onClick={clearApp} className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                <HiOutlineNoSymbol className="h-4 w-4" /> Clear {app?.tag.toUpperCase()}
              </button>
            </div>
          ) : null}
        </div>
        {copying ? (
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="mb-2 text-xs text-slate-500">Copy another staff member's roles into this selection (replaces it; you can adjust before saving).</p>
            <StaffPicker autoFocus onPick={copyFrom} exclude={[person.tag]} />
          </div>
        ) : null}
      </section>

      {/* Modules */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {modules.length ? (
          modules.map((m) => {
            const before = saved.get(m.id) ?? null, after = draft.get(m.id) ?? null;
            const state = before === after ? "same" : after == null ? "revoke" : before == null ? "grant" : "swap";
            const edge = { same: "border-l-transparent", grant: "border-l-emerald-500 bg-emerald-50/40", revoke: "border-l-rose-500 bg-rose-50/40", swap: "border-l-amber-500 bg-amber-50/40" }[state];
            return (
              <div key={m.id} className={`flex flex-col gap-3 border-b border-l-4 border-b-slate-100 px-4 py-3 last:border-b-0 md:flex-row md:items-center ${edge}`}>
                <div className="min-w-0 md:w-80 md:shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-700">{m.title}</span>
                    <code className="rounded bg-slate-100 px-1.5 text-[0.65rem] text-slate-500">{m.tag}</code>
                  </div>
                  {m.description ? <p className="mt-0.5 line-clamp-2 text-xs text-slate-400">{m.description}</p> : null}
                  {state !== "same" ? (
                    <p className="mt-1 text-[0.7rem] font-medium text-slate-500">
                      {roleLabel(before)} → <span className="font-semibold text-slate-700">{roleLabel(after)}</span>
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-1 flex-wrap gap-1.5" role="radiogroup" aria-label={`${m.title} role`}>
                  <RoleChip label="No access" selected={after == null} disabled={!canEdit} onClick={() => choose(m.id, null)} muted />
                  {m.roles.map((r) => (
                    <RoleChip
                      key={r.id}
                      label={titleCase(r.title)}
                      title={r.description || r.role}
                      selected={after === r.id}
                      wasSaved={before === r.id && after !== r.id}
                      disabled={!canEdit}
                      onClick={() => choose(m.id, r.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <p className="px-4 py-10 text-center text-sm text-slate-400">{onlyAssigned ? "No assigned modules in this app." : "No modules match the filter."}</p>
        )}
      </section>

      {/* Held roles outside the active catalogue */}
      {others.length ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-slate-700">Disabled or retired roles</h3>
          <p className="mb-3 text-xs text-slate-400">Still assigned, but their role or module is switched off. They're kept unless you remove them.</p>
          <div className="flex flex-wrap gap-2">
            {others.map((o) => {
              const dropped = dropOthers.has(o.roleId);
              return (
                <button
                  key={o.userRoleId}
                  type="button"
                  disabled={!canEdit}
                  onClick={() => {
                    const next = new Set(dropOthers);
                    dropped ? next.delete(o.roleId) : next.add(o.roleId);
                    setDropOthers(next);
                  }}
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${dropped ? "border-rose-200 bg-rose-50 text-rose-600 line-through" : "border-slate-200 bg-slate-50 text-slate-600"}`}
                >
                  {o.role || `role #${o.roleId}`}
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      <p className="flex items-center gap-1.5 text-xs text-slate-400">
        <HiOutlineShieldCheck className="h-4 w-4" /> One role per module. Changes take effect the next time {person.name?.split(" ")[0] || "the user"} signs in.
      </p>

      {/* Save bar */}
      {canEdit && dirty ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(15,23,42,0.25)] backdrop-blur md:left-auto md:right-6 md:bottom-6 md:w-[38rem] md:rounded-2xl md:border">
          {showChanges ? (
            <ul className="mb-3 max-h-48 space-y-1 overflow-auto text-xs">
              {changes.map((c) => (
                <li key={c.module.id} className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${c.after == null ? "bg-rose-500" : c.before == null ? "bg-emerald-500" : "bg-amber-500"}`} />
                  <span className="font-medium text-slate-700">{c.module.title}</span>
                  <span className="text-slate-400">
                    {roleLabel(c.before)} → {roleLabel(c.after)}
                  </span>
                </li>
              ))}
              {others
                .filter((o) => dropOthers.has(o.roleId))
                .map((o) => (
                  <li key={o.userRoleId} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                    <span className="font-medium text-slate-700">{o.role}</span>
                    <span className="text-slate-400">removed</span>
                  </li>
                ))}
            </ul>
          ) : null}
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <button type="button" onClick={() => setShowChanges((v) => !v)} className="flex items-center gap-2 text-left text-xs font-semibold text-slate-600">
              {grants ? <Pill tone="emerald">+{grants}</Pill> : null}
              {swaps ? <Pill tone="amber">~{swaps}</Pill> : null}
              {revokes ? <Pill tone="rose">−{revokes}</Pill> : null}
              <span className="underline decoration-dotted underline-offset-2">{showChanges ? "Hide" : "Review"} changes</span>
            </button>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={255}
              placeholder="Note (optional), e.g. Acting HOD"
              className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-primary/40 focus:ring-0"
            />
            <div className="flex gap-2">
              <button type="button" onClick={discard} disabled={saving} className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                <HiOutlineArrowPath className="h-3.5 w-3.5" /> Discard
              </button>
              <button type="button" onClick={save} disabled={saving} className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-primary-dark disabled:opacity-60">
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function RoleChip({ label, title, selected, wasSaved, disabled, muted, onClick }: { label: string; title?: string; selected: boolean; wasSaved?: boolean; disabled?: boolean; muted?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        selected
          ? muted
            ? "border-slate-400 bg-slate-600 text-white"
            : "border-primary bg-primary text-white shadow-sm"
          : wasSaved
            ? "border-dashed border-slate-400 bg-white text-slate-500"
            : "border-slate-200 bg-white text-slate-600 hover:border-primary/40 hover:text-primary"
      } ${disabled ? "cursor-default" : ""} ${disabled && !selected ? "opacity-50" : ""}`}
    >
      {label}
    </button>
  );
}

function Stat({ label, value, muted }: { label: string; value: number; muted?: boolean }) {
  return (
    <span className={`flex min-w-[3.5rem] flex-col items-center rounded-xl border px-3 py-1.5 ${muted ? "border-blue-100 bg-white/60" : "border-blue-200 bg-white/90"}`}>
      <span className={`text-base font-semibold ${muted ? "text-slate-600" : "text-primary"}`}>{value}</span>
      <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">{label}</span>
    </span>
  );
}

function Pill({ tone, children }: { tone: "emerald" | "amber" | "rose"; children: React.ReactNode }) {
  const cls = { emerald: "bg-emerald-100 text-emerald-700", amber: "bg-amber-100 text-amber-700", rose: "bg-rose-100 text-rose-700" }[tone];
  return <span className={`rounded-full px-2 py-0.5 text-[0.7rem] font-bold ${cls}`}>{children}</span>;
}

export function Banner({ tone, children }: { tone: "amber"; children: React.ReactNode }) {
  return (
    <div className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-xs ${tone === "amber" ? "border-amber-200 bg-amber-50 text-amber-800" : ""}`}>
      <HiOutlineExclamationTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

export default AccessWorkspace;
