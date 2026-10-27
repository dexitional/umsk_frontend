import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { HiOutlineArrowLeft, HiOutlineCheckCircle, HiOutlineClock, HiOutlineIdentification, HiOutlineMagnifyingGlass, HiOutlineUserCircle } from "react-icons/hi2";
import { PageHero, PageHeroBadge, PageHeroHeading } from "../components/PageHero";
import { button, errorNotice, input, secondaryButton, warning } from "../components/management/ManagementUI";

// Public, sign-in-free page for the one-day student profile update exercise
// (backend: /api/public/profile, profileExerciseController). A student finds
// their record, corrects it, and the change applies immediately.

const { REACT_APP_API_URL } = import.meta.env;
const api = `${REACT_APP_API_URL}/public/profile`;
const errorOf = (e: any) => e?.response?.data?.message || (!e?.response ? "Could not reach the server. Check your connection and try again." : "Something went wrong. Please try again.");

type Status = { open: boolean; opensAt: string | null; closesAt: string | null };
const LABELS: Record<string, string> = { fname: "First name", mname: "Middle name", lname: "Last name", dob: "Date of birth", phone: "Phone number", email: "Email", indexno: "Index number" };

function Field({ label, hint, children }: { label: string; hint?: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-sm font-medium text-slate-600">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}

export default function PgProfileUpdate() {
  const [status, setStatus] = useState<Status | null>(null);
  const [statusError, setStatusError] = useState("");
  const [q, setQ] = useState("");
  const [results, setResults] = useState<any[] | null>(null);
  const [more, setMore] = useState(false);
  const [record, setRecord] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ changed: string[]; message: string } | null>(null);

  useEffect(() => {
    axios.get(`${api}/status`, { timeout: 20000 }).then((r) => setStatus(r.data)).catch((e) => setStatusError(errorOf(e)));
  }, []);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setBusy(true); setResults(null);
    try {
      const r = await axios.get(`${api}/search`, { params: { q }, timeout: 20000 });
      setResults(r.data.results); setMore(r.data.more);
    } catch (e) { setError(errorOf(e)); } finally { setBusy(false); }
  };

  const open = async (id: string) => {
    setError(""); setBusy(true);
    try {
      const r = await axios.get(`${api}/students/${encodeURIComponent(id)}`, { timeout: 20000 });
      setRecord(r.data);
      setForm({ fname: r.data.fname || "", mname: r.data.mname || "", lname: r.data.lname || "", dob: "", phone: "", email: "", indexno: r.data.indexno || "" });
    } catch (e) { setError(errorOf(e)); } finally { setBusy(false); }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      const r = await axios.put(`${api}/students/${encodeURIComponent(record.id)}`, { ...form, indexno: record.indexLocked ? undefined : form.indexno }, { timeout: 30000 });
      setDone(r.data);
    } catch (e) { setError(errorOf(e)); } finally { setBusy(false); }
  };

  const restart = () => { setRecord(null); setDone(null); setResults(null); setQ(""); setError(""); };
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/60 via-white to-white">
      <main className="mx-auto w-full max-w-2xl space-y-6 px-4 py-8 md:py-12">
        <PageHero>
          <PageHeroHeading
            eyebrow="Student records"
            title="Profile Update"
            description="Find your student record and confirm or correct your names, date of birth, phone number and email."
            Icon={HiOutlineUserCircle}
            action={status?.closesAt && status.open ? <PageHeroBadge Icon={HiOutlineClock}>Open until {moment(status.closesAt).format("ddd D MMM, h:mm A")}</PageHeroBadge> : undefined}
          />
        </PageHero>

        {statusError ? <p role="alert" className={errorNotice}>{statusError}</p> : null}
        {!status && !statusError ? <p role="status" className="text-sm text-slate-500">Loading…</p> : null}

        {status && !status.open ? (
          <section className={warning} role="status">
            <p className="font-semibold">The profile update exercise is not open.</p>
            <p className="mt-1">
              {status.opensAt && Date.now() < Date.parse(status.opensAt)
                ? `It opens on ${moment(status.opensAt).format("dddd D MMMM YYYY, h:mm A")}.`
                : "Contact the Registry if you need to correct your details."}
            </p>
          </section>
        ) : null}

        {status?.open && done ? (
          <section className="space-y-4 rounded-2xl border border-blue-100 bg-white p-6 text-center shadow-sm">
            <HiOutlineCheckCircle aria-hidden="true" className="mx-auto h-12 w-12 text-emerald-500" />
            <p className="text-lg font-semibold text-primary">{done.message}</p>
            {done.changed.length ? <p className="text-sm text-slate-600">Updated: {done.changed.map((k) => LABELS[k] || k).join(", ")}</p> : null}
            <button type="button" className={secondaryButton} onClick={restart}>Update another record</button>
          </section>
        ) : null}

        {status?.open && !done && !record ? (
          <section className="space-y-4 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
            <form onSubmit={search} className="space-y-3">
              <Field label="Find your record" hint="Student ID, index number, phone number, or your name.">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative min-w-0 flex-1">
                    <HiOutlineMagnifyingGlass aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input type="search" value={q} onChange={(e) => setQ(e.target.value)} minLength={3} maxLength={100} required className={`${input} !pl-10`} placeholder="e.g. 2412345 or Ama Mensah" />
                  </div>
                  <button type="submit" disabled={busy || q.trim().length < 3} className={button}>{busy ? "Searching…" : "Search"}</button>
                </div>
              </Field>
            </form>
            {error ? <p role="alert" className={errorNotice}>{error}</p> : null}
            {results ? (
              results.length ? (
                <ul className="space-y-2" aria-label="Matching records">
                  {results.map((r) => (
                    <li key={r.id}>
                      <button type="button" disabled={busy} onClick={() => open(r.id)} className="flex w-full items-center gap-3 rounded-xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/50 p-3 text-left transition hover:border-blue-300 hover:shadow-sm disabled:opacity-50">
                        <HiOutlineIdentification aria-hidden="true" className="h-6 w-6 shrink-0 text-secondary-accent" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-slate-800">{r.name}</span>
                          <span className="block text-xs text-slate-500">
                            {[r.program, r.year ? `Year ${r.year}` : null, `ID ${r.idHint}`, r.phoneHint ? `Phone ${r.phoneHint}` : null].filter(Boolean).join(" · ")}
                          </span>
                        </span>
                        <span className="shrink-0 text-xs font-semibold text-primary">This is me</span>
                      </button>
                    </li>
                  ))}
                  {more ? <li className="text-xs text-slate-500">More records match. Add more of your name, or use your student ID.</li> : null}
                </ul>
              ) : (
                <p className="text-sm text-slate-600">No record found. Check the spelling, try your student ID or index number, or contact the Registry.</p>
              )
            ) : null}
          </section>
        ) : null}

        {status?.open && !done && record ? (
          <form onSubmit={save} className="space-y-5 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Updating record</p>
                <p className="truncate text-base font-semibold text-primary">{[record.fname, record.mname, record.lname].filter(Boolean).join(" ")}</p>
                <p className="text-xs text-slate-500">{[record.program, record.year ? `Year ${record.year}` : null].filter(Boolean).join(" · ")}</p>
              </div>
              <button type="button" onClick={restart} className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary hover:underline">
                <HiOutlineArrowLeft aria-hidden="true" className="h-4 w-4" /> Not me
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="First name *"><input value={form.fname} onChange={set("fname")} required maxLength={255} className={input} autoComplete="given-name" /></Field>
              <Field label="Middle name"><input value={form.mname} onChange={set("mname")} maxLength={350} className={input} autoComplete="additional-name" /></Field>
              <Field label="Last name *"><input value={form.lname} onChange={set("lname")} required maxLength={255} className={input} autoComplete="family-name" /></Field>
            </div>

            <p className="rounded-xl bg-blue-50/60 px-3 py-2 text-xs text-slate-600">
              For your privacy, the fields below show only part of what's on record. Leave a field empty to keep it; fill it in to correct it.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Date of birth" hint={record.dobYear ? `On record: born ${record.dobYear}` : "Not on record"}>
                <input type="date" value={form.dob} onChange={set("dob")} max={moment().subtract(10, "years").format("YYYY-MM-DD")} className={input} />
              </Field>
              <Field label="Phone number" hint={record.phoneHint ? `On record: ${record.phoneHint}` : "Not on record"}>
                <input type="tel" value={form.phone} onChange={set("phone")} inputMode="tel" maxLength={20} placeholder="e.g. 0244123456" className={input} autoComplete="tel" />
              </Field>
              <Field label="Email" hint={record.emailHint ? `On record: ${record.emailHint}` : "Not on record"}>
                <input type="email" value={form.email} onChange={set("email")} maxLength={255} placeholder="you@example.com" className={input} autoComplete="email" />
              </Field>
              <Field label="Index number" hint={record.indexLocked ? "Already assigned. Contact the Registry if it is wrong." : "Leave empty if you have not been given one."}>
                <input value={form.indexno} onChange={set("indexno")} readOnly={record.indexLocked} inputMode="numeric" maxLength={10} pattern="\d{10}" title="10 digits" className={`${input} ${record.indexLocked ? "!bg-slate-50 text-slate-500" : ""}`} />
              </Field>
            </div>

            {error ? <p role="alert" className={errorNotice}>{error}</p> : null}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button type="submit" disabled={busy} className={button}>{busy ? "Saving…" : "Save my details"}</button>
              <p className="text-xs text-slate-500">Changes apply immediately and are recorded.</p>
            </div>
          </form>
        ) : null}

        {status?.open ? <p className="text-center text-xs text-slate-500">Only update your own record. Every change is logged with the device it came from.</p> : null}
      </main>
    </div>
  );
}
