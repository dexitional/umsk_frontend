import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import React, { useEffect, useRef, useState } from "react";
import Service from "../../utils/aisService";

export type BulkMode = "credentials" | "emails";

type Props = {
  mode: BulkMode | null;
  onClose: (changed: boolean) => void;
};

type Problem = { id: string; reason: string; kind: "Skipped" | "Failed" };

const COPY: Record<BulkMode, { title: string; intro: string; run: string }> = {
  credentials: {
    title: "Send Student Credentials",
    intro:
      "Texts each active student their portal username and stored password. Students who changed their own password have none stored and are skipped unless you issue new passwords.",
    run: "SEND CREDENTIALS",
  },
  emails: {
    title: "Generate Institutional Emails",
    intro:
      "Creates an institutional email and Google Workspace account for each active student without one, using their current portal password, and retries Google accounts that failed to sync. The email becomes the student's portal username.",
    run: "GENERATE EMAILS",
  },
};

// Bulk Send Credentials / Generate Emails for the Students page. The
// backend works a page of students per request, so this loops on `next`
// and shows progress; Stop finishes the current page and halts.
function StudentBulkActionDialog({ mode, onClose }: Props) {
  const [programs, setPrograms] = useState<any[]>([]);
  const [programId, setProgramId] = useState("");
  const [yearGroup, setYearGroup] = useState("");
  const [unsentOnly, setUnsentOnly] = useState(true);
  const [issueMissing, setIssueMissing] = useState(false);
  const [notify, setNotify] = useState(true);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<{ total?: number; processed: number; done: number; synced: number } | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [error, setError] = useState("");
  const [finished, setFinished] = useState(false);
  const stopRef = useRef(false);

  useEffect(() => {
    if (!mode) return;
    setProgress(null);
    setProblems([]);
    setError("");
    setFinished(false);
    if (!programs.length) Service.fetchProgramList().then((rows) => setPrograms(rows || [])).catch(() => setPrograms([]));
  }, [mode]);

  if (!mode) return null;
  const copy = COPY[mode];

  const run = async () => {
    if (mode === "credentials" && issueMissing && !window.confirm("Students without a stored password will get a NEW password, replacing the one they use now. Continue?")) return;
    stopRef.current = false;
    setRunning(true);
    setFinished(false);
    setError("");
    setProblems([]);
    const scope = { ...(programId && { programId }), ...(yearGroup && { yearGroup: Number(yearGroup) }) };
    const tally = { total: undefined as number | undefined, processed: 0, done: 0, synced: 0 };
    setProgress({ ...tally });
    let after: string | null = null;
    try {
      do {
        const resp: any =
          mode === "credentials"
            ? await Service.sendStudentCredentials({ ...scope, unsentOnly, issueMissing, after })
            : await Service.generateStudentEmails({ ...scope, notify, after });
        if (resp?.total !== undefined) tally.total = resp.total;
        tally.processed += resp?.processed || 0;
        tally.done += mode === "credentials" ? resp?.sent || 0 : resp?.created || 0;
        tally.synced += resp?.synced || 0;
        setProgress({ ...tally });
        setProblems((prev) => [
          ...prev,
          ...(resp?.skipped || []).map((p: any) => ({ ...p, kind: "Skipped" as const })),
          ...(resp?.failed || []).map((p: any) => ({ ...p, kind: "Failed" as const })),
        ]);
        after = resp?.next || null;
      } while (after && !stopRef.current);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "The request failed.");
    }
    setRunning(false);
    setFinished(true);
  };

  const close = () => {
    if (running) return;
    onClose(!!progress?.done || !!progress?.synced);
  };

  const pct = progress?.total ? Math.min(100, Math.round((progress.processed / progress.total) * 100)) : 0;
  const doneLabel = mode === "credentials" ? "sent" : "emails created";

  return (
    <Dialog open={!!mode} onClose={close} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className={`w-full ${problems.length ? "max-w-3xl" : "max-w-md"} max-h-[90vh] overflow-y-auto rounded-xl bg-white p-4 md:p-6 space-y-4 shadow-xl`}>
          <DialogTitle className="text-sm md:text-base font-semibold text-primary/70 tracking-wide uppercase">{copy.title}</DialogTitle>
          <p className="text-xs md:text-sm text-gray-500">{copy.intro}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex flex-col space-y-1">
              <span className="text-sm text-gray-500 font-medium">Programme</span>
              <select value={programId} onChange={(e) => setProgramId(e.target.value)} disabled={running} className="focus:ring-0 border focus:border-slate-300 border-primary-dark/10 bg-primary-dark/5 text-sm text-gray-600 rounded-md">
                <option value="">All programmes</option>
                {programs.map((row: any) => (
                  <option key={row.id} value={row.id}>{row.longName}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col space-y-1">
              <span className="text-sm text-gray-500 font-medium">Year Group</span>
              <select value={yearGroup} onChange={(e) => setYearGroup(e.target.value)} disabled={running} className="focus:ring-0 border focus:border-slate-300 border-primary-dark/10 bg-primary-dark/5 text-sm text-gray-600 rounded-md">
                <option value="">All years</option>
                {[1, 2, 3, 4].map((y) => (
                  <option key={y} value={y}>Year {y}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            {mode === "credentials" ? (
              <>
                <label className="flex items-start gap-2">
                  <input type="checkbox" checked={unsentOnly} onChange={(e) => setUnsentOnly(e.target.checked)} disabled={running} className="mt-0.5 rounded" />
                  <span>Only students whose credentials have not been sent yet</span>
                </label>
                <label className="flex items-start gap-2">
                  <input type="checkbox" checked={issueMissing} onChange={(e) => setIssueMissing(e.target.checked)} disabled={running} className="mt-0.5 rounded" />
                  <span>Issue a new password (and portal account) to students with none stored</span>
                </label>
              </>
            ) : (
              <label className="flex items-start gap-2">
                <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} disabled={running} className="mt-0.5 rounded" />
                <span>Text each student their new email and password</span>
              </label>
            )}
          </div>

          {progress ? (
            <div className="space-y-1.5" role="status" aria-live="polite">
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className={`h-full bg-primary/70 transition-all ${running && !progress.total ? "animate-pulse w-full" : ""}`} style={progress.total ? { width: `${pct}%` } : undefined} />
              </div>
              <p className="text-xs text-gray-500">
                {progress.processed}
                {progress.total !== undefined ? ` of ${progress.total}` : ""} processed · {progress.done} {doneLabel}
                {mode === "emails" && progress.synced ? ` · ${progress.synced} Google accounts re-synced` : ""}
                {problems.length ? ` · ${problems.length} need attention` : ""}
                {finished && !error ? (stopRef.current ? " · stopped" : " · finished") : ""}
              </p>
            </div>
          ) : null}

          {error ? <p role="alert" className="rounded-md border border-rose-200 bg-rose-50 p-3 text-xs md:text-sm text-rose-800">{error}</p> : null}

          {problems.length ? (
            <div className="max-h-64 overflow-auto rounded-md border border-slate-100">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-amber-50 text-amber-700">
                  <tr>
                    <th className="px-2 py-1.5 font-semibold">Student ID</th>
                    <th className="px-2 py-1.5 font-semibold">Status</th>
                    <th className="px-2 py-1.5 font-semibold">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-600">
                  {problems.map((p, i) => (
                    <tr key={i}>
                      <td className="px-2 py-1.5 whitespace-nowrap">{p.id}</td>
                      <td className={`px-2 py-1.5 whitespace-nowrap ${p.kind === "Failed" ? "text-rose-600" : "text-amber-600"}`}>{p.kind}</td>
                      <td className="px-2 py-1.5">{p.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          <div className="flex items-center pt-2">
            {running ? (
              <button type="button" onClick={() => (stopRef.current = true)} className="mr-4 py-1.5 px-4 w-4/5 rounded-md bg-amber-500/80 text-white font-semibold">
                <span className="animate-pulse">WORKING ... STOP AFTER THIS BATCH</span>
              </button>
            ) : (
              <button type="button" onClick={run} className="mr-4 py-1.5 px-4 w-4/5 rounded-md bg-primary/70 text-white font-semibold">
                {finished ? "RUN AGAIN" : copy.run}
              </button>
            )}
            <button type="button" disabled={running} onClick={close} className="py-1.5 px-4 rounded-md bg-slate-50 border text-sm text-gray-600 disabled:opacity-50">
              {finished ? "CLOSE" : "CANCEL"}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default StudentBulkActionDialog;
