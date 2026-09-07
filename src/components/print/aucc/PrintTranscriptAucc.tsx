import React from "react";
import { useLoaderData } from "react-router-dom";
import Service from "../../../utils/aisService";
import { useUserStore } from "../../../utils/authService";
import PrintHeaderAucc from "./PrintHeaderAucc";
const { REACT_APP_API_URL } = import.meta.env;

type Props = {};

export async function loader({ params }) {
  const user = useUserStore.getState().user;
  const data = await Service.fetchRegistration(
    params?.studentId || user?.user?.tag
  );
  return { data, user };
}

function PrintTranscriptAucc({}: Props) {
  const { data, user }: any = useLoaderData();
  console.log(data);
  const totalCredit = data?.reduce(
    (sum, cur) => sum + cur?.course.creditHour,
    0
  );

  return (
    <div className="w-full flex flex-col justify-center items-center bg-white print:m-0 print:scale-[85%]">
      <div className="my-20 mx-auto px-16 py-20 w-full rounded border shadow-sm shadow-slate-300 print:px-6 print:py-8 print:m-0 print:w-full print:max-w-screen print:shadow-none print:border-0 print:scale-100">
        <PrintHeaderAucc />
        <div className="my-4 print:px-2 print:py-2 w-full md:max-w-4xl mx-auto flex flex-col md:flex-row print:flex-row space-x-6">
          {/* <div className="print:leading-4 space-y-1 print:space-y-0 text-sm print:text-[0.6rem] font-medium font-roboto uppercase">
                  <div className="flex space-x-10"><span className="w-32 tracking-widest text-gray-400">Full Name</span> <span className="uppercase text-primary/90 font-poppins">{data[0]?.student?.fname?.toLowerCase()} {data[0]?.student?.mname?.toLowerCase()} {data[0]?.student?.lname?.toLowerCase()}</span></div>
                  <div className="flex space-x-10"><span className="w-32 tracking-widest text-gray-400">Programme</span> <span className="uppercase text-primary/90 font-poppins">{data[0]?.student?.program?.longName.toLowerCase()}</span></div>
                  <div className="flex space-x-10"><span className="w-32 tracking-widest text-gray-400">Student ID</span> <span className="uppercase text-primary/90 font-poppins">{ data[0]?.student?.id  } </span></div>
                  <div className="flex space-x-10"><span className="w-32 tracking-widest text-gray-400">Index Number</span> <span className="uppercase text-primary/90 font-poppins">{ data[0]?.student?.indexno } </span></div>
                  <div className="flex space-x-10"><span className="w-32 tracking-widest text-gray-400">Department</span> <span className="uppercase text-primary/90 font-poppins">{data[0]?.student?.program?.department?.title.toLowerCase()}</span></div>
                  <div className="flex space-x-10"><span className="w-32 tracking-widest text-gray-400">Level</span> <span className="uppercase text-primary/90 font-poppins">{ (Math.ceil(data[0]?.student?.semesterNum / 2 ) * 100) ? (Math.ceil(data[0]?.student?.semesterNum / 2 ) * 100):'COMPLETED' } </span></div>
                </div> */}

          <div className="my-6 flex space-x-14 text-base font-normal font-[times] leading-[1.35rem] tracking-wide">
            <div className="flex-2">
              <p>
                NAME:&nbsp;&nbsp;<strong>ACKAH, EBENEZER KWABENA BLAY</strong>
              </p>
              <p>
                INDEX NO:&nbsp;&nbsp;<strong>MLK/MLT/20/008</strong>
              </p>
              <p>
                PROGRAMME:&nbsp;&nbsp;
                <strong>HND, MEDICAL LABORATORY TECHNOLOGY</strong>
              </p>
            </div>
            <div className="flex-1">
              <p>
                CLASS:&nbsp;&nbsp;<strong>SECOND CLASS LOWER DIVISION</strong>
              </p>
              <p>
                DATE PRINTED:&nbsp;&nbsp;<strong>27/05/2024</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="my-10 mx-auto max-w-4xl w-full flex flex-col space-y-8 font-[times]">
          <div className="grid grid-cols-1 gap-y-0.5">
            <div className="md:flex print:flex text-base text-primary uppercase tracking-wide">
              <h2 className="flex-1 text-center">LEVEL 200 SEMESTER 1</h2>
            </div>
            <div className="pt-0.5 pb-3 hidden md:flex print:flex border-t border-b border-gray-600 font- text-[0.94rem] text-primary uppercase tracking-wide">
              <div className="w-32">COURSE CODE</div>
              <div className="flex-1">COURSE TITLE</div>
              <div className="w-24 text-center">CREDITS</div>
              <div className="w-24 text-center">GRADE</div>
              <div className="w-24 text-center">GPT</div>
            </div>
            <div className="-space-y-0.5 text-base">
              <div className="hidden md:flex print:flex text-primary tracking-wide">
                <div className="w-32">MLT 211</div>
                <div className="flex-1">Microbiology II</div>
                <div className="w-24 text-center">2</div>
                <div className="w-24 text-center">B+</div>
                <div className="w-24 text-center">6.0</div>
              </div>
              <div className="hidden md:flex print:flex text-primary tracking-wide">
                <div className="w-32">MLT 211</div>
                <div className="flex-1">Microbiology II</div>
                <div className="w-24 text-center">2</div>
                <div className="w-24 text-center">B+</div>
                <div className="w-24 text-center">6.0</div>
              </div>
              <div className="hidden md:flex print:flex text-primary tracking-wide">
                <div className="w-32">MLT 211</div>
                <div className="flex-1">Microbiology II</div>
                <div className="w-24 text-center">2</div>
                <div className="w-24 text-center">B+</div>
                <div className="w-24 text-center">6.0</div>
              </div>
              <div className="hidden md:flex print:flex text-primary tracking-wide">
                <div className="w-32">MLT 211</div>
                <div className="flex-1">Microbiology II</div>
                <div className="w-24 text-center">2</div>
                <div className="w-24 text-center">B+</div>
                <div className="w-24 text-center">6.0</div>
              </div>
              <div className="hidden md:flex print:flex text-primary tracking-wide">
                <div className="w-32">MLT 211</div>
                <div className="flex-1">Microbiology II</div>
                <div className="w-24 text-center">2</div>
                <div className="w-24 text-center">B+</div>
                <div className="w-24 text-center">6.0</div>
              </div>
              <div className="hidden md:flex print:flex text-primary tracking-wide">
                <div className="w-32">MLT 211</div>
                <div className="flex-1">Microbiology II</div>
                <div className="w-24 text-center">2</div>
                <div className="w-24 text-center">B+</div>
                <div className="w-24 text-center">6.0</div>
              </div>
              <div className="hidden md:flex print:flex text-primary tracking-wide">
                <div className="w-32">MLT 211</div>
                <div className="flex-1">Microbiology II</div>
                <div className="w-24 text-center">2</div>
                <div className="w-24 text-center">B+</div>
                <div className="w-24 text-center">6.0</div>
              </div>
              <div className="hidden md:flex print:flex text-primary tracking-wide">
                <div className="w-32">MLT 211</div>
                <div className="flex-1">Microbiology II</div>
                <div className="w-24 text-center">2</div>
                <div className="w-24 text-center">B+</div>
                <div className="w-24 text-center">6.0</div>
              </div>

              <div className="hidden md:flex print:flex text-primary tracking-wide">
                <div className="w-32 font-semibold">
                  <br />
                  CPA: 2.67
                </div>
                <div className="flex-1 font-semibold">
                  <br />
                  CGPA: 2.583
                </div>
                <div className="w-24 text-center border-t-2 border-gray-500">
                  <div>21</div>
                  <div>102</div>
                </div>
                <div className="w-24 text-center font-black text-xl">_</div>
                <div className="w-24 text-center border-t-2 border-gray-500">
                  <div>21</div>
                  <div>102</div>
                </div>
              </div>
            </div>

            {/*                     
                    <div className="w-full px-6 pb-4 flex text-xs print:text-[0.65rem] text-primary/70 font-roboto font-semibold uppercase tracking-widest">
                        <div className="w-44 print:hidden">&nbsp;</div>
                        <div className="md:flex-1 print:flex-1  flex items-center justify-between"><span>Total Credits:&nbsp;&nbsp;&nbsp;<span className="text-primary-accent">{totalCredit}</span></span></div>
                        <div className="md:flex-1 print:flex-1  flex items-center justify-between"><span>Date of Registration:&nbsp;&nbsp;&nbsp;<span className="text-primary-accent">{moment().format("MMM DD, YYYY") || 'Not Set'}</span></span></div>
                    </div> 
                    */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrintTranscriptAucc;
