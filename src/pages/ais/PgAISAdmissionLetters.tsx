import moment from "moment";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineDocumentText, HiOutlinePencilSquare, HiOutlinePlus, HiOutlinePrinter, HiOutlineRocketLaunch, HiOutlineTrash } from "react-icons/hi2";
import { Link, useLoaderData, useRevalidator } from "react-router-dom";
import Service from "../../utils/aisService";
import { useHasRole } from "../../utils/roles";

// Admission letter templates (ams_letter), one active letter per programme.
// A failed load shows the server's message on the page instead of the
// generic error screen.
export async function loader() {
  try {
    const [letters, programs] = await Promise.all([Service.fetchAdmissionLetters(), Service.fetchProgramList()]);
    return { letters: Array.isArray(letters) ? letters : [], programs: Array.isArray(programs) ? programs : [] };
  } catch (error: any) {
    return { letters: [], programs: [], loadError: error?.response?.data?.message || "Admission letters could not be loaded. Please try again." };
  }
}

function PgAISAdmissionLetters() {
  const { letters, programs, loadError }: any = useLoaderData();
  const canEdit = useHasRole("ais", ["sletter::admin"]);
  const revalidator = useRevalidator();
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const covered = new Set(letters.filter((l: any) => l.status).map((l: any) => l.programId));
  const missing = programs.filter((p: any) => p.status !== false && p.category === "UG" && !covered.has(p.id));

  const remove = async (l: any) => {
    if (!window.confirm(`Delete the admission letter "${l.title}"?`)) return;
    if (await Service.deleteAdmissionLetter(l.id)) revalidator.revalidate();
  };

  // Creates portal accounts + emails for this letter's freshers (its
  // programme and admission year, Year 1 Sem 1) and texts them the admission
  // notice. Safe to re-run: only freshers not yet activated are included.
  const activate = async (l: any) => {
    const cohort = l.year ? `admitted in ${l.year}` : "in Year 1";
    if (!window.confirm(`Activate admission for ${l.program?.longName} freshers ${cohort}?\n\nThis creates their portal accounts and institute emails, and texts each of them that they have been admitted and should log in to view their admission letter and accept or reject the offer.`)) return;
    setActivatingId(l.id);
    try {
      const resp = await Service.activateAdmission(l.id);
      if (!resp?.total) toast(resp?.message || "No freshers awaiting activation.");
      else toast.success(`Admission activated for ${resp.activated} of ${resp.total} fresher${resp.total === 1 ? "" : "s"}.`);
      if (resp?.errors?.length) {
        toast.error(`Not activated (retry later): ${resp.errors.map((e: any) => `${e.id} - ${e.reason}`).join("; ")}`, { duration: 10000 });
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Admission not activated!");
    } finally {
      setActivatingId(null);
    }
  };

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-5 animate-fade-in-up">
      <div className="relative overflow-hidden rounded-xl bg-primary/90 px-5 py-3.5 md:px-7 md:py-4 shadow-md shadow-slate-500/10">
        <div className="relative flex items-center gap-3">
          <span className="flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white/90">
            <HiOutlineDocumentText className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <h1 className="text-base md:text-lg font-semibold tracking-wide text-white">Admission Letters</h1>
            <p className="text-[0.7rem] md:text-xs text-white/60">Templates per programme, printed for newly admitted first years</p>
          </div>
          {canEdit ? (
            <Link to="create" className="flex items-center gap-1.5 rounded-lg bg-white/[0.15] px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/25 md:text-sm">
              <HiOutlinePlus className="h-4 w-4" /> New letter
            </Link>
          ) : null}
        </div>
      </div>

      {loadError ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{loadError}</p>
      ) : null}

      {missing.length ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          No active admission letter yet for: {missing.map((p: any) => p.longName || p.shortName).join(", ")}.
        </p>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="hidden grid-cols-12 gap-3 border-b border-slate-100 bg-slate-50 px-4 py-2.5 text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 md:grid">
          <span className="col-span-5">Programme</span>
          <span>Year</span>
          <span>Status</span>
          <span className="col-span-2">Updated</span>
          <span className="col-span-3 text-right">Actions</span>
        </div>
        {letters.length ? (
          letters.map((l: any) => (
            <div key={l.id} className="grid grid-cols-1 gap-2 border-b border-slate-100 px-4 py-3 text-sm last:border-b-0 md:grid-cols-12 md:items-center md:gap-3">
              <span className="flex min-w-0 flex-col gap-1 md:col-span-5">
                <span className="font-medium text-slate-700">{l.program?.longName || <em className="text-slate-400">No programme</em>}</span>
                {l.title ? (
                  <span className="w-fit max-w-full truncate rounded-md bg-slate-100 px-2 py-0.5 text-[0.7rem] font-medium text-slate-500" title={l.title}>
                    {l.title}
                  </span>
                ) : null}
              </span>
              <span className="text-slate-600">{l.year ? `${l.year}/${l.year + 1}` : <em className="text-xs text-slate-400">Year 1</em>}</span>
              <span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${l.status ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{l.status ? "Active" : "Inactive"}</span>
              </span>
              <span className="whitespace-nowrap text-xs text-slate-400 md:col-span-2">{moment(l.updatedAt).format("MMM D, YYYY")}</span>
              <span className="flex gap-1.5 md:col-span-3 md:justify-end">
                {l.status && l.programId ? (
                  <Link to={`print?programId=${encodeURIComponent(l.programId)}`} title="Print letters for this programme's first years" className="rounded-md border border-slate-200 p-1.5 text-slate-500 hover:text-primary">
                    <HiOutlinePrinter className="h-4 w-4" />
                  </Link>
                ) : null}
                {canEdit && l.status && l.programId ? (
                  <button
                    type="button"
                    onClick={() => activate(l)}
                    disabled={!!activatingId}
                    title="Activate Admission: create freshers' accounts and emails, and text them the admission notice"
                    className={`flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 disabled:opacity-50 ${activatingId === l.id ? "animate-pulse" : ""}`}
                  >
                    <HiOutlineRocketLaunch className="h-4 w-4" />
                    {activatingId === l.id ? "Activating ..." : "Activate"}
                  </button>
                ) : null}
                {canEdit ? (
                  <>
                    <Link to={`${l.id}/edit`} title="Edit" className="rounded-md border border-slate-200 p-1.5 text-slate-500 hover:text-primary">
                      <HiOutlinePencilSquare className="h-4 w-4" />
                    </Link>
                    <button type="button" onClick={() => remove(l)} title="Delete" className="rounded-md border border-slate-200 p-1.5 text-slate-500 hover:text-rose-600">
                      <HiOutlineTrash className="h-4 w-4" />
                    </button>
                  </>
                ) : null}
              </span>
            </div>
          ))
        ) : (
          <p className="px-4 py-12 text-center text-sm text-slate-400">{loadError ? "Admission letters are unavailable right now." : "No admission letters yet."}</p>
        )}
      </div>
    </div>
  );
}

export default PgAISAdmissionLetters;
