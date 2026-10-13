import React, { createRef, useMemo, useState } from "react";
import { HiOutlineArrowDownTray, HiOutlinePrinter } from "react-icons/hi2";
import { IDCardBack, IDCardFront, cardsToPdf, openPdf } from "./AISIDCard";

type Props = {
  data?: any[];
  // The group's heading, e.g. "LEVEL 100" -- used in the PDF title/file name.
  title?: string;
};

// A programme level's ID cards, in the same design as the single-student card
// (AISIDCard): fronts shown as a grid, backs rendered off-screen for the PDF.
// The PDF has two CR80 pages per student (front, back), for double-sided
// printing on a PVC card printer. As before, only students with an index
// number get a card.
function AISIDCardBulk({ data, title = "" }: Props) {
  const students = useMemo(() => (data || []).filter((r: any) => r?.indexno), [data]);
  const refs = useMemo(
    () => students.map(() => ({ front: createRef<HTMLDivElement>(), back: createRef<HTMLDivElement>() })),
    [students]
  );
  const [busy, setBusy] = useState<"" | "open" | "download">("");
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const skipped = (data || []).length - students.length;

  const makePdf = async (mode: "open" | "download") => {
    const cards = refs.map((r) => ({ front: r.front.current!, back: r.back.current! })).filter((c) => c.front && c.back);
    if (!cards.length) return;
    setBusy(mode);
    setProgress({ done: 0, total: cards.length });
    try {
      const pdf = await cardsToPdf(cards, { title: `Student ID Cards - ${title}` }, (done, total) => setProgress({ done, total }));
      if (mode === "download") pdf.save(`AKATSICO-ID-CARDS-${title.replace(/\s+/g, "-") || "batch"}.pdf`);
      else openPdf(pdf);
    } finally {
      setBusy("");
    }
  };

  if (!students.length) {
    return <p className="px-1 text-sm text-slate-400">No students with an index number in this group yet, so there are no ID cards to print.</p>;
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => makePdf("open")}
          disabled={!!busy}
          className="h-10 rounded-full flex items-center gap-2 pl-1.5 pr-4 bg-secondary-accent/5 border border-secondary-accent/20 shadow-sm disabled:opacity-60"
        >
          <HiOutlinePrinter className="text-secondary-accent h-7 w-7 p-1 bg-white border-2 border-secondary-accent/20 rounded-full" />
          <span className="font-semibold text-sm text-secondary-accent">
            {busy === "open" ? `Preparing ${progress.done} / ${progress.total} ...` : `Open ID Cards PDF (${students.length})`}
          </span>
        </button>
        <button
          onClick={() => makePdf("download")}
          disabled={!!busy}
          className="h-10 rounded-full flex items-center gap-2 pl-1.5 pr-4 bg-white border border-slate-200 shadow-sm disabled:opacity-60"
        >
          <HiOutlineArrowDownTray className="text-slate-600 h-7 w-7 p-1 bg-slate-50 border-2 border-slate-200 rounded-full" />
          <span className="font-semibold text-sm text-slate-600">
            {busy === "download" ? `Preparing ${progress.done} / ${progress.total} ...` : "Download PDF"}
          </span>
        </button>
        <span className="text-xs text-slate-400">
          Front + back per student, CR80 card size. Print at 100% / Actual size, double-sided.
          {skipped > 0 ? ` ${skipped} student${skipped === 1 ? "" : "s"} without an index number left out.` : ""}
        </span>
      </div>

      <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(86mm,1fr))]">
        {students.map((s: any, i: number) => (
          <div key={s.id} className="w-fit rounded-[3mm] overflow-hidden shadow-md shadow-slate-900/10 ring-1 ring-slate-200">
            <IDCardFront ref={refs[i].front} data={s} />
          </div>
        ))}
      </div>

      {/* Backs: only needed for the PDF. Off-screen (not display:none, which
          html2canvas can't capture). */}
      <div aria-hidden className="pointer-events-none fixed -left-[10000px] top-0">
        {students.map((s: any, i: number) => (
          <IDCardBack key={s.id} ref={refs[i].back} data={s} />
        ))}
      </div>
    </div>
  );
}

export default AISIDCardBulk;
