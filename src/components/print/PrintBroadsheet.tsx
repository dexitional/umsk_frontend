import moment from "moment";
import React, { useRef } from "react";
import { useLoaderData, useLocation } from "react-router-dom";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";
import PrintHeader from "./PrintHeader";
import { useReactToPrint } from "react-to-print";
const { REACT_APP_API_URL } = import.meta.env;

type Props = {};

export async function loader({ params }) {
  const user = useUserStore.getState().user;
  // const data = await Service.fetchStudentTranscript(
  //   params?.studentId || user?.user?.tag
  // );

  // const data = await Service.fetchStudentTranscripts(data?.map( r => r.student?.indexno));
  // // Calculate CPA, CGPA, GPT , CRT
  // let credit = 0;
  // let gradepoint = 0;
  // let classObtained;
  // const cgpa: any = [];
  // const gpa: any = [];
  // const crt: any = [];
  // const gpt: any = [];

  // data &&
  //   Array.from(data)?.map(([title, row]: any, i: number) => {
  //     // Calculate Total Credit Hours, Total Gradepoint
  //     credit += row.reduce((sum, cur) => cur.credit + sum, 0);
  //     gradepoint += row.reduce(
  //       (sum, cur) => cur.credit * cur.gradepoint + sum,
  //       0
  //     );
  //     let gpa = gradepoint / credit;
  //     // Calculate Class
  //     classObtained = row[0].classes?.find(
  //       (r: any) => parseFloat(r.min) <= gpa && gpa <= parseFloat(r.max)
  //     );
  //     // Return variables
  //     cgpa.push(gpa.toFixed(3));
  //     gpt.push(gradepoint);
  //     crt.push(credit);
  //   });

  // return { data, cgpa, gpt, crt, classObtained: classObtained?.class };
  return null
}

