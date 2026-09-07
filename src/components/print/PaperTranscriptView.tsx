import React, { useRef } from "react";
import { useLoaderData } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import Service from "../../utils/aisService";
import "./FormPrint.css";
import TranscriptNoHeader from "./TranscriptNoHeader";

export async function loader({ params }) {
  const ts = await Service.fetchTranswift(params?.transwiftId);
  let data;
  if (ts) {
    data = await Service.fetchStudentTranscript(ts?.studentId);
  }
  // Calculate CPA, CGPA, GPT , CRT
  let credit = 0;
  let gradepoint = 0;
  let classObtained;
  let isFgpa = false;
  let fgpa: any = 0.0;
  let mgpa: any = 0.0;
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

      // FGPA Algorithm
      console.log(row, row[0].semesterNum);
      if (i % row[0].semesterNum == 1 || i % row[0].semesterNum == 3)
        fgpa += (1 / 6) * gpa;
      if (i % row[0].semesterNum == 5 || i % row[0].semesterNum == 7)
        fgpa += (2 / 6) * gpa;
      if (["UG"].includes(row[0]?.student?.program?.category)) isFgpa = true; // FGPA Applies instead of CGPA if Program is UG not PG

      // Return variables
      cgpa.push(gpa?.toFixed(3));
      gpt.push(gradepoint);
      crt.push(credit);
      //mgpa = gpa;
    });

  return {
    data,
    cgpa,
    gpt,
    crt,
    classObtained: classObtained?.class,
    fgpa: isFgpa ? fgpa : cgpa,
  };
}

