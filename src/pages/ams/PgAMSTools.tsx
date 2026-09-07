import React from "react";
import { FaCheckCircle, FaExclamationTriangle, FaFileArchive } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Service from "../../utils/amsService";

type Props = {};

function PgAMSTools({}: Props) {
  const queryClient = useQueryClient();

  const { data: preview, isLoading } = useQuery({
    queryKey: ["ams-blob-migration-preview"],
    queryFn: () => Service.fetchBlobMigrationPreview(),
  });

  const migrateMutation = useMutation({
    mutationFn: () => Service.runBlobMigration(),
    onSuccess: (summary: any) => {
      const failed = (summary?.applicant?.failed || 0) + (summary?.stepDocument?.failed || 0);
      const migrated = (summary?.applicant?.migrated || 0) + (summary?.stepDocument?.migrated || 0);
      if (failed > 0) {
        toast.error(`Migrated ${migrated}, but ${failed} row(s) failed — see details below.`);
      } else {
        toast.success(`Migrated ${migrated} record(s) to file storage.`);
      }
      queryClient.setQueryData(["ams-blob-migration-result"], summary);
      queryClient.invalidateQueries({ queryKey: ["ams-blob-migration-preview"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Migration failed to run.");
    },
  });

  const result: any = queryClient.getQueryData(["ams-blob-migration-result"]);

  const applicantPending = preview?.applicant?.pending || 0;
  const docPending = preview?.stepDocument?.pending || 0;
  const totalPending = applicantPending + docPending;

  const runMigration = () => {
    const ok = window.confirm(
      `This will move ${totalPending} record(s)' photo/document data out of the database and onto disk, then clear the original database field once each file is verified written. This cannot be undone from here. Continue?`
    );
    if (ok) migrateMutation.mutate();
  };

  return (
    <main className="md:my-6 md:px-6 p-3 space-y-4 md:space-y-6 font-inter">
      <div>
        <h1 className="text-xl md:text-2xl font-bold font-poppins text-primary">
          Storage Tools
        </h1>
        <p className="text-xs md:text-sm text-slate-400">
          Move applicant photos and step documents out of the database and onto disk
        </p>
      </div>

      <div className="p-5 md:p-6 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-5">
        <div className="flex items-start space-x-3">
          <div className="h-10 w-10 rounded-lg bg-primary-accent/10 flex items-center justify-center shrink-0">
            <FaFileArchive className="h-4 w-4 text-primary-accent" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-poppins text-primary">
              Blob → File Migration
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Applicant photos and step documents currently stored as base64 in the
              database are written to a file on the server and referenced by a{" "}
              <code className="px-1 py-0.5 rounded bg-slate-100 text-primary/80">path</code>{" "}
              column instead. Safe to run repeatedly — only rows without a path yet
              are touched, and a row's original data is only cleared after its file
              is confirmed written to disk.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-xs text-slate-400 uppercase tracking-wider">Loading current status…</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
              <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">
                Applicant photos pending
              </div>
              <div className="text-lg font-bold text-primary">{applicantPending}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
              <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">
                Applicant photos migrated
              </div>
              <div className="text-lg font-bold text-primary">{preview?.applicant?.migrated || 0}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
              <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">
                Documents pending
              </div>
              <div className="text-lg font-bold text-primary">{docPending}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
              <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">
                Documents migrated
              </div>
              <div className="text-lg font-bold text-primary">{preview?.stepDocument?.migrated || 0}</div>
            </div>
          </div>
        )}

        {preview?.stepDocument?.unrecoverable > 0 ? (
          <div className="p-3 rounded-xl bg-red-50 border border-red-100 flex items-start space-x-2">
            <FaExclamationTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs text-red-500">
              {preview.stepDocument.unrecoverable} document record(s) already lost their
              original data (an older bug overwrote the stored value with a file
              reference before any file existed) and can't be migrated — nothing
              to do for those; they'd need to be re-uploaded by the applicant.
            </p>
          </div>
        ) : null}

        <button
          onClick={runMigration}
          disabled={migrateMutation.isPending || totalPending === 0}
          className="px-5 py-2.5 rounded-lg bg-primary-accent text-white font-semibold text-sm hover:bg-primary-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {migrateMutation.isPending
            ? "Migrating…"
            : totalPending === 0
              ? "Nothing pending"
              : `Migrate ${totalPending} Record${totalPending === 1 ? "" : "s"}`}
        </button>

        {result ? (
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Last Run Result
            </h3>
            <div className="flex items-center space-x-2 text-sm text-primary">
              <FaCheckCircle className="h-4 w-4 text-green-500" />
              <span>
                Applicants: {result.applicant?.migrated || 0} migrated, {result.applicant?.failed || 0} failed
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-primary">
              <FaCheckCircle className="h-4 w-4 text-green-500" />
              <span>
                Documents: {result.stepDocument?.migrated || 0} migrated,{" "}
                {result.stepDocument?.unrecoverable || 0} unrecoverable, {result.stepDocument?.failed || 0} failed
              </span>
            </div>
            {[...(result.applicant?.errors || []), ...(result.stepDocument?.errors || [])].length > 0 ? (
              <ul className="text-xs text-red-500 space-y-1 pl-4 list-disc">
                {[...(result.applicant?.errors || []), ...(result.stepDocument?.errors || [])].map((e: any, i: number) => (
                  <li key={i}>{e.serial || e.id}: {e.error}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>
    </main>
  );
}

export default PgAMSTools;
