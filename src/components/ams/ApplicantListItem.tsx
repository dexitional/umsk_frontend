import React from "react";
// @ts-ignore
import { CgTemplate } from "react-icons/cg";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { Form, Link } from "react-router-dom";
import ListHeading from "./ListHeading";

type Props = {
  data: any;
};

function ApplicantListItem({ data }: Props) {
  return (
    <div className="px-3 md:px-6 pb-4 grid md:grid-cols-8 gap-y-4 md:gap-y-0 md:gap-x-4 md:place-items-center text-gray-500 border-b border-slate-200 hover:bg-slate-50/50 group">
      <div className="capitalize md:col-span-2 md:place-self-start flex flex-col space-y-2">
        <ListHeading title="Applicant Name" />
        <div className="px-2 flex items-center space-x-3 md:space-x-4">
          {/* <img src={Logo} className="h-5 w-5 object-contain"/> */}
          <span>
            {(
              data?.profile?.fname +
              " " +
              (data?.profile?.mname ? data?.profile?.mname + " " : "") +
              data?.profile?.lname
            ).toLowerCase()}
          </span>
        </div>
      </div>
      <div className="capitalize flex flex-col space-y-2">
        <ListHeading title="Applicant ID" />
        <span className="px-2">{data?.serial}</span>
      </div>
      <div className="md:col-span-2 capitalize flex flex-col space-y-2">
        <ListHeading title="Main Choice" />
        <span className="flex-wrap ">
          {data.choice?.program?.longName?.toLowerCase() ||
            " No Program Chosen "}
        </span>
      </div>
      <div className="capitalize flex flex-col flex-wrap space-y-2">
        <ListHeading title="Apply Mode" />
        <div className="px-2 flex flex-col space-y-2">
          <span className=" text-primary/80 font-semibold">
            {data.stage?.title?.toLowerCase()}{" "}
          </span>
          <span className="capitalize md:px-0">
            {data.stage?.categoryId == "CP"
              ? "Certificate Programs"
              : data.stage?.categoryId == "DP"
              ? "Diploma Programs"
              : data.stage?.categoryId == "UG"
              ? "Undergrad Programs"
              : "Postgraduate Programs"}
          </span>
          {/* <span className="text-[0.65rem]">{data.applyType?.title?.toUpperCase()}{data.stage?.categoryId  == 'CP' ? 'CERTIFICATE PROGRAM': data.stage?.categoryId  == 'DP' ? 'DIPLOMA PROGRAM': data.stage?.categoryId  == 'UG' ? 'UNDERGRAD PROGRAMS': 'POSTGRADUATE PROGRAMS'}</span> */}
        </div>
      </div>
      <div className="capitalize flex flex-col space-y-2">
        <ListHeading title="Status" />
        <span className="px-2 text-xs">
          {data?.submitted ? "SUBMITTED" : "IN-PROGRESS"}
        </span>
      </div>

      <div className="flex flex-col space-y-2">
        <ListHeading title="Action" />
        <div className="px-2 md:ml-6 w-fit flex items-center justify-evenly space-x-2">
          <Link
            to={`${encodeURIComponent(data?.serial)}`}
            className="p-2 rounded-full flex items-center space-x-1.5 bg-primary/60"
          >
            <CgTemplate className="h-4 w-4 text-amber-100" />
            <span className="hidden text-sm text-white font-semibold">
              View
            </span>
          </Link>
          {/* <Link to={`${encodeURIComponent(data?.id)}/edit`}  className="p-2 rounded-full flex items-center space-x-1.5 bg-primary/50">
                    <MdEditDocument className="h-4 w-4 text-green-100"/>
                    <span className="hidden text-sm text-white font-semibold">Edit</span>
                </Link> */}
          {/* <Form method="post" action={`${encodeURIComponent(data?.id)}/destroy`} onSubmit={(e)=> { if(!confirm("Do you want to delete")) e.preventDefault(); return false; }} className="p-2 rounded-full flex items-center space-x-1.5 bg-primary/50">
                    <FaTrash className="h-4 w-4 text-pink-100" />
                    <button type="submit" className="hidden text-sm text-white font-semibold">Delete</button>
                </Form> */}
          {!data?.sorted && data?.submitted ? (
            <Form
              method="post"
              action={`${data?.serial}/shortlist`}
              onSubmit={(e) => {
                if (!confirm("Shortlist Applicant?")) e.preventDefault();
                return false;
              }}
              className="p-1.5 rounded-full flex items-center space-x-1.5 bg-primary/50"
            >
              <IoCheckmarkDoneCircleSharp className="h-5 w-5 text-green-200" />
              <button
                type="submit"
                className="hidden text-sm text-white font-semibold"
              >
                Shortlist
              </button>
            </Form>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ApplicantListItem;
