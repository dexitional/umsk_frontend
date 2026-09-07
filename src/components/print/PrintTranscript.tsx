import moment from "moment";
import React from "react";
import { useLoaderData } from "react-router-dom";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";
import PrintHeader from "./PrintHeader";
const { REACT_APP_API_URL } = import.meta.env;

type Props = {};

export async function loader({ params }) {
  const user = useUserStore.getState().user;
  const data = await Service.fetchStudentTranscript(
    params?.studentId || user?.user?.tag
  );
  // Calculate CPA, CGPA, GPT , CRT
  let credit = 0;
  let gradepoint = 0;
  let classObtained;
  const cgpa: any = [];
  const gpa: any = [];
  const crt: any = [];
  const gpt: any = [];

  data &&
    Array.from(data)?.map(([title, row]: any, i: number) => {
      // Calculate Total Credit Hours, Total Gradepoint
      credit += row.reduce((sum, cur) => cur.credit + sum, 0);
      gradepoint += row.reduce(
        (sum, cur) => cur.credit * cur.gradepoint + sum,
        0
      );
      let gpa = gradepoint / credit;
      // Calculate Class
      classObtained = row[0].classes?.find(
        (r: any) => parseFloat(r.min) <= gpa && gpa <= parseFloat(r.max)
      );
      // Return variables
      cgpa.push(gpa.toFixed(3));
      gpt.push(gradepoint);
      crt.push(credit);
    });

  return { data, cgpa, gpt, crt, classObtained: classObtained?.class };
}

function PrintTranscript({}: Props) {
  const { data, cgpa, gpt, crt, classObtained }: any = useLoaderData();

  // Check If No Data
  if (!data?.length)
    return (
      <div className="p-3 w-5/6 h-56 mx-auto my-10 rounded-xl flex items-center justify-centerp-3 md:p-6 border bg-slate-50/50 ">
        <h1 className="w-full text-center text-gray-400 text-lg font-semibold tracking-widest uppercase">
          NO ASSESSMENT{" "}
        </h1>
      </div>
    );

  // Student Bio Profile
  const [_, mdata] = data && data[0];
  const student = mdata && mdata[0]?.student;

  return (
    <div className="w-full flex flex-col justify-center items-center bg-white print:m-0 print:scale-[85%]">
      <div className="my-10 mx-auto px-16 py-10 w-full rounded border shadow-sm shadow-slate-300 print:px-6 print:py-0 print:m-0 print:w-full print:shadow-none print:border-0 print:scale-100">
        <PrintHeader />
        <h3 className="md:-mt-2 md:mb-2 print:mt-2 print:indent-0 md:indent-6 text-center text-base md:text-xl font-noto font-bold md:text-primary-accent underline underline-offset-4 ">
          STATEMENT OF RESULT
        </h3>
        <div className="my-0 print:px-2 print:py-2 w-full md:max-w-4xl mx-auto flex flex-col md:flex-row print:flex-row space-x-6">
          <div className="my-1 w-full flex space-x-14 text-sm font-normal font-[times] leading-[1.35rem] tracking-wide">
            <div className="w-2/3">
              <p>
                NAME:&nbsp;&nbsp;
                <strong>
                  {student?.lname?.toUpperCase()},{" "}
                  {student?.fname?.toUpperCase()}{" "}
                  {student?.mname?.toUpperCase()}
                </strong>
              </p>
              <p>
                INDEX NO:&nbsp;&nbsp;<strong>{student?.indexno}</strong>
              </p>
              <p>
                PROGRAMME:&nbsp;&nbsp;
                <strong>{student?.program?.longName}</strong>
              </p>
            </div>
            <div className="flex-1">
              {/* <p>CLASS:&nbsp;&nbsp;<strong> {classObtained?.toUpperCase()}</strong></p> */}
              <p>
                DATE PRINTED:&nbsp;&nbsp;
                <strong>{moment().format("DD/MM/YYYY")} </strong>
              </p>
            </div>
          </div>
        </div>

        <div className="my-6 mx-auto max-w-4xl w-full flex flex-col space-y-8 font-[times]">
          {data?.map(([_, mdata]: any, i: number) => {
            const title = `YEAR ${Math.ceil(
              mdata[0]?.semesterNum / 2
            )}, SEMESTER ${mdata[0]?.semesterNum % 2 == 0 ? 2 : 1}`;

            const sess = `${mdata[0]?.session.title}`;
            const credit = mdata.reduce((sum, cur) => cur.credit + sum, 0);
            const gradepoint = mdata.reduce(
              (sum, cur) => cur.credit * cur.gradepoint + sum,
              0
            );
            const gpa = isNaN(gradepoint / credit)
              ? "0.0"
              : (gradepoint / credit).toFixed(2);
            const gpt_ = gpt[i];
            const crt_ = crt[i];
            const cgpa_ = cgpa[i];

            return (
              <div key={i} className="grid grid-cols-1 gap-y-0.5">
                <div className="pt-2 pb-1 rounded-t-lg w-full md:flex print:flex items-center justify-between text-base text-primary-dark uppercase tracking-wide font-roboto font-bold">
                  <span className="w-full text-left">{title}</span>
                  <span className="w-full text-center">{sess}</span>
                </div>
                <div className="pt-0.5 pb-1 hidden md:flex print:flex border-t-2 border-b-2 border-t-primary-dark border-primary-dark font-semibold text-[0.94rem] text-primary uppercase tracking-wide">
                  <div className="w-32">COURSE CODE</div>
                  <div className="flex-1">COURSE TITLE</div>
                  <div className="w-24 text-center">CREDITS</div>
                  <div className="w-24 text-center">GRADE</div>
                  <div className="w-24 text-center">GPT</div>
                </div>
                <div className="space-y-0.5 text-[0.9rem]">
                  {mdata?.map((sc: any) => (
                    <div
                      key={sc.courseId}
                      className="hidden md:flex print:flex text-primary tracking-wide"
                    >
                      <div className="w-32 text-base">{sc.courseId}</div>
                      <div className="flex-1">
                        {sc.course?.title?.toUpperCase()}
                      </div>
                      <div className="w-24 text-center text-base">
                        {sc.credit}
                      </div>
                      <div className="w-24 text-center text-base">
                        {sc.grade}
                      </div>
                      <div className="w-24 text-center text-base">
                        {/* {sc.grade == "I" ? "-" : sc.gradepoint} */}
                        {isNaN(sc.gradepoint * sc.credit)
                          ? "--"
                          : (sc.gradepoint * sc.credit).toFixed(1)}
                      </div>
                    </div>
                  ))}

                  <div className="hidden md:flex print:flex text-primary-dark tracking-wide">
                    <div className="w-32 font-semibold">
                      <br />
                      GPA: {gpa}
                    </div>
                    <div className="flex-1 font-semibold">
                      <br />
                      CGPA: {cgpa_}
                    </div>
                    <div className="w-24 text-center border-t border-gray-500">
                      <div>{credit}</div>
                      <div>{crt_}</div>
                    </div>
                    <div className="w-24 text-center font-black text-xl">_</div>
                    <div className="w-24 px-10 text-center border-t border-gray-500">
                      <div>{gradepoint}</div>
                      <div>{gpt_}</div>
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
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PrintTranscript;
