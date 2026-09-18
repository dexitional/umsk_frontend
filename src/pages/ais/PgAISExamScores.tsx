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
// upload-only (no manual create form), list is filtered to
// activityBacklog.type == EXAM_SCORE, and the batches it creates are
// reviewed/approved on the same shared /ais/backlogs/:id page as any other
// backlog, since that page is already generic over type.
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
  const importRef: any = useRef();
  const navigate = useNavigate();
  const canManageExamScores = useHasRole("ais", ["backlog::admin"]);

  const importTrigger = async () => {
    importRef.current.click();
  };

  const importSheet = async (e) => {
    const file = e.target.files[0];
    if (file && (file.type.match("application/vnd.openxmlformats-officedocument.*") || file.type.match("text/csv"))) {
      excelToJson(file, async (data) => {
        await Service.uploadExamScore(data);
        setTimeout(() => navigate(0), 2000);
      });
    } else {
      toast.error(`PLEASE CHOOSE EXCEL ( .XLSX ) FILE ONLY !`);
    }
  };

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title="Exam Score Manager"
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
              <span className="font-bold text-white">BUILD SAMPLE FILE</span>
            </button>
            <button onClick={importTrigger} className="py-0.5 px-6 rounded bg-primary-dark/80 flex items-center justify-evenly">
              <FaUpload className="h-4 w-6 text-white" />
              <span className="font-bold text-white">UPLOAD EXAM SCORES</span>
            </button>
            <input
              type="file"
              name="import"
              ref={importRef}
              onChange={importSheet}
              style={{ display: "none" }}
            />
          </div>
        </section>
      ) : null}
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
