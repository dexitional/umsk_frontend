import moment from "moment";
import React from "react";
import { useLoaderData } from "react-router-dom";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";
import RegistrationSlipItem from "../aisp/RegistrationSlipItem";
import PrintHeader from "./PrintHeader";
const { REACT_APP_API_URL } = import.meta.env;

type Props = {};

export async function loader({ params }) {
  const user = useUserStore.getState().user;
  const data = await Service.fetchRegistration(
    params?.registrationId || user?.user?.tag
  );
  return { data, user };
}

function PrintRegisterSlip({}: Props) {
  const { data, user }: any = useLoaderData();
  const totalCredit = data.reduce((sum, cur) => sum + cur.course.creditHour, 0);
 
  return (
    <div className="w-full flex flex-col justify-center items-center bg-white print:m-0 print:scale-[85%]">
      <div className="my-20 mx-auto px-16 py-20 w-full max-w-6xl rounded border shadow-sm shadow-slate-300 print:px-6 print:py-8 print:m-0 print:w-full print:max-w-screen print:shadow-none print:border-0 print:scale-100">
        <PrintHeader />
        <div className="my-4 p-3 print:px-2 print:py-2 w-full md:max-w-4xl mx-auto border rounded-xl flex flex-col md:flex-row print:flex-row space-x-6">
          <div className="p-2 w-36 h-36 print:w-24 print:h-24 border rounded-lg relative flex items-center justify-center">
            <img
              crossOrigin="anonymous"
              src={`${REACT_APP_API_URL}/auth/photos/?tag=${data[0]?.student?.id}`}
              className="h-32 w-32 print:w-20 print:h-20 object-contain"
            />
          </div>
          <div className="print:leading-4 space-y-1 print:space-y-0 text-sm print:text-[0.6rem] font-medium font-roboto uppercase">
            <div className="flex space-x-10">
              <span className="w-32 tracking-widest text-gray-400">
                Full Name
              </span>{" "}
              <span className="uppercase text-primary/90 font-roboto">
                {data[0]?.student?.fname?.toLowerCase()}{" "}
                {data[0]?.student?.mname?.toLowerCase()}{" "}
                {data[0]?.student?.lname?.toLowerCase()}
              </span>
            </div>
            <div className="flex space-x-10">
              <span className="w-32 tracking-widest text-gray-400">
                Programme
              </span>{" "}
              <span className="uppercase text-primary/90 font-roboto">
                {data[0]?.student?.program?.longName.toLowerCase()}
              </span>
            </div>
            <div className="flex space-x-10">
              <span className="w-32 tracking-widest text-gray-400">
                Student ID
              </span>{" "}
              <span className="uppercase text-primary/90 font-roboto">
                {data[0]?.student?.id}{" "}
              </span>
            </div>
            <div className="flex space-x-10">
              <span className="w-32 tracking-widest text-gray-400">
                Index Number
              </span>{" "}
              <span className="uppercase text-primary/90 font-roboto">
                {data[0]?.student?.indexno}{" "}
              </span>
            </div>
            <div className="flex space-x-10">
              <span className="w-32 tracking-widest text-gray-400">
                Department
              </span>{" "}
              <span className="uppercase text-primary/90 font-roboto">
                {data[0]?.student?.program?.department?.title.toLowerCase()}
              </span>
            </div>
            <div className="flex space-x-10">
              <span className="w-32 tracking-widest text-gray-400">Level</span>{" "}
              <span className="uppercase text-primary/90 font-roboto">
                {Math.ceil(data[0]?.student?.semesterNum / 2) * 100
                  ? Math.ceil(data[0]?.student?.semesterNum / 2) * 100
                  : "COMPLETED"}{" "}
              </span>
            </div>
          </div>
        </div>

        <div
          className="my-10 mx-auto max-w-4xl w-full flex flex-col space-y-8"
          style={{ font: "16px 'Arial Narrow MT Std', sans-serif" }}
        >
          <h2 className="text-lg text-primary tracking-widest underline font-bold font-roboto text-center">
            {data && data[0]?.session?.title?.toUpperCase()} REGISTRATION SLIP
          </h2>
          <div className="pt-4 grid grid-cols-1 gap-y-2 border bg-slate-50/50 rounded-xl">
            <div className="px-6 pb-4 hidden md:grid print:grid grid-cols-5 place-items-center border-b border-slate-200 text-xs text-primary font-sans font-semibold uppercase tracking-widest">
              <div className="place-self-start">Code</div>
              <div className="col-span-2 place-self-start">Course</div>
              <div>Credit</div>
              <div>&nbsp;</div>
            </div>
            <div className="w-full grid grid-cols-1 text-base text-primary font-roboto font-medium tracking-wider">
              {data?.map((row: any) => (
                <RegistrationSlipItem key={row.id} row={row} />
              ))}
              {!data.length && (
                <h1 className="w-full text-center text-gray-400 text-[0.65rem] font-semibold tracking-widest uppercase">
                  No Courses
                </h1>
              )}
            </div>

            <div className="w-full px-6 pb-4 flex text-xs print:text-[0.65rem] text-primary/70 font-roboto font-semibold uppercase tracking-widest">
              <div className="w-44 print:hidden">&nbsp;</div>
              <div className="md:flex-1 print:flex-1  flex items-center justify-between">
                <span>
                  Total Credits:&nbsp;&nbsp;&nbsp;
                  <span className="text-primary-accent">{totalCredit}</span>
                </span>
              </div>
              <div className="md:flex-1 print:flex-1  flex items-center justify-between">
                <span>
                  Date of Registration:&nbsp;&nbsp;&nbsp;
                  <span className="text-primary-accent">
                    {moment().format("MMM DD, YYYY") || "Not Set"}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrintRegisterSlip;