function PrintBroadsheet({}: Props) {
 
  const location = useLocation();
  const data = location.state?.data;

  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const getAcademicData = ( kdata) => {
    let credit = 0;
    let gradepoint = 0;
    let classObtained;
    const cgpa: any = [];
    const gpa: any = [];
    const crt: any = [];
    const gpt: any = [];

    kdata && Array.from(kdata)?.map(([_, row]: any, i: number) => {
        // Calculate Total Credit Hours, Total Gradepoint
        credit += row.reduce((sum, cur) => cur.credit + sum, 0);
        gradepoint += row.reduce((sum, cur) => cur.credit * cur.gradepoint + sum,0);
        let gpa = gradepoint / credit;
        // Calculate Class
        classObtained = row[0].classes?.find((r: any) => parseFloat(r.min) <= gpa && gpa <= parseFloat(r.max));
        // Return variables
        cgpa.push(gpa.toFixed(3));
        gpt.push(gradepoint);
        crt.push(credit);
    });

    return { cgpa, gpt, crt, classObtained: classObtained?.class };
  }

  // Check If No Data
  // if (!data?.length)
  //   return (
  //     <div className="p-3 w-5/6 h-56 mx-auto my-10 rounded-xl flex items-center justify-centerp-3 md:p-6 border bg-slate-50/50 ">
  //       <h1 className="w-full text-center text-gray-400 text-lg font-semibold tracking-widest uppercase">
  //         NO ASSESSMENT{" "}
  //       </h1>
  //     </div>
  //   );

  console.log('data: ', data);

  return (
    <div ref={printRef} className="relative w-full flex flex-col justify-center items-center bg-white print:m-0 print:scale-[85%]">
      
      <button onClick={handlePrint} className="w-full md:w-fit print:hidden px-6 py-1 flex md:flex-none items-center space-x-2 rounded bg-primary-accent text-white font-bold uppercase">
          <span>Print</span> <span className="flex md:hidden">Broadsheet</span>
      </button>
      
      { data && data?.length && data?.map((r,i) => {
        const st = r[1][0][1][0];
        const mdata = r[1];
        const { cgpa, classObtained } = getAcademicData(mdata);
        const fgpa = cgpa[mdata.length - 1];


        return (
          <div key={i} className="my-10 mx-auto px-16 py-10 w-full rounded border shadow-sm shadow-slate-300 print:px-6 print:py-0 print:m-0 print:w-full print:shadow-none print:border-0 print:scale-100 print:break-after-page">
            {/* <PrintHeader /> */}
            <h3 className="md:-mt-2 md:mb-2 print:mt-2 print:indent-0 md:indent-6 text-center text-base md:text-sm font-[monospace] font-bold md:text-primary-dark underline underline-offset-4 ">
              STUDENT BROADSHEET - {st?.indexno}
            </h3>
            <div className="my-0 print:px-2 print:py-2 w-full md:max-w-4xl mx-auto flex flex-col md:flex-row print:flex-row space-x-6">
              <div className="my-1 w-full flex space-x-14 text-xs font-normal font-[monospace] leading-[1.35rem] tracking-wide">
                <div className="w-3/5">
                  <p>
                    STUDENT NAME:&nbsp;&nbsp;&nbsp;&nbsp;
                    <strong>
                    {st?.lname?.trim()}, {st?.fname?.trim()} {st?.mname?.trim()}
                    </strong>
                  </p>
                  <p>
                    PROGRAMME:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <strong>{st?.programShortName}</strong>
                  </p>
                  <p>
                    CLASS:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <strong>{classObtained?.toUpperCase()}</strong>
                  </p>
                  
                </div>
                <div className="flex-1">
                  <p>
                    INDEX NUMBER:&nbsp;&nbsp;<strong>{st?.indexno}</strong>
                  </p>
                
                  <p>
                    STUDENT ID:&nbsp;&nbsp;&nbsp;&nbsp;<strong>{st?.studentId}</strong>
                  </p>
                  <p>
                    FGPA:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>{fgpa}</strong>
                  </p>
                
                </div>
              </div>
            </div>

            <div className="my-6 mx-auto max-w-4xl w-full flex flex-col space-y-8 font-[monospace]">
                 {  mdata?.map(([ sess, mr ]: any, j: number ) => { 
                    
                    const title = `YEAR ${Math.ceil(mr[0]?.semesterNum / 2)}, SEMESTER ${mr[0]?.semesterNum % 2 == 0 ? 2 : 1}`;
                    // const sess = `${mr[0]?.title}`;
                    const credit = mr.reduce((sum, cur) => cur.credit + sum, 0);
                    const gradepoint = mr.reduce((sum, cur) => cur.credit * cur.gradepoint + sum, 0);
                    const gpa = isNaN(gradepoint / credit) ? "0.0" : (gradepoint / credit).toFixed(2);
                    const { cgpa, gpt, crt } = getAcademicData(mdata);
                    

                    return (
                      <div key={j} className="grid grid-cols-1 gap-y-0.5">
                        <div className="pt-2 pb-1 rounded-t-lg w-full md:flex print:flex items-center justify-between text-xs text-primary-dark uppercase tracking-wide font-roboto font-bold">
                          <span className="w-full text-left">{sess}</span>
                          <span className="w-full text-center font-[monospace]">{title}</span>
                        </div>
                        <div className="pt-0.5 pb-1 hidden md:flex print:flex border-t border-b border-t-primary-dark border-primary-dark font-semibold text-[0.7rem] text-primary uppercase tracking-wide">
                          <div className="w-32">COURSE CODE</div>
                          <div className="flex-1">COURSE TITLE</div>
                          <div className="w-24 text-center">CREDITS</div>
                          <div className="w-24 text-center">MARKS</div>
                          <div className="w-24 text-center">GRADE</div>
                          <div className="w-24 text-center">GRADE POINT</div>
                        </div>
                        <div className="space-y-0.5 text-[0.7rem]">
                          { mr?.map((dm, k) => {
                            return (
                            <div key={k} className="hidden md:flex print:flex text-primary tracking-wide">
                              <div className="w-32">{dm?.courseId}</div>
                              <div className="flex-1 text-[0.65rem] leading-snug">{dm?.courseTitle}</div>
                              <div className="w-24 text-center">{dm?.credit.toFixed(2)}</div>
                              <div className="w-24 text-center">{dm?.totalScore || '--'}</div>
                              <div className="w-24 text-left indent-10">{dm.grade}</div>
                              <div className="w-24 text-center">{isNaN(dm.gradepoint * dm.credit) ? "--" : (dm.gradepoint * dm.credit).toFixed(1)}</div>
                            </div>
                           )})}
                        

                          <div className="hidden md:flex print:flex text-primary-dark tracking-wide border-t border-primary-dark border-dotted">
                            <div className="w-32 font-semibold">
                              GPA: {gpa}
                            </div>
                            <div className="flex-1 font-semibold">
                              CGPA: { cgpa[j] }
                            </div>
                            <div className="w-24 text-left border-t">
                              <div><span className="text-[0.55rem] text-left font-bold">CREDIT-TOTAL</span>&nbsp;{credit}</div>
                              <div><span className="text-[0.55rem] text-left font-bold">CUMMULATIVE</span>&nbsp;&nbsp;{crt[j]}</div>
                            </div>
                            <div className="w-24 text-center font-black text-xl">&nbsp;</div>
                            <div className="w-24 text-center font-black text-xl">&nbsp;</div>
                            {/* <div className="w-24 px-10 text-center border-t border-gray-500">
                              <div>{gradepoint}</div>
                              <div>{gpt[j]}</div>
                            </div> */}
                            <div className="w-28 text-left border-t">
                              <div><span className="ml-2 text-[0.55rem] text-left font-semibold">GP-TOTAL</span>&nbsp;&nbsp;&nbsp;{gradepoint}</div>
                              <div><span className="text-[0.55rem] text-left font-bold">CUMMULATIVE</span> &nbsp;{gpt[j]}</div>
                            </div>
                          </div>
                        </div>
                       
                      </div>
                    )}
                 )}
              
            </div>
          </div>
        )
      })}
    </div>
  );
}

export default PrintBroadsheet;
