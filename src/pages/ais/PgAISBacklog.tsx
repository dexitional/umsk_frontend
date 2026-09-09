import React from "react";
import SubPageTitle from "../../components/ais/SubPageTitle";
// @ts-ignore
import toast from "react-hot-toast";
import { HiAcademicCap } from "react-icons/hi2";
import { TbEdit } from "react-icons/tb";
import { Link, redirect, useLoaderData, useNavigate } from "react-router-dom";
import Logo from "../../assets/img/logo.webp";
import Service from "../../utils/aisService";
import { useHasRole } from "../../utils/roles";
import PgAISBacklogRecord from "./PgAISBacklogRecord";

type Props = {};

// Delete Action for Phase
export async function action({ params }) {
  await Service.deleteBacklog(params.sheetId);
  return redirect(`/ais/backlogs`);
}

// Loader for Single Project
export async function loader({ params }) {
  const data = await Service.fetchBacklog(params.backlogId);
  return { data };
}

function PgAISBacklog({}: Props) {
  const navigate = useNavigate();
  const { data }: any = useLoaderData();
  const canEditBacklog = useHasRole("ais", ["backlog::admin"]);

  const approveBacklog = async () => {
    const ok = window.confirm("Commit Backlog ?");
    if (ok) {
      try {
        const dt = await Service.approveBacklog(data?.id);
        if (dt?.success) {
          toast.success("Backlog committed!");
          navigate(0);
        }
      } catch (error: any) {
        const message = error?.response?.data?.message || "Backlog not committed!";
        toast.error(message, { duration: 8000 });
      }
    }
  };

  return (
    <main className="md:pl-10 p-3 md:p-6 space-y-3 md:space-y-10">
      <SubPageTitle title={``} page="BACKLOGS" link="/ais/backlogs" />
      <div className="p-3 md:p-6 border bg-slate-50/50 rounded-xl md:space-y-6 space-y-4 ">
        <section className="relative flex space-x-2 md:space-x-6">
          <div className="hidden md:block p-2 md:p-2 h-16 w-16 md:h-24 md:w-24 border rounded-xl shadow-lg bg-white">
            <img
              src={Logo}
              className="h-12 w-12 md:h-20 md:w-20 object-contain"
            />
          </div>
          {!data.status && canEditBacklog ? (
            <Link
              to={`edit`}
              className="p-1 md:py-1.5 md:px-2 absolute right-0 top-0 bg-slate-50 border border-gray-200 rounded flex"
            >
              {/* <span className="text-gray-400">EDIT</span> */}
              <TbEdit className="h-5 w-5 text-gray-300" />
            </Link>
          ) : null}
          <div className="flex-1 flex flex-col space-y-4 md:space-y-3">
            <div className="flex space-x-2">
              <div className="block md:hidden p-2 md:p-4 h-16 w-16 border rounded-xl shadow-lg bg-white">
                <img src={Logo} className="h-12 w-12 object-contain" />
              </div>
              <h1 className="text-md md:text-xl md:tracking-wide leading-5 font-semibold text-primary/70">
                {data?.title?.toUpperCase()}
              </h1>
            </div>
            <div className="w-full flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2 text-zinc-400 text-lg">
              <div className="flex items-center space-x-2 font-semibold">
                <span
                  className={`px-3 py-0.5 text-xs md:text-sm font-bold tracking-wider capitalize ${
                    data?.status ? "bg-green-700" : "bg-primary"
                  } rounded-md text-white`}
                >
                  {data?.status ? "APPROVED" : "PENDED"}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
              </div>
              <div className="flex items-center space-x-2 font-semibold">
                <span
                  className={`px-3 py-0.5 text-xs md:text-sm font-bold tracking-wider capitalize bg-primary rounded-md text-white`}
                >
                  {data?.type}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
              </div>
              <div className="flex items-center space-x-2">
                <HiAcademicCap className="md:h-5 md:w-5 text-primary/70" />
                <span className="text-xs md:text-base tracking-wider font-medium uppercase">
                  {data?.session?.title}{" "}
                </span>
              </div>
            </div>

            {data?.creator && (
              <div className="w-full flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2 text-zinc-400 text-lg">
                <div className="flex items-center space-x-2 font-semibold">
                  <span className="px-2 py-0.5 text-xs md:text-xs font-bold tracking-wider capitalize bg-primary/80 rounded text-white">
                    CREATED BY
                  </span>
                  <span className="tracking-wider text-xs md:text-xs uppercase">
                    &nbsp;&nbsp;{data?.creator?.fname}{" "}
                    {data?.creator?.mname && data?.creator?.mname + " "}
                    {data?.creator?.lname} ( {data?.createdBy} )
                  </span>
                </div>
              </div>
            )}
            {data?.approver && (
              <div className="w-full flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2 text-zinc-400 text-lg">
                <div className="flex items-center space-x-2 font-semibold">
                  <span className="px-2 py-0.5 text-xs md:text-xs font-bold tracking-wider capitalize bg-primary/80 rounded text-white">
                    APPROVED BY
                  </span>

                  <span className="tracking-wider text-xs md:text-xs uppercase">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {data?.approver?.fname}{" "}
                    {data?.approver?.mname && data?.approver?.mname + " "}
                    {data?.approver?.lname} ( {data?.approvedBy} )
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        <section>
          {!data.status && canEditBacklog ? (
            <nav className="p-2 w-full md:p-3 flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0 border border-primary/5 rounded-md md:rounded-xl bg-primary/5 text-primary-dark/70 text-xs font-noto font-semibold tracking-wider">
              {/* <SubNavLink title="BACKLOG RECORDS" url="records" /> */}
              {/* <SubNavLink title="BACKLOG MANAGER" url="manager" /> */}
              <button
                onClick={approveBacklog}
                className="px-3 py-0.5 rounded border border-white ring-1 ring-primary bg-primary/80 text-white font-roboto tracking-widest"
              >
                COMMIT BACKLOG
              </button>
            </nav>
          ) : null}
        </section>
        <section className="gap-y-2">
          <div className="p-2 w-full md:py-4 md:px-6 flex flex-col space-y-3 md:space-y-6 border rounded-md md:rounded-xl bg-white">
            <PgAISBacklogRecord />
          </div>
        </section>
      </div>
    </main>
  );
}

export default PgAISBacklog;
