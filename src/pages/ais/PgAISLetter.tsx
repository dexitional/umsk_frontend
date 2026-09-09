import React from "react";
import SubPageTitle from "../../components/ais/SubPageTitle";
// @ts-ignore
import ReactHtml from "html-react-parser";
import moment from "moment";
import { BiLoaderCircle } from "react-icons/bi";
import { PiSignatureBold } from "react-icons/pi";
import { TbEdit } from "react-icons/tb";
import { Link, redirect, useLoaderData, useNavigation } from "react-router-dom";
import Logo from "../../assets/img/logo.webp";
import LetterTemplate from "../../components/ais/LetterTemplate";
import Service from "../../utils/aisService";
import { useHasRole } from "../../utils/roles";

type Props = {};

// Delete Action for Phase
export async function action({ params }) {
  await Service.deleteLetter(params.letterId);
  return redirect(`/ais/letters/${params.letterId}`);
}

// Loader for Single Project
export async function loader({ params }) {
  let data = await Service.fetchLetter(params.letterId);
  let student = await Service.fetchStudent("41329275");
  const deferment = {
    letterDate: moment(),
    resumeLevel: "100",
    resumeSemester: "1",
    resumeYear: "2024/2025",
  };
  data.student = student;
  data.deferment = deferment;
  return { data };
}

function PgAISLetter({}: Props) {
  const { data }: any = useLoaderData();
  const navigation = useNavigation();
  const loading = navigation.state === "loading";
  const canEditLetter = useHasRole("ais", ["sletter::admin"]);

  return (
    <main className="md:pl-10 p-3 md:p-6 space-y-3 md:space-y-10">
      <SubPageTitle title={``} page="SERVICE LETTER" />
      <div className="p-3 md:p-6 border bg-slate-50/50 rounded-xl md:space-y-6 space-y-4 ">
        <section className="relative flex space-x-2 md:space-x-6">
          <div className="hidden md:block p-2 md:p-2 h-16 w-16 md:h-24 md:w-24 border rounded-xl shadow-lg bg-white">
            <img
              src={Logo}
              className="h-12 w-12 md:h-20 md:w-20 object-contain"
            />
          </div>
          {canEditLetter ? (
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
                {data?.title?.toUpperCase()}
              </h1>
            </div>
            <div className="w-full flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2 text-zinc-400 text-lg">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-0.5 text-xs md:text-sm font-medium tracking-wider capitalize bg-primary rounded-md text-white">
                  {data?.status ? "ENABLED" : "DISABLED"}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                <span className="tracking-wider text-xs md:text-base capitalize">
                  {data?.tag?.toUpperCase()}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
              </div>
              <div className="flex items-center space-x-2">
                <PiSignatureBold className="md:h-6 md:w-6 text-primary/70" />
                {/* <span className="text-xs md:text-base tracking-wider font-medium capitalize">{data?.program?.longName}</span> */}
                <span className="px-1 py-0.5 bg-white border border-primary/40 rounded-lg text-sm text-gray-500 relative">
                  <img
                    src={data?.signature}
                    className="h-6 w-full object-fill"
                  />
                </span>
              </div>
            </div>
            <code className="py-4 px-6 w-fit bg-secondary-accent/5 text-gray-400 md:text-gray-500 text-xs md:text-sm font-roboto">
              {ReactHtml(data?.signatory || "")}
            </code>
          </div>
        </section>
        <section className="gap-y-2">
          <div className="p-2 w-full md:py-4 md:px-6 flex flex-col space-y-3 md:space-y-6 border rounded-md md:rounded-xl bg-white">
            {/* <Outlet /> */}
            <LetterTemplate data={data} />
            {/* <Page /> */}
          </div>
        </section>
      </div>
    </main>
  );
}

export default PgAISLetter;
