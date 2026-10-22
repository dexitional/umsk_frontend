import { formatGpa, transcriptSummary, visibleGrade, visiblePoints } from "../../utils/academic";
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
  const summary = transcriptSummary(data);
  if (!summary.available) throw new Error('Academic results could not be loaded.');
  return { data: summary.groups, cgpa: summary.cgpas, gpt: summary.points,
    crt: summary.credits, currentCgpa: summary.cgpa };

}

const PaperTranscriptView = () => {
  const printRef: any = useRef();
  const { data, cgpa, gpt, crt, currentCgpa }: any = useLoaderData();

  // Student Bio Profile
  const student = data && data[0] && data[0][1] && data[0][1][0]?.student;

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <>
      <button
        onClick={handlePrint}
        className="w-full md:w-fit print:hidden px-6 py-1 flex md:flex-none items-center space-x-2 rounded bg-secondary-accent text-white font-bold uppercase"
      >
        <span>Print</span> <span className="flex md:hidden">Letter</span>
      </button>
      {/* <PrintHeader /> */}
      <main className="print" ref={printRef}>
        <section className="cover1 space-y-20">

          {data?.map(([_, mdata, meta]: any, i: number) => {
            const gpa = formatGpa(meta.gpa);
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
                    <TranscriptNoHeader user={student} cgpa={currentCgpa} />
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
                              {mdata[0]?.session?.semester == "SEM1"
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
                              {sc.course?.title?.toUpperCase()}{sc.exclusionReason ? ` — ${sc.exclusionReason} (excluded)` : ""}
                            </td>
                            <td className="page-mono p5" align="center">
                              {sc.credit}
                            </td>
                            <td
                              className="page-mono p5"
                              align="left"
                              style={{ textIndent: "15px" }}
                            >
                              {visibleGrade(sc)}
                            </td>
                            <td className="page-mono p5" align="left">
                              <span>
                                {visiblePoints(sc)}
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
