import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaFileExcel, FaUpload } from "react-icons/fa6";
import {
  redirect,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import PageTitle from "../../components/ais/PageTitle";
import StudentCardItem from "../../components/ais/StudentCardItem";
import StudentListView from "../../components/ais/StudentListView";
import StudentShimCard from "../../components/shims/StudentShimCard";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";
import { excelToJson } from "../../utils/util";
import { useHasRole } from "../../utils/roles";
type Props = {};

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
  const [uploading, setUploading] = useState(false);
  const uploadFileRef: any = useRef();

  const closeUploadModal = () => {
    setShowUploadModal(false);
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
    excelToJson(file, async (rows: any[]) => {
      try {
        await Service.uploadStudent(rows);
        closeUploadModal();
        setTimeout(() => navigate(0), 2000);
      } catch (error: any) {
        const message = error?.response?.data?.message || "Students not uploaded!";
        toast.error(message, { duration: 8000 });
        setUploading(false);
      }
    });
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
              onClick={() => setShowUploadModal(true)}
              className="py-0 md:py-2 px-3 md:px-4 h-9 md:h-10 rounded-md border bg-primary/90 flex items-center space-x-3"
            >
              <FaUpload className="text-white h-3 w-3 md:h-4 md:w-4" />
              <span className="flex text-white text-sm md:text-base font-medium">Upload</span>
            </button>
          </>
        ) : null}
      </PageTitle>

      <Dialog open={showUploadModal} onClose={closeUploadModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-xl bg-white p-4 md:p-6 space-y-4 shadow-xl">
            <DialogTitle className="text-sm md:text-base font-semibold text-primary/70 tracking-wide uppercase">
              Upload Student Batch
            </DialogTitle>
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
