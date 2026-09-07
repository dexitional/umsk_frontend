import React from "react";
import { useLoaderData } from "react-router-dom";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";
import PrintHeader from "./PrintHeader";

type Props = {};

export async function loader({ params }) {
  const user = useUserStore.getState().user;
  const data = await Service.fetchRegistration(
    params?.registrationId || user?.user?.tag
  );
  return { data, user };
}

function PrintAdmissionSlip({}: Props) {
  const { data, user }: any = useLoaderData();
  const totalCredit = data.reduce((sum, cur) => sum + cur.course.creditHour, 0);
  console.log("Mdata", data);

  return (
    <div className="w-full flex flex-col justify-center items-center bg-white print:m-0 print:scale-90">
      <div className="my-20 mx-auto px-16 py-20 w-full max-w-6xl rounded border shadow-sm shadow-slate-300 print:px-6 print:py-8 print:m-0 print:w-full print:max-w-screen print:shadow-none print:border-0 print:scale-100">
        <PrintHeader />
        <div className="my-4 w-full md:max-w-4xl mx-auto flex flex-col md:flex-row space-x-6">
          <div className="p-2 border relative">
            <img
              src={`https://cdn.ucc.edu.gh/photos/?tag=0 `}
              className="h-20 object-contain"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex space-x-10">
              <span className="w-20">Full Name:</span>{" "}
              <span className="capitalize">
                {data[0]?.student?.fname?.toLowerCase()}{" "}
                {data[0]?.student?.mname?.toLowerCase()}{" "}
                {data[0]?.student?.lname?.toLowerCase()}
              </span>
            </div>
            <div className="flex space-x-10">
              <span className="w-20">Programme:</span>{" "}
              <span className="capitalize">
                {data[0]?.student?.program?.longName.toLowerCase()}
              </span>
            </div>
            <div className="flex space-x-10">
              <span className="w-20">Department:</span>{" "}
              <span className="capitalize">
                {data[0]?.student?.program?.department?.title.toLowerCase()}
              </span>
            </div>
            <div className="flex space-x-10">
              <span className="w-20">Level:</span>{" "}
              <span>
                {(Math.ceil(data[0]?.student?.semesterNum) / 2) * 100}{" "}
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
          <div className="pt-6 grid grid-cols-1 gap-y-4 border bg-slate-50/50 rounded-xl">
            Admission Letter Test
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrintAdmissionSlip;
