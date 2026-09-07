import React from "react";
import SubPageTitle from "../../components/ais/SubPageTitle";
// @ts-ignore
import { BiLoaderCircle } from "react-icons/bi";
import { TbEdit } from "react-icons/tb";
import {
  Link,
  redirect,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import Logo from "../../assets/img/logo/aucc/logo.png";
import LetterTemplate from "../../components/ais/LetterTemplate";
import Service from "../../utils/aisService";
import { useHasRole } from "../../utils/roles";

type Props = {};

// Delete Action for Phase
export async function action({ params }) {
  await Service.deleteDeferment(params.defermentId);
  return redirect(`/ais/deferments/${params.defermentId}`);
}

// Loader for Single Project
export async function loader({ params }) {
  const data = await Service.fetchDeferment(params.defermentId);
  return { data };
}

function PgAISDeferment({}: Props) {
  const { data }: any = useLoaderData();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const loading = navigation.state === "loading";
  const canEditDeferment = useHasRole("ais", ["deferment::admin", "deferment::clerk"]);
  const canManageDeferment = useHasRole("ais", ["deferment::admin"]);

  const approve = async () => {
    const ok = window.confirm("Approve Deferment Request ?");
    if (ok) {
      const resp = await Service.upgradeDeferment(data?.id, {
        status: "APPROVED",
        indexno: data?.indexno,
      });
      if (resp) setTimeout(() => navigate(0), 1000);
    }
  };

  const decline = async () => {
    const ok = window.confirm("Decline Deferment Request ?");
    if (ok) {
      const resp = await Service.upgradeDeferment(data?.id, {
        status: "DECLINED",
        indexno: data?.indexno,
      });
      if (resp) setTimeout(() => navigate(0), 1000);
    }
  };

  const resume = async () => {
    const ok = window.confirm("Active Student's Resumption ?");
    if (ok) {
      const resp = await Service.upgradeDeferment(data?.id, {
        status: "RESUMED",
        indexno: data?.indexno,
      });
      if (resp) setTimeout(() => navigate(0), 1000);
    }
  };

  return (
    <main className="md:pl-10 p-3 md:p-6 space-y-3 md:space-y-10">
      <SubPageTitle title={``} page="Deferment Profile" />
      <div className="p-3 md:p-6 border bg-slate-50/50 rounded-xl md:space-y-6 space-y-4 ">
        <section className="relative flex space-x-2 md:space-x-6">
          <div className="hidden md:block p-2 md:p-2 h-16 w-16 md:h-24 md:w-24 border rounded-xl shadow-lg bg-white">
            <img
              src={Logo}
              className="h-12 w-12 md:h-20 md:w-20 object-contain"
            />
          </div>
          {canEditDeferment ? (
            <Link
              to={loading ? `#` : `edit`}
              className="p-1 md:py-1.5 md:px-2 absolute right-0 top-0 bg-slate-50 border border-gray-200 rounded flex"
            >
              {/* <span className="text-gray-400">EDIT</span> */}
              {loading ? (
                <BiLoaderCircle className="h-5 w-5 text-gray-300 animate-spin" />
              ) : (
                <TbEdit className="h-5 w-5 text-gray-300" />
              )}
            </Link>
          ) : null}
          <div className="flex-1 flex flex-col space-y-4 md:space-y-3">
            <div className="flex space-x-2">
              <div className="block md:hidden p-2 md:p-4 h-16 w-16 border rounded-xl shadow-lg bg-white">
                <img src={Logo} className="h-12 w-12 object-contain" />
              </div>
              <h1 className="text-md md:text-3xl md:tracking-wide leading-5 font-semibold text-primary/70">
                {(
                  data?.student?.fname +
                  " " +
                  (data?.student?.mname ? data?.student?.mname + " " : "") +
                  data?.student?.lname
                ).toUpperCase()}
              </h1>
            </div>
            <div className="w-full flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2 text-zinc-400 text-lg">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-0.5 text-xs md:text-sm font-medium tracking-wider capitalize bg-primary rounded-md text-white">
                  {data?.status}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                <span className="tracking-wider text-xs md:text-sm font-medium capitalize">
                  INDEX NUMBER: {data?.student?.indexno}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
              </div>
              <div className="px-2.5 py-0 md:px-2 md:py-0.5 bg-white border border-primary/40 rounded-sm text-[0.65rem] md:text-sm text-gray-500">
                {data?.student?.program?.longName || "Not assigned"}
              </div>
            </div>
            <code className="py-1 px-3 md:py-2 md:px-6  w-fit bg-primary-accent/5 text-gray-500 md:text-gray-500 text-xs md:text-sm font-roboto">
              {data?.session?.title}{" "}
              {data?.session?.tag == "SUB" ? ", JANUARY" : "MAIN"}
            </code>
          </div>
        </section>
        <section className="grid gap-y-2 ">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4">
            <h2 className="px-4 py-1 w-fit order-2 md:order-1 bg-primary/90 text-amber-100 font-medium font-roboto tracking-wider rounded-tr-xl rounded-bl-xl">
              REASON OF DEFERMENT
            </h2>
            <div className="px-4 py-1 order-1 md:order-2 space-x-2">
              {canManageDeferment && data.status == "PENDED" ? (
                <button
                  onClick={approve}
                  className="px-3 py-1 bg-green-600/80 text-white text-xs font-medium rounded"
                >
                  APPROVE
                </button>
              ) : null}
              {canManageDeferment && data.status == "APPROVED" ? (
                <button
                  onClick={resume}
                  className="px-3 py-1 bg-amber-600/80 text-white text-xs font-medium rounded"
                >
                  ACTIVATE RESUMPTION
                </button>
              ) : null}
              {canManageDeferment && data.status == "PENDED" ? (
                <button
                  onClick={decline}
                  className="px-3 py-1 bg-red-500/80 text-white text-xs font-medium rounded"
                >
                  DECLINE
                </button>
              ) : null}
            </div>
          </div>
          <div className="p-2 w-full md:py-2 md:px-6 text-sm text-gray-500 border rounded-md md:rounded-md bg-white">
            {data?.reason}
          </div>
        </section>
        <section className="gap-y-2">
          {data.status == "APPROVED" ? (
            <div className="p-2 w-full md:py-4 md:px-6 flex flex-col space-y-3 md:space-y-6 border rounded-md md:rounded-xl bg-white">
              <LetterTemplate data={{ ...data?.letter, ...data }} />
            </div>
          ) : null}

          {data.status == "RESUMED" ? (
            <div className="p-2 w-full md:py-4 md:px-6 flex flex-col space-y-3 md:space-y-6 border rounded-md md:rounded-xl bg-white">
              {/* <LetterTemplate data={{...data?.letter,...data}} /> */}
              <div className="text-xs px-2 md:px-0 text-center md:text-left text-gray-500">
                Student has resumed academic activities ...
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}

export default PgAISDeferment;
