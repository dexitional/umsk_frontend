import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaFileExcel, FaUpload } from "react-icons/fa6";
import { redirect, useLoaderData, useNavigate, useNavigation } from "react-router-dom";
import BacklogCardItem from "../../components/ais/BacklogCardItem";
import BacklogListView from "../../components/ais/BacklogListView";
import PageTitle from "../../components/ais/PageTitle";
import BacklogShimCard from "../../components/shims/BacklogShimCard";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";
import { excelToJson } from "../../utils/util";
import { useHasRole } from "../../utils/roles";

type Props = {};

export async function action({ params }) {
  await Service.deleteSheet(params.sheetId);
  return redirect("/ais/backlogs");
}

export async function loader({ request }) {
  const lm = useUserStore.getState().limit;
  const pglimit = lm?.backlogs;
  if (!pglimit) useUserStore.setState({ limit: { ...lm, backlogs: 9 } });
  const search = new URL(request.url).searchParams.get("search") || "";
  const page = new URL(request.url).searchParams.get("page") || 1;
  const limit = new URL(request.url).searchParams.get("limit") || pglimit || 9;
  const data = await Service.fetchBacklogs(search, page, limit);
  return { data, search, page };
}

function PgAISBacklogs({}: Props) {
  const [view, setView] = useState("card");
  const {
    data: { data, totalPages, totalData },
    page,
    search,
  }: any = useLoaderData();
  const navigation = useNavigation();
  const loading = navigation.state === "loading";
  const importRef: any = useRef();
  const navigate = useNavigate();
  const canManageBacklog = useHasRole("ais", ["backlog::admin"]);

  const importTrigger = async () => {
    importRef.current.click();
  };

  const importSheet = async (e) => {
    const file = e.target.files[0];
    if (file && (file.type.match("application/vnd.openxmlformats-officedocument.*") || file.type.match("text/csv"))) {
      var error_count = 0, dataToServer = {};
      excelToJson(file, async (data) => {
        console.log(data.length);
        await Service.uploadBacklog(data);
        setTimeout(() => navigate(0), 2000);
      });
    } else {
      toast.error(`PLEASE CHOOSE EXCEL ( .XLSX ) FILE ONLY !`);
    }
  };

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title="Backlogs"
        createtext={canManageBacklog ? "New" : undefined}
        createlink={canManageBacklog ? "create" : undefined}
        pages={totalPages}
        setView={setView}
        view={view}
      />
      {canManageBacklog ? (
        <section className="w-full">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <button onClick={() => navigate(`/ais/backlogs/sample`)} className="py-0.5 px-6 rounded bg-primary-dark/80 flex items-center justify-evenly">
              <FaFileExcel className="h-4 w-6 text-white" />
              <span className="font-bold text-white">BUILD SAMPLE FILE</span>
            </button>
            <button onClick={importTrigger} className="py-0.5 px-6 rounded bg-primary-dark/80 flex items-center justify-evenly">
              <FaUpload className="h-4 w-6 text-white" />
              <span className="font-bold text-white">UPLOAD SCORES</span>
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
                <BacklogCardItem key={row.id} data={row} />
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

          {view == "list" && <BacklogListView data={data} />}
        </div>
      )}
      {loading && <BacklogShimCard view={view} />}
    </div>
  );
}

export default PgAISBacklogs;
