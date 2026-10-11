import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaFileExcel, FaUpload, FaUserPlus } from "react-icons/fa6";
import { HiOutlineBellAlert } from "react-icons/hi2";
import {
  redirect,
  useLoaderData,
  useNavigate,
  useNavigation,
  useRevalidator,
} from "react-router-dom";
import PageTitle from "../../components/ais/PageTitle";
import StudentCardItem from "../../components/ais/StudentCardItem";
import StudentListView from "../../components/ais/StudentListView";
import StudentShimCard from "../../components/shims/StudentShimCard";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";
import { excelToJson, jsonToExcel } from "../../utils/util";
import { useHasRole } from "../../utils/roles";
type Props = {};

// Where a failed upload went wrong (the backend's `stage`, plus the two
// that happen before anything is sent), shown above the problem list.
const UPLOAD_SOURCES: Record<string, string> = {
  file: "File could not be read",
  sheet: "Problem in the sheet",
  existing: "Clash with records already in the system",
  database: "Database rejected the save",
  server: "Server error",
  network: "Could not reach the server",
};
// Upload toasts: a big bell on the left, coloured by outcome, and wide
// enough for the longer upload messages.
const NOTIFY_TONES = {
  error: "bg-rose-100 text-rose-600",
  warning: "bg-amber-100 text-amber-600",
  success: "bg-emerald-100 text-emerald-600",
};
const notify = (tone: keyof typeof NOTIFY_TONES, message: string, duration = 8000) =>
  toast(message, {
    duration,
    icon: (
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${NOTIFY_TONES[tone]}`}>
        <HiOutlineBellAlert className="h-7 w-7" />
      </span>
    ),
    style: { maxWidth: "32rem", alignItems: "center", gap: "0.5rem" },
    ariaProps: { role: tone === "error" ? "alert" : "status", "aria-live": tone === "error" ? "assertive" : "polite" },
  });

// tone "warning" = a partial upload (some rows saved, the rest listed).
type UploadReport = { source: string; message: string; errors: any[]; tone?: "error" | "warning" };

// Column headers the freshers upload expects (see uploadFresher on the
// backend). Program takes a programme's code, short name or full name.
const downloadFresherSample = () =>
  jsonToExcel(
    [
      {
        "Application Number": "APP0001",
        "Last name": "DOE",
        "First name": "JOHN",
        "Middle name": "",
        Gender: "M",
        "Phone Number": "0244000000",
        Program: "BSC COMPUTER SCIENCE",
      },
    ],
    `FRESHERS_UPLOAD_SAMPLE`
  );

export async function action({ params }) {
  await Service.deleteStudent(params.studentId);
  return redirect("/ais/students");
}

export async function loader({ request }) {
  const lm = useUserStore.getState().limit;
  const pglimit = lm?.students;
  if (!pglimit) useUserStore.setState({ limit: { ...lm, students: 9 } });
  const search = new URL(request.url).searchParams.get("search") || "";
  const page = new URL(request.url).searchParams.get("page") || 1;
  const limit = new URL(request.url).searchParams.get("limit") || pglimit || 9;
  const data = await Service.fetchStudents(search, page, limit);
  return { data, search, page };
}

function PgAISStudents({}: Props) {
  const [view, setView] = useState("card");
  const { data }: any = useLoaderData();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const loading = navigation.state === "loading";
  const canCreateStudent = useHasRole("ais", ["student::admin"]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadMode, setUploadMode] = useState<"students" | "freshers">("students");
  const isFresherUpload = uploadMode === "freshers";
  const [uploading, setUploading] = useState(false);
  const [uploadReport, setUploadReport] = useState<UploadReport | null>(null);
  const uploadFileRef: any = useRef();
  // Set once anything was saved, so closing the dialog refreshes the list.
  const savedRef = useRef(false);
  // Refreshes the list's data in place -- a full reload (navigate(0)) would
  // wipe the upload toasts before they could be read.
  const revalidator = useRevalidator();

  const openUploadModal = (mode: "students" | "freshers") => {
    setUploadMode(mode);
    setUploadReport(null);
    setShowUploadModal(true);
  };
  const closeUploadModal = () => {
    setShowUploadModal(false);
    setUploading(false);
    setUploadReport(null);
    if (uploadFileRef.current) uploadFileRef.current.value = "";
    if (savedRef.current) {
      savedRef.current = false;
      revalidator.revalidate();
    }
  };
  // Every failure is toasted (with where it came from) and kept in the
  // dialog with its row-by-row problems.
  const failUpload = (report: UploadReport) => {
    notify("error", `${UPLOAD_SOURCES[report.source] || "Upload failed"}: ${report.message}`, 10000);
    setUploadReport({ ...report, tone: "error" });
    setUploading(false);
  };

  const submitUpload = async () => {
    const file = uploadFileRef.current?.files?.[0];
    if (!file) return failUpload({ source: "file", message: "Choose the sheet file to upload.", errors: [] });
    if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
      return failUpload({ source: "file", message: `"${file.name}" is not a spreadsheet. Choose an Excel (.xlsx, .xls) or .csv file.`, errors: [] });
    }
    setUploading(true);
    setUploadReport(null);
    const onReadError = (error: any) =>
      failUpload({ source: "file", message: `"${file.name}" could not be read (${error?.message || "unreadable file"}). Re-save it as .xlsx from Excel and try again.`, errors: [] });
    excelToJson(file, async (rows: any[]) => {
      if (!rows?.length) {
        return failUpload({ source: "file", message: `"${file.name}" has no data rows. Fill in the students under the header row and try again.`, errors: [] });
      }
      try {
        const resp = isFresherUpload ? await Service.uploadFresher(rows) : await Service.uploadStudent(rows);
        // Student rows themselves are created all-or-nothing, but email
        // generation + portal/GSuite staging runs per-student right after
        // and can fail independently (e.g. a transient GSuite hiccup) --
        // surface those so staff know who still needs manual "Generate
        // Email"/"Stage Account" on their Account tab.
        if (resp?.provisionErrors?.length) {
          notify(
            "warning",
            `Uploaded, but email/access setup failed for: ${resp.provisionErrors.map((e: any) => e.id).join(', ')}. Use each student's Account tab to finish setup.`,
            10000
          );
        }
        notify(
          "success",
          isFresherUpload
            ? `${resp?.count ?? rows.length} fresher(s) added. Next: Activate Admission for their programme under Admission Letters.`
            : `${resp?.count ?? rows.length} student(s) uploaded.`
        );
        savedRef.current = true;
        // Freshers already in the system were skipped and the rest saved:
        // keep the dialog open on the skipped list.
        if (resp?.skipped?.length) {
          const skippedMsg = `${resp.skipped.length} of ${resp.totalCount ?? rows.length} skipped because they already exist in the system (already uploaded?). The other ${resp.count} were added.`;
          notify("warning", `Clash with records already in the system: ${skippedMsg}`, 10000);
          setUploadReport({ source: "existing", tone: "warning", message: skippedMsg, errors: resp.skipped });
          setUploading(false);
          if (uploadFileRef.current) uploadFileRef.current.value = "";
          return;
        }
        closeUploadModal();
      } catch (error: any) {
        const body = error?.response?.data;
        if (!error?.response) {
          return failUpload({ source: "network", message: "The upload did not reach the server. Check your connection and try again; nothing was saved.", errors: [] });
        }
        failUpload({
          source: body?.stage || "server",
          message: body?.message || `Upload failed (HTTP ${error.response.status}); nothing was saved.`,
          errors: Array.isArray(body?.errors) ? body.errors : [],
        });
      }
    }, onReadError);
  };

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title="Students"
        createtext={canCreateStudent ? "New" : undefined}
        createlink={canCreateStudent ? "create" : undefined}
        pages={data?.totalPages}
        setView={setView}
        view={view}
      >
        {canCreateStudent ? (
          <>
            <button
              onClick={() => navigate(`/ais/students/sample`)}
              className="py-0 md:py-2 px-3 md:px-4 h-9 md:h-10 rounded-md border bg-primary/90 flex items-center space-x-3"
            >
              <FaFileExcel className="text-white h-3 w-3 md:h-4 md:w-4" />
              <span className="flex text-white text-sm md:text-base font-medium">Sample</span>
            </button>
            <button
              onClick={() => openUploadModal("students")}
              className="py-0 md:py-2 px-3 md:px-4 h-9 md:h-10 rounded-md border bg-primary/90 flex items-center space-x-3"
            >
              <FaUpload className="text-white h-3 w-3 md:h-4 md:w-4" />
              <span className="flex text-white text-sm md:text-base font-medium">Upload</span>
            </button>
            <button
              onClick={() => openUploadModal("freshers")}
              className="py-0 md:py-2 px-3 md:px-4 h-9 md:h-10 rounded-md border bg-primary/90 flex items-center space-x-3"
            >
              <FaUserPlus className="text-white h-3 w-3 md:h-4 md:w-4" />
              <span className="flex text-white text-sm md:text-base font-medium">Freshers</span>
            </button>
          </>
        ) : null}
      </PageTitle>

      <Dialog open={showUploadModal} onClose={closeUploadModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className={`w-full ${uploadReport?.errors?.length ? "max-w-3xl" : "max-w-md"} max-h-[90vh] overflow-y-auto rounded-xl bg-white p-4 md:p-6 space-y-4 shadow-xl`}>
            <DialogTitle className="text-sm md:text-base font-semibold text-primary/70 tracking-wide uppercase">
              {isFresherUpload ? "Upload Freshers" : "Upload Student Batch"}
            </DialogTitle>
            {isFresherUpload && (
              <p className="text-xs md:text-sm text-gray-500">
                Columns: Application Number, Last name, First name, Middle name, Gender, Phone Number, Program.
                Freshers start at Year 1 Semester 1, admitted on the 1st of the current month. Application Numbers already in the system are
                skipped and the rest are added.{" "}
                <button type="button" onClick={downloadFresherSample} className="text-primary/80 font-semibold underline">
                  Download sample
                </button>
              </p>
            )}
            <p className="text-xs md:text-sm text-gray-500">
              {isFresherUpload
                ? "Portal accounts and institute emails are created when admission is activated for the programme under Admission Letters."
                : "Institute email and portal/Google account access are generated automatically for every student in the sheet."}
            </p>
            <label className="flex flex-col space-y-2">
              <span className="text-sm text-gray-500 font-medium">Sheet File</span>
              <input
                type="file"
                ref={uploadFileRef}
                accept=".xlsx,.xls,.csv"
                onChange={() => setUploadReport(null)}
                className="focus:ring-0 border focus:border-slate-300 border-primary-dark/10 bg-primary-dark/5 text-sm text-gray-500 rounded-md file:mr-3 file:py-1 file:px-3 file:border-0 file:rounded file:bg-primary/70 file:text-white file:text-xs file:font-bold"
              />
            </label>
            {uploadReport ? (
              <div
                role="alert"
                className={`rounded-lg border p-3 space-y-2 ${uploadReport.tone === "warning" ? "border-amber-200 bg-amber-50" : "border-rose-200 bg-rose-50"}`}
              >
                <span className={`block text-[0.7rem] font-bold uppercase tracking-wider ${uploadReport.tone === "warning" ? "text-amber-700" : "text-rose-700"}`}>
                  {uploadReport.tone === "warning" ? "Partly uploaded · " : ""}
                  {UPLOAD_SOURCES[uploadReport.source] || "Upload failed"}
                </span>
                <p className={`text-xs md:text-sm ${uploadReport.tone === "warning" ? "text-amber-800" : "text-rose-800"}`}>{uploadReport.message}</p>
                {uploadReport.errors.length ? (
                  <div className="max-h-64 overflow-auto rounded-md border border-slate-100 bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className={`sticky top-0 ${uploadReport.tone === "warning" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"}`}>
                        <tr>
                          <th className="px-2 py-1.5 font-semibold">Row</th>
                          <th className="px-2 py-1.5 font-semibold">{isFresherUpload ? "Application No." : "ID"}</th>
                          <th className="px-2 py-1.5 font-semibold">Column</th>
                          <th className="px-2 py-1.5 font-semibold">Value</th>
                          <th className="px-2 py-1.5 font-semibold">{uploadReport.tone === "warning" ? "Note" : "Problem"}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-slate-600">
                        {uploadReport.errors.map((e: any, i: number) => (
                          <tr key={i}>
                            <td className="px-2 py-1.5 whitespace-nowrap">{e.row ?? "–"}</td>
                            <td className="px-2 py-1.5 whitespace-nowrap">{e.id ?? "–"}</td>
                            <td className="px-2 py-1.5 whitespace-nowrap">{e.column ?? "–"}</td>
                            <td className="px-2 py-1.5 max-w-[10rem] truncate" title={e.value ?? ""}>{e.value || "–"}</td>
                            <td className="px-2 py-1.5">{e.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </div>
            ) : null}
            <div className="flex items-center pt-2">
              <button
                disabled={uploading}
                onClick={submitUpload}
                className="mr-4 py-1.5 px-4 w-4/5 rounded-md bg-primary/70 text-white font-semibold disabled:opacity-50 disabled:animate-pulse"
                type="button"
              >
                {uploading ? <span className="animate-pulse">UPLOADING ...</span> : "UPLOAD"}
              </button>
              <button
                disabled={uploading}
                onClick={closeUploadModal}
                className="py-1.5 px-4 rounded-md bg-slate-50 border text-sm text-gray-600"
                type="button"
              >
                {uploadReport?.tone === "warning" ? "CLOSE" : "CANCEL"}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {!loading && (
        <div className="">
          {view == "card" && (
            <div className="grid md:grid-cols-3 gap-3 md:gap-6">
              {data &&
                data?.data?.map((row: any) => (
                  <StudentCardItem key={row.id} data={row} />
                ))}
              {!data?.data?.length && (
                <div className="p-3 border rounded-xl">
                  <h1 className="w-full text-center text-gray-400/70 text-[0.65rem] font-semibold tracking-widest uppercase">
                    No Records ...
                  </h1>
                </div>
              )}
            </div>
          )}
          {view == "list" && <StudentListView data={data} />}
        </div>
      )}
      {loading && <StudentShimCard view={view} />}
    </div>
  );
}

export default PgAISStudents;
