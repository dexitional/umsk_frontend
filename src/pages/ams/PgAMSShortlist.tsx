import React from "react";
import SubPageTitle from "../../components/ams/SubPageTitle";
// @ts-ignore
import { HiAcademicCap } from "react-icons/hi2";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { Link, redirect, useLoaderData } from "react-router-dom";
import Logo from "../../assets/img/logo/aucc/logo.png";
import FormTemplate from "../../components/ams/FormTemplate";
import Service from "../../utils/amsService";
import { useHasRole } from "../../utils/roles";
import { resolveAmsPhotoSrc } from "../../utils/amsFile";

type Props = {};

// Delete Action for Phase
export async function action({ params }) {
  await Service.deleteShortlist(params.shortlistId);
  return redirect(`/ams/shortlists/${params.shortlistId}`);
}

// Loader for Single Project
export async function loader({ params }) {
  const shortlist = await Service.fetchShortlist(params.shortlistId);
  const applicant = await Service.fetchApplicant(params.shortlistId);
  const data = await Service.fetchApplicantPreview(params.shortlistId);
  return { data, applicant, shortlist };
}

function PgAMSShortlist({}: Props) {
  const { data, applicant, shortlist }: any = useLoaderData();
  const canProcessShortlist = useHasRole("ams", ["shortlist::admin-ug", "shortlist::admin-pg"]);

  return (
    <main className="md:pl-10 p-3 md:p-6 space-y-3 md:space-y-10">
      <SubPageTitle title={``} page="APPLICANT" />
      <div className="p-3 md:p-6 border bg-slate-50/50 rounded-xl md:space-y-6 space-y-4 ">
        <section className="relative flex space-x-2 md:space-x-6">
          <div className="hidden md:block p-2 md:p-2 h-16 w-16 md:h-24 md:w-24 border rounded-xl shadow-lg bg-white">
            <img
              src={resolveAmsPhotoSrc(applicant, Logo)}
              className="h-12 w-12 md:h-20 md:w-20 object-contain"
            />
          </div>
          {/* <pre>{JSON.stringify(shortlist)}</pre> */}
          {!shortlist?.admitted && applicant?.submitted && canProcessShortlist ? (
            <Link
              to={`process`}
              className="p-1 md:py-1 md:px-3 absolute right-0 top-0 bg-slate-50 hover:bg-primary-accent/5 border border-gray-200 hover:border-primary-accent/40 rounded flex items-center md:space-x-2 group"
            >
              <span className="text-gray-400 hidden md:flex">
                Admit Applicant
              </span>
              <IoCheckmarkDoneCircleSharp className="h-5 w-5 text-gray-300 group-hover:text-primary-accent/70" />
            </Link>
          ) : null}

          <div className="flex-1 flex flex-col space-y-4 md:space-y-3">
            <div className="flex space-x-2">
              <div className="block md:hidden p-2 md:p-4 h-16 w-16 border rounded-xl shadow-lg bg-white">
                <img
                  src={resolveAmsPhotoSrc(applicant, Logo)}
                  className="h-12 w-12 object-contain"
                />
              </div>
              <h1 className="text-md md:text-3xl md:tracking-wide leading-5 font-semibold text-primary/70">
                {(
                  applicant?.profile?.fname +
                  " " +
                  (applicant?.profile?.mname
                    ? applicant?.profile?.mname + " "
                    : "") +
                  applicant?.profile?.lname
                ).toUpperCase()}
              </h1>
            </div>
            <div className="w-full flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2 text-zinc-400 text-lg">
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-3">
                <span className="px-3 py-0.5 w-fit text-xs md:text-sm font-medium tracking-wider capitalize bg-primary rounded-md text-white">
                  {shortlist?.admitted ? `ADMITTED` : "IN-PROGRESS"}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 hidden md:flex"></div>
                <span className="tracking-wider text-xs md:text-base capitalize">
                  {applicant?.stage?.title?.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="flex items-center md:space-x-2">
              <HiAcademicCap className="hidden md:flex md:h-6 md:w-6 text-primary/70" />
              {/* <span className="text-xs md:text-base tracking-wider font-medium capitalize">{data?.program?.longName}</span> */}
              <span className="px-2 py-0.5 md:py-0 bg-white border border-primary/40 rounded text-xs md:text-sm text-gray-500 font-medium relative">
                {applicant.choice?.program?.longName || "No Program Set"}
              </span>
            </div>
            {/* <code className="py-4 px-6 w-fit bg-primary-accent/5 text-gray-400 md:text-gray-500 text-xs md:text-sm font-roboto">{ReactHtml(data.signatory)}</code> */}
          </div>
        </section>
        <section>
          <div className="relative p-2 w-full md:py-4 md:px-6 flex flex-col space-y-3 md:space-y-6 border rounded-md md:rounded-xl bg-white">
            {/* <Outlet /> */}
            <FormTemplate data={{ applicant, data }} />
          </div>
        </section>
      </div>
    </main>
  );
}

export default PgAMSShortlist;
