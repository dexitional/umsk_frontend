import React, { Suspense } from "react";
import SubPageTitle from "../../components/ams/SubPageTitle";
// @ts-ignore
import { PiSignatureBold } from "react-icons/pi";
import { redirect, useLoaderData } from "react-router-dom";
// @ts-ignore
import Logo from "../../assets/img/logo/aucc/logo.png";
import LetterTemplate from "../../components/ams/LetterTemplate";
import Service from "../../utils/amsService";
import FormTemplate from "../../components/ams/FormTemplate";
import Loader from "../../components/Loader";

type Props = {};

// Delete Action for Phase
export async function action({ params }) {
  await Service.deleteMatriculant(params.studentId);
  return redirect(`/ams/matriculants/${params.matriculantId}`);
}

// Loader for Single Project
export async function loader({ params, request }) {
  const searchParams = new URL(request.url).searchParams;
  const isForm = searchParams.get("action")?.toString();
  let data,applicant,forms;
  if(!!isForm){
    //  applicant = await Service.fetchApplicant(params.matriculantId);
    //  forms = await Service.fetchApplicantPreview(params.matriculantId);
    //  data = await Service.fetchMatriculant(params.matriculantId);
     const resp = await Promise.all([
       Service.fetchApplicant(params.matriculantId),
       Service.fetchApplicantPreview(params.matriculantId),
       Service.fetchMatriculant(params.matriculantId)]);
     if(resp) {
        applicant = resp[0];
        forms = resp[1];
        data = resp[2];
     }
  }
  else data = await Service.fetchMatriculant(params.matriculantId);
  // alert(JSON.stringify(forms))
     
  return { data,applicant,forms,isForm: !!isForm };
}

function PgAMSMatriculant({}: Props) {
  const { data,applicant,forms,isForm }: any = useLoaderData();
  console.log({ data,applicant,forms, isForm });
  return (
    <main className="md:pl-10 p-3 md:p-6 space-y-3 md:space-y-10">
      <SubPageTitle title={``} page="MATRICULANT" />
      <div className="p-3 md:p-6 border bg-slate-50/50 rounded-xl md:space-y-6 space-y-4 ">
        <section className="relative flex space-x-2 md:space-x-6">
          <div className="hidden md:block p-2 md:p-2 h-16 w-16 md:h-24 md:w-24 border rounded-xl shadow-lg bg-white">
            <img
              src={Logo}
              className="h-12 w-12 md:h-20 md:w-20 object-contain"
            />
          </div>
          {/* <Link to={`edit`} className="p-1 md:py-1.5 md:px-2 absolute right-0 top-0 bg-slate-50 border border-gray-200 rounded flex">
                <TbEdit className="h-5 w-5 text-gray-300"/>
            </Link> */}
          <div className="flex-1 flex flex-col space-y-4 md:space-y-3">
            <div className="w-full flex space-x-2">
              <div className="block md:hidden p-2 md:p-4 h-16 w-16 border rounded-xl shadow-lg bg-white">
                <img src={Logo} className="h-12 w-12 object-contain" />
              </div>
              <h1 className="pr-6 text-md md:text-3xl md:tracking-wide leading-5 font-semibold text-primary/70 capitalize">
                {data?.student?.fname} {data?.student?.mname && data?.student?.mname + " "} {data?.student?.lname}
              </h1>
            </div>
            <div className="w-full flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2 text-zinc-400 text-lg">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-0.5 text-xs md:text-sm font-medium tracking-wider capitalize bg-primary rounded-md text-white">
                  {data?.student?.gender == "M" ? "Male" : "Female"}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                <span className="tracking-wider text-xs md:text-base capitalize">
                  {data?.category?.title}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
              </div>
              <div className="flex items-center space-x-2">
                <PiSignatureBold className="md:h-6 md:w-6 text-primary/70" />
                {/* <span className="text-xs md:text-base tracking-wider font-medium capitalize">{data?.program?.longName}</span> */}
                <span className="px-1 py-0.5 bg-white border border-primary/40 rounded-lg text-sm text-gray-500 relative">
                  Level {Math.ceil(data?.semesterNum / 2) * 100}
                </span>
              </div>
            </div>
            <code className="py-2 px-4 w-fit bg-primary-accent/5 text-gray-400 md:text-gray-500 text-xs md:text-sm font-medium font-roboto">
              {data?.program?.longName}
            </code>
          </div>
        </section>
        <section className="w-full">
          <div className="p-2 w-full border rounded-md md:rounded-xl bg-white">
            { !isForm && <Suspense fallback={<div className="h-full min-h-48 w-full flex items-center justify-center"><Loader /></div>}><LetterTemplate data={data} /></Suspense>}
            { isForm && <Suspense fallback={<div className="h-full min-h-48 w-full flex items-center justify-center"><Loader /></div>}><FormTemplate data={{ applicant, data:forms }} /></Suspense>}
          </div>
        </section>
      </div>
    </main>
  );
}

export default PgAMSMatriculant;
