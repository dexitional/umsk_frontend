import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaFileExcel, FaUpload } from "react-icons/fa6";
import { useLoaderData, useNavigate, useNavigation } from "react-router-dom";
import ExamScoreCardItem from "../../components/ais/ExamScoreCardItem";
import PageTitle from "../../components/ais/PageTitle";
import BacklogShimCard from "../../components/shims/BacklogShimCard";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";
import { excelToJson } from "../../utils/util";
import { useHasRole } from "../../utils/roles";

type Props = {};

// Exam Score Manager: narrower clone of the Backlog module (PgAISBacklogs) --
// upload-only (no manual create form), backed by its own activityExam model,
// and the batches it creates are reviewed/approved on a dedicated
// /ais/examscores/:id page (PgAISExamScore).
export async function loader({ request }) {
  const lm = useUserStore.getState().limit;
  const pglimit = lm?.examscores;
  if (!pglimit) useUserStore.setState({ limit: { ...lm, examscores: 9 } });
  const search = new URL(request.url).searchParams.get("search") || "";
  const page = new URL(request.url).searchParams.get("page") || 1;
  const limit = new URL(request.url).searchParams.get("limit") || pglimit || 9;
  const data = await Service.fetchExamScoreUploads(search, page, limit);
  return { data, search, page };
}

function PgAISExamScores({}: Props) {
  const [view, setView] = useState("card");
  const {
    data: { data, totalPages, totalData },
  }: any = useLoaderData();
  const navigation = useNavigation();
  const loading = navigation.state === "loading";
  const navigate = useNavigate();
  const canManageExamScores = useHasRole("ais", ["backlog::admin"]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [tag, setTag] = useState("");
  const [uploading, setUploading] = useState(false);
  const uploadFileRef: any = useRef();

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setTag("");
    setUploading(false);
    if (uploadFileRef.current) uploadFileRef.current.value = "";
  };

  const submitUpload = async () => {
    const file = uploadFileRef.current?.files?.[0];
    if (!file || !(file.type.match("application/vnd.openxmlformats-officedocument.*") || file.type.match("text/csv"))) {
      toast.error(`PLEASE CHOOSE EXCEL ( .XLSX ) FILE ONLY !`);
      return;
    }
    setUploading(true);
    excelToJson(file, async (data) => {
      await Service.uploadExamScore(data, tag);
      setUploading(false);
      closeUploadModal();
      setTimeout(() => navigate(0), 2000);
    });
  };

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title="ExamScore Module"
        createtext={undefined}
        createlink={undefined}
        pages={totalPages}
        setView={setView}
        view={view}
      />
      {canManageExamScores ? (
        <section className="w-full">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <button onClick={() => navigate(`/ais/examscores/sample`)} className="py-0.5 px-6 rounded bg-primary-dark/80 flex items-center justify-evenly">
              <FaFileExcel className="h-4 w-6 text-white" />
              <span className="font-bold text-white">BUILD SHEET</span>
            </button>
            <button onClick={() => setShowUploadModal(true)} className="py-0.5 px-6 rounded bg-primary-dark/80 flex items-center justify-evenly">
              <FaUpload className="h-4 w-6 text-white" />
              <span className="font-bold text-white">UPLOAD SHEET</span>
            </button>
          </div>
        </section>
      ) : null}

      <Dialog open={showUploadModal} onClose={closeUploadModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-xl bg-white p-4 md:p-6 space-y-4 shadow-xl">
            <DialogTitle className="text-sm md:text-base font-semibold text-primary/70 tracking-wide uppercase">
              Upload Exam Score Sheet
            </DialogTitle>
            <label className="flex flex-col space-y-2">
              <span className="text-sm text-gray-500 font-medium">Tag</span>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. resit batch, late submissions..."
                className="focus:ring-0 border focus:border-slate-300 border-primary-dark/10 bg-primary-dark/5 text-sm text-gray-500 rounded-md"
              />
            </label>
            <label className="flex flex-col space-y-2">
              <span className="text-sm text-gray-500 font-medium">Sheet File</span>
              <input
                type="file"
                ref={uploadFileRef}
                accept=".xlsx,.xls,.csv"
                className="focus:ring-0 border focus:border-slate-300 border-primary-dark/10 bg-primary-dark/5 text-sm text-gray-500 rounded-md file:mr-3 file:py-1 file:px-3 file:border-0 file:rounded file:bg-primary/70 file:text-white file:text-xs file:font-bold"
              />
            </label>
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
                CANCEL
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
      {!loading && (
        <div className="">
          {view == "card" && (
            <div
              className={`grid ${
                data?.length ? "md:grid-cols-3" : "md:grid-cols-2 justify"
              } gap-3 md:gap-6`}
            >
              {data?.map((row: any) => (
                <ExamScoreCardItem key={row.id} data={row} />
              ))}
              {!data?.length && (
                <div className="p-3 border rounded-xl">
                  <h1 className="w-full text-center text-gray-400/70 text-[0.65rem] font-semibold tracking-widest uppercase">
                    No Records ...
                  </h1>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {loading && <BacklogShimCard view={view} />}
    </div>
  );
}

export default PgAISExamScores;