const PaperTranscriptView = () => {
  const printRef: any = useRef();
  const { data, cgpa, gpt, crt, fgpa, classObtained }: any = useLoaderData();

  // Student Bio Profile
  const student = data && data[0] && data[0][1] && data[0][1][0]?.student;

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <>
      <button
        onClick={handlePrint}
        className="w-full md:w-fit print:hidden px-6 py-1 flex md:flex-none items-center space-x-2 rounded bg-primary-accent text-white font-bold uppercase"
      >
        <span>Print</span> <span className="flex md:hidden">Letter</span>
      </button>
      {/* <PrintHeader /> */}
      <main className="print" ref={printRef}>
        <section className="cover1 space-y-20">
          {/* <TranscriptHeader user={student} fgpa={fgpa} /> */}

          {data?.map(([_, mdata]: any, i: number) => {
            const credit = mdata.reduce((sum, cur) => cur.credit + sum, 0);
            const gradepoint = mdata.reduce(
              (sum, cur) => cur.credit * cur.gradepoint + sum,
              0
            );
            const gpa = isNaN(gradepoint / credit)
              ? "0.0"
              : (gradepoint / credit)?.toFixed(2);
            const gpt_ = gpt[i];
            const crt_ = crt[i];
            const cgpa_ = cgpa[i];

            return (
              <div
                key={i}
                className={`print:m-0 print:p-0 ${i % 2 == 0 && "print:mt-14"}`}
              >
                {i % 2 == 0 && (
                  <div
                    className="md:block print:block"
                    style={{ pageBreakBefore: "left" }}
                  >
                    <TranscriptNoHeader user={student} fgpa={fgpa} />
                  </div>
                )}
                <div
                  className={i % 2 == 0 && `` ? "" : ""}
                  style={{
                    marginBottom: "20px",
                    marginTop: "40px",
                    fontFamily: "monospace",
                  }}
                >
                  <h1
                    className="h1title page-mono p0"
                    style={{
                      textAlign: "left",
                      textIndent: "3.2rem",
                      margin: "-10px",
                      fontWeight: "bolder",
                    }}
                  >
                    ACADEMIC YEAR: &nbsp;{mdata[0]?.session?.year}
                  </h1>
                  <table className="stable2">
                    <tbody>
                      <tr
                        className="tbody page-mono p0"
                        style={{ margin: 0, fontSize: "14px" }}
                      >
                        <td colSpan={2} className="tdtitle page-mono">
                          <h1
                            className=""
                            style={{ textAlign: "left", textIndent: "1.2rem" }}
                          >
                            <b
                              className="h2title page-mono"
                              style={{ textTransform: "uppercase" }}
                            >
                              {mdata[0]?.session?.year == "SEM1"
                                ? "FIRST"
                                : "SECOND"}{" "}
                              SEMESTER
                            </b>
                          </h1>
                        </td>
                        <td className="p0" colSpan={2}>
                          <div
                            className="page-mono"
                            style={{ fontSize: "13px", marginBottom: "5px" }}
                          >
                            CCT: &nbsp;<span className="page-mono">{crt_}</span>
                          </div>
                          <div
                            className="page-mono"
                            style={{ fontSize: "13px", marginBottom: "5px" }}
                          >
                            CCP: &nbsp;<span className="page-mono">{gpt_}</span>
                          </div>
                        </td>
                        <td className="p0" colSpan={2}>
                          <div
                            className="page-mono"
                            style={{ fontSize: "13px", marginBottom: "5px" }}
                          >
                            GPA: &nbsp;<span className="page-mono">{gpa}</span>
                          </div>
                          <div
                            className="page-mono"
                            style={{ fontSize: "13px", marginBottom: "5px" }}
                          >
                            CGPA: <span className="page-mono">{cgpa_}</span>
                          </div>
                        </td>
                      </tr>
                      <tr
                        className="p0"
                        style={{
                          borderBottom: "1px solid black",
                          borderTop: "none",
                          fontWeight: "bold",
                          fontSize: "13.5px",
                        }}
                      >
                        <td className="page-mono p2" align="left">
                          CODE
                        </td>
                        <td className="page-mono p0" align="left" colSpan={2}>
                          COURSE TITLE
                        </td>
                        <td
                          className="page-mono p0"
                          align="center"
                          style={{ width: "80px" }}
                        >
                          CREDIT
                        </td>
                        <td
                          className="page-mono p0"
                          align="left"
                          style={{ width: "80px" }}
                        >
                          GRADE
                        </td>
                        <td
                          className="page-mono p0"
                          align="left"
                          style={{ width: "95px" }}
                        >
                          GPT
                        </td>
                      </tr>
                      {mdata?.map((sc: any) => {
                        return (
                          <tr
                            key={sc.courseId}
                            className=""
                            style={{
                              margin: "0px 0px",
                              border: "none",
                              fontWeight: "bolder",
                              fontSize: "14px",
                              lineHeight: "18px",
                            }}
                          >
                            <td className="page-mono p5" align="left">
                              {sc.courseId}
                            </td>
                            <td
                              className="page-mono p5"
                              align="left"
                              colSpan={2}
                            >
                              {sc.course?.title?.toUpperCase()}
                            </td>
                            <td className="page-mono p5" align="center">
                              {sc.credit}
                            </td>
                            <td
                              className="page-mono p5"
                              align="left"
                              style={{ textIndent: "15px" }}
                            >
                              {sc.grade}
                            </td>
                            <td className="page-mono p5" align="left">
                              <span>
                                {isNaN(sc.gradepoint * sc.credit)
                                  ? "--"
                                  : (sc.gradepoint * sc.credit)?.toFixed(1)}
                              </span>
                              {/* <span>{sc.grade == 'I' ? '-' : sc.gradepoint }</span> */}
                              &nbsp;
                              <span style={{ fontSize: "14px" }}>
                                {sc.type == "R" ? "Resit" : ""}
                              </span>
                            </td>
                            {/* <td>{row.score_type && row.score_type == 'R' ? 'Resit':''}</td> */}
                          </tr>
                        );
                      })}
                      <tr className="tbody">
                        <td className="codetitle">&nbsp;</td>
                        <td className="tdtitle">&nbsp;</td>
                        <td align="center">&nbsp;</td>
                        <td align="center">&nbsp;</td>
                        <td align="center">&nbsp;</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

          <table className="stable2">
            <tbody>
              <tr className="tbody" aria-rowspan={3}>
                <td className="codetitle">&nbsp;</td>
                <td className="tdtitle">&nbsp;</td>
                <td align="center">&nbsp;</td>
                <td className="" align="left" colSpan={3}>
                  <br />
                  <br />
                  {/* <img src={user.template && user.template.signature} style={{ height: '70px', width:'auto', margin:'30px auto 10px 50px', textAlign:'right' }} /> */}
                  {/* <p style={{ textAlign:'left',fontFamily:'monospace', fontSize:'12pt', fontWeight:'bold'}}>{ReactHtml(user && user.template && user.template.signatory || '')}</p> */}
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </>
  );
};

export default PaperTranscriptView;
