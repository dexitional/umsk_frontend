import React, { useRef } from "react";
import { HiOutlineArrowLeft, HiOutlinePrinter } from "react-icons/hi2";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import AdmissionLetterSheet from "../../components/ais/admission/AdmissionLetterSheet";
import Service from "../../utils/aisService";

// Admission letters ready to print: ?studentId= for one student (Student
// page) or ?programId= for a programme's newly admitted first years
// (Programme > Students > LEVEL 100 > Print Letters).
export async function loader({ request }) {
  const url = new URL(request.url);
  const studentId = url.searchParams.get("studentId") || undefined;
  const programId = url.searchParams.get("programId") || undefined;
  try {
    const bundle = await Service.fetchAdmissionLetterPrint(studentId ? { studentId } : { programId });
    return { bundle, single: !!studentId };
  } catch (error: any) {
    return { error: error?.response?.data?.message || "Admission letters could not be loaded.", single: !!studentId };
  }
}

function PgAISAdmissionLetterPrint() {
  const { bundle, error, single }: any = useLoaderData();
  const navigate = useNavigate();
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: single ? `Admission Letter ${bundle?.students?.[0]?.id || ""}` : `Admission Letters ${bundle?.students?.[0]?.program?.shortName || ""}`,
    // Small top margin: the letterhead sits near the top edge of the page.
    pageStyle: "@page { size: A4; margin: 6mm 15mm 12mm; } @media print { body { -webkit-print-color-adjust: exact; } }",
  });
  const students = bundle?.students || [];
  const program = students[0]?.program;

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row md:items-center print:hidden">
        <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary">
          <HiOutlineArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-semibold text-slate-800 md:text-base">
            {single ? "Admission Letter" : "Admission Letters"}
            {program ? ` · ${program.longName}` : ""}
          </h1>
          {!error ? (
            <p className="text-xs text-slate-400">
              {students.length} letter{students.length === 1 ? "" : "s"} · {bundle?.letter?.title} · {bundle?.session?.year || "no default session"}
              {!single ? " · Year 1 students" : ""}
            </p>
          ) : null}
        </div>
        {!error && students.length ? (
          <button type="button" onClick={handlePrint} className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark">
            <HiOutlinePrinter className="h-4 w-4" /> Print {students.length > 1 ? `${students.length} letters` : "letter"}
          </button>
        ) : null}
      </div>

      {error ? (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-6 text-center text-sm text-amber-800">{error}</p>
      ) : !students.length ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-400">No newly admitted first-year students in this programme.</p>
      ) : (
        <div ref={printRef} className="space-y-6 print:space-y-0">
          {students.map((s: any) => (
            <AdmissionLetterSheet key={s.id} letter={bundle.letter} session={bundle.session} student={s} />
          ))}
        </div>
      )}
    </div>
  );
}

export default PgAISAdmissionLetterPrint;
