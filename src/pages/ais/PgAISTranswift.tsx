import React from "react";
import SubPageTitle from "../../components/ais/SubPageTitle";
// @ts-ignore
import moment from "moment";
import { BiLoaderCircle } from "react-icons/bi";
import { TbEdit } from "react-icons/tb";
import {
  Link,
  Outlet,
  redirect,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import Logo from "../../assets/img/logo.webp";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";
import { useHasRole } from "../../utils/roles";

type Props = {};

// Delete Action for Phase
export async function action({ params }) {
  await Service.deleteLetter(params.transwiftId);
  return redirect(`/ais/transwifts/${params.transwiftId}`);
}

// Loader for Single Project
export async function loader({ params }) {
  const data = await Service.fetchTranswift(params.transwiftId);
  return { data };
}

function PgAISTranswift({}: Props) {
  const { data }: any = useLoaderData();
  const navigate = useNavigate();

  const { user } = useUserStore((state) => state);
  const navigation = useNavigation();
  const loading = navigation.state === "loading";
  const canEditTranswift = useHasRole("ais", ["transwift::admin"]);
  const canTriggerTranswift = useHasRole("ais", ["transwift::admin", "transwift::clerk"]);

  const completeRequest = async () => {
    const ok = window.confirm("Finalize Document Request?");
    if (ok) {
      const resp = await Service.upgradeTranswift(data?.id, {
        status: "COMPLETED",
        completedAt: moment(new Date()),
      });
      if (resp) setTimeout(() => navigate(0), 1000);
    }
  };

  const printRequest = async () => {
    const ok = window.confirm("Print Requested Document?");
    if (ok) {
      const resp = await Service.upgradeTranswift(data?.id, {
        status: "PRINTED",
        issuerId: user?.user?.tag,
        printedAt: moment(new Date()),
      });
      if (resp) setTimeout(() => navigate(0), 1000);
    }
  };

  return (
    <main className="md:pl-10 p-3 md:p-6 space-y-3 md:space-y-10">
      <SubPageTitle title={``} page="Transwift" />
      <div className="p-3 md:p-6 border bg-slate-50/50 rounded-xl md:space-y-6 space-y-4 ">
        <section className="relative flex space-x-2 md:space-x-6">
          <div className="hidden md:block p-2 md:p-2 h-16 w-16 md:h-24 md:w-24 border rounded-xl shadow-lg bg-white">
            <img
              src={Logo}
              className="h-12 w-12 md:h-20 md:w-20 object-contain"
            />
          </div>
          {canEditTranswift ? (
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
                {data?.transact?.transtype?.title}
              </h1>
            </div>
            <div className="w-full flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2 text-zinc-400 text-lg">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-0.5 text-xs md:text-sm font-medium tracking-wider capitalize bg-primary rounded-md text-white">
                  {data?.status}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                <span className="tracking-wider text-xs md:text-base capitalize">
                  {data?.studentId}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-0.5 bg-white border border-primary/40 text-sm text-gray-500 relative">
                  {data?.student.fname}{" "}
                  {data?.student.mname ? data?.student.mname + " " : ""}
                  {data?.student.lname}
                </span>
              </div>
            </div>
          </div>
        </section>
        <section className="grid gap-y-2 ">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4">
            {/* <h2 className="px-4 py-1 w-fit order-2 md:order-1 bg-primary/90 text-amber-100 font-medium font-roboto tracking-wider rounded-tr-xl rounded-bl-xl">RECEIPIENT INFORMATION</h2> */}
            &nbsp;
            <div className="px-4 py-1 order-1 md:order-2 space-x-2">
              {canTriggerTranswift && data.status == "PRINTED" ? (
                <button
                  onClick={completeRequest}
                  className="px-3 py-1 bg-amber-800/80 text-white text-sm font-semibold rounded"
                >
                  FINALIZE REQUEST
                </button>
              ) : null}
              {canTriggerTranswift && data.status == "PENDED" ? (
                <button
                  onClick={printRequest}
                  className="px-3 py-1 bg-green-500/80 text-white text-sm font-semibold rounded"
                >
                  UPDATE AS PRINTED
                </button>
              ) : null}
            </div>
          </div>
          <div className="p-2 w-full md:py-4 md:px-6 text-[0.65rem] md:text-xs text-gray-500 border rounded-md md:rounded-md bg-white grid grid-cols-1 md:grid-cols-5 space-y-4 md:space-y-0">
            <div className="space-y-2 md:space-y-4 md:col-span-2">
              <h2 className="px-3 md:px-4 py-0.5 md:py-1 w-fit order-2 md:order-1 bg-primary/80 text-white font-medium font-roboto tracking-wider rounded-tr-xl rounded-bl-xl">
                {data.version == "HARDCOPY" ? "POSTAL" : "EMAIL"} ADDRESS
              </h2>
              <div className="px-4 font-bold italic">
                {data?.receipient || "-- NOT PROVIDED YET --"}
              </div>
            </div>
            <div className="space-y-2 md:space-y-4">
              <h2 className="px-3 md:px-4 py-0.5 md:py-1 w-fit order-2 md:order-1 bg-primary/80 text-white font-medium font-roboto tracking-wider rounded-tr-xl rounded-bl-xl">
                DELIVERY MODE
              </h2>
              <div className="px-4 font-bold italic">{data?.mode}</div>
            </div>
            <div className="space-y-2 md:space-y-4">
              <h2 className="px-3 md:px-4 py-0.5 md:py-1 w-fit order-2 md:order-1 bg-primary/80 text-white font-medium font-roboto tracking-wider rounded-tr-xl rounded-bl-xl">
                DOCUMENT TYPE
              </h2>
              <div className="px-4 font-bold italic">{data?.version}</div>
            </div>
            <div className="space-y-2 md:space-y-4">
              <h2 className="px-3 md:px-4 py-0.5 md:py-1 w-fit order-2 md:order-1 bg-primary/80 text-white font-medium font-roboto tracking-wider rounded-tr-xl rounded-bl-xl">
                QUANTITY
              </h2>
              <div className="px-4 font-bold italic">{data?.quantity}</div>
            </div>
          </div>
        </section>

        <section className="p-2 w-full h-full md:py-4 md:px-6 flex flex-col space-y-3 md:space-y-6 border rounded-md md:rounded-md bg-white overflow-hidden">
          <Outlet />
        </section>
      </div>
    </main>
  );
}

export default PgAISTranswift;
