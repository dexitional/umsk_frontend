import moment from "moment";
import React, { Fragment, useRef } from "react";
import { FaFilePdf } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import Logo from "../../assets/img/logo/aucc/logo.png";
import PrintHeader from "../print/PrintHeader";
import { awardClasses } from "../../utils/util";
import { resolveAmsPhotoSrc, resolveAmsDocumentSrc } from "../../utils/amsFile";

type Props = {
  data: any;
};

function FormTemplate({ data }: Props) {
  const { applicant, data: formData } = data;
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  
  return (
    <div
      className="relative md:scale-[85%] print:scale-[78%] md:-mt-32 print:-mt-14"
      ref={printRef}
    >
      <button
        onClick={handlePrint}
        className="w-full md:w-fit md:absolute md:-top-[5rem] md:-left-24 print:hidden px-6 py-1 flex md:flex-none items-center justify-center space-x-2 rounded bg-primary-accent text-white font-bold uppercase"
      >
        <span>Print</span>{" "}
        <span className="flex md:hidden">Applicant Form</span>
      </button>
      <PrintHeader />
      <main className="hidden print:block md:block w-full print:text-[0.79rem] print:font-poppins">
        <div className="mt-0 mb-8 space-y-6">
          <h1 className="text-center text-gray-800 underline text-2xl print:text-xl font-[san-serif] font-semibold uppercase">
            {applicant?.stage?.categoryId == "CP"
              ? "Certificate Program"
              : applicant?.stage?.categoryId == "DP"
              ? "Diploma Program"
              : applicant?.stage?.categoryId == "UG"
              ? "Undergraduate"
              : "Postgraduate"}{" "}
            Online Application Form
          </h1>
          {/* <div className="space-y-6 print:space-y-3">
                    <address className="print:text-xs">
                        <p className="text-primary-dark font-semibold uppercase not-italic">REFERENCE: 240921009</p>
                        <p className="text-primary-dark font-semibold uppercase not-italic">Ebenezer Kwabena Blay Ackah</p>
                    </address>
                    <p>Dear Samuel,</p>
               </div> */}
        </div>
        {/* { ReactHtml(loadPlacerData(data?.template,dm)) } */}
        <div className="print:text-xs">
          <div
            className="fade-bg"
            style={{
              background: ` center 75% / 650px 650px no-repeat url(${Logo})`,
            }}
          ></div>
          <main className="w-full space-y-20 print:space-y-10">
            {/* <h3 className="center black d-none text-center text-xl text-red-500 font-semibold  "> Please Indicate Your Envelope Number At The Back Of Your EMS Envelope</h3> */}
            <h3 className="mx-auto w-3/4 text-center text-xl print:text-base text-red-500 font-semibold">
              Add photocopies of all related documents, certificates & results.
              <br />
              Keep a copy of this printout for any future enquiry.
            </h3>
            <section>
              <table className="w-full print:space-y-0 space-y-1">
                {/* Personal */}
                <tr>
                  <td className="w-1/3">
                    <h3 className="theading">Personal Information</h3>
                  </td>
                  <td colSpan={2}>&nbsp;</td>
                </tr>
                <tr>
                  <td rowSpan={7}>
                    <img src={resolveAmsPhotoSrc(applicant, Logo)} className="w-48" />
                  </td>
                  <td className="shead">Applicant ID:</td>
                  <td className="sbody uppercase">
                    {applicant?.serial || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="shead">Admission Group:</td>
                  <td className="sbody uppercase">
                    {applicant?.stage?.title || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="shead">Application Type:</td>
                  <td className="sbody uppercase">
                    {applicant?.applyType?.title || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="shead">Study Mode:</td>
                  <td className="sbody uppercase">
                    {(applicant?.profile?.studyMode == "E"
                      ? "Evening"
                      : applicant?.profile?.studyMode == "W"
                      ? "Weekend"
                      : applicant?.profile?.studyMode == "W" 
                      ? "Morning" 
                      : "N/A"
                    )}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <hr className="pt-4" />
                  </td>
                </tr>
                <tr>
                  <td className="shead">Title:</td>
                  <td className="sbody uppercase">
                    {applicant?.profile?.title?.tag || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="shead">Surname:</td>
                  <td className="sbody uppercase">
                    {applicant?.profile?.lname || "N/A"}
                  </td>
                </tr>
                <tr>
                  {/* <td rowSpan={['7','8'].includes(applicant.stage_id) ? '12':'10'}></td> */}
                  <td rowSpan={12}></td>
                  <td className="shead">Other Names:</td>
                  <td className="sbody uppercase">
                    {applicant?.profile?.fname} {applicant?.profile?.mname}
                  </td>
                </tr>
                <tr>
                  <td className="shead">Date of Birth:</td>
                  <td className="sbody uppercase">
                    {(applicant?.profile?.dob &&
                      moment(applicant?.profile?.dob).format(
                        "MMMM DD, YYYY"
                      )) ||
                      "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="shead">Gender:</td>
                  <td className="sbody uppercase">
                    {applicant?.profile?.gender == "M" ? "Male" : "Female"}
                  </td>
                </tr>
                <tr>
                  <td className="shead">Marital Status:</td>
                  <td className="sbody uppercase">
                    {applicant?.profile?.marital?.title || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="shead">Home Region:</td>
                  <td className="sbody uppercase">
                    {applicant?.profile?.region?.title || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="shead">Phone Number:</td>
                  <td className="sbody uppercase">
                    {applicant?.profile?.phone || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="shead">Email Address:</td>
                  <td className="sbody uppercase">
                    {applicant?.profile?.email || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="shead">Postal Address:</td>
                  <td className="sbody uppercase">
                    {applicant?.profile?.postalAddress || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="shead">Residential Address:</td>
                  <td className="sbody uppercase">
                    {applicant?.profile?.residentAddress || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="shead">Country of Residence:</td>
                  <td className="sbody uppercase">
                    {applicant?.profile?.country?.longName || "N/A"}
                  </td>
                </tr>

                {/* { ['7','8'].includes(applicant.stage_id) ?  */}
                <Fragment>
                  <tr>
                    <td className="shead">Present Occupation:</td>
                    <td className="sbody uppercase">
                      {applicant?.profile?.occupation || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="shead">Place of Work:</td>
                    <td className="sbody uppercase">
                      {applicant?.profile?.workPlace || "N/A"}
                    </td>
                  </tr>
                </Fragment>
                {/* </Fragment> : null } */}

                {/* Guardian */}
                <tr>
                  <td colSpan={3}>
                    <hr className="pt-4" />
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <h3 className="theading">
                      {" "}
                      Parental/Guardian/Next of Kin Information
                    </h3>
                  </td>
                  <td>&nbsp;</td>
                </tr>
                <tr>
                  <td rowSpan={6} className="shead">
                    &nbsp;
                  </td>
                  <td className="shead">Name:</td>
                  <td className="sbody uppercase">
                    {formData?.guardian?.title?.tag} {formData?.guardian?.fname}{" "}
                    {formData?.guardian?.mname
                      ? formData?.guardian?.mname + " "
                      : ""}
                    {formData?.guardian?.lname}
                  </td>
                </tr>
                <tr>
                  <td className="shead">Relation to Applicant:</td>
                  <td className="sbody uppercase">
                    {formData?.guardian?.relation?.title || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="shead">Occupation:</td>
                  <td className="sbody uppercase">
                    {formData?.guardian?.occupation || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="shead">Phone Number:</td>
                  <td className="sbody uppercase">
                    {formData?.guardian?.phone || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="shead">Email Address:</td>
                  <td className="sbody uppercase">
                    {formData?.guardian?.email || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="shead">Address:</td>
                  <td className="sbody uppercase">
                    {formData?.guardian?.address || "N/A"}
                  </td>
                </tr>
              </table>
            </section>

            <section>
              <table className="ptable">
                {formData?.education ? (
                  <Fragment>
                    <tr>
                      <td colSpan={4}>
                        <hr className="pt-4" />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3}>
                        <h3 className="theading"> Educational Background</h3>
                      </td>
                      <td>&nbsp;</td>
                    </tr>

                    {/* Education */}
                    <tr>
                      <td colSpan={4}>&nbsp;</td>
                    </tr>
                    {formData?.education?.map((row, i) => (
                      <Fragment key={i}>
                        {row?.instituteCategory?.title?.toLowerCase() ==
                        "tertiary" ? (
                          <Fragment>
                            <tr>
                              <td colSpan={4}>
                                <h3 className="black">
                                  <u>University or College Award Information</u>
                                </h3>
                              </td>
                            </tr>
                            <tr>
                              <td className="sbody">Institution</td>
                              <td className="sbody">Degree Obtained</td>
                              <td className="sbody">Degree Class</td>
                              <td className="sbody">Duration</td>
                            </tr>
                            <tr>
                              <td className="shead uppercase">
                                {row?.instituteName || "N/A"}
                              </td>
                              <td className="shead uppercase">
                                {row?.certCategory?.title || "N/A"}
                              </td>
                              <td className="shead uppercase">
                                { awardClasses.find((r:any) => r.id == row.classValue)?.title || "N/A"}
                              </td>
                              <td className="shead uppercase">
                                {moment(
                                  `${row.startMonth}-${row.startYear}`,
                                  "M-YYYY"
                                ).format("MMMM YYYY")}{" "}
                                -{" "}
                                {moment(
                                  `${row.endMonth}-${row.endYear}`,
                                  "M-YYYY"
                                ).format("MMMM YYYY")}
                              </td>
                            </tr>
                          </Fragment>
                        ) : (
                          <Fragment>
                            <tr>
                              <td colSpan={4}>
                                <h3 className="black">
                                  <u>
                                    Secondary Education Certificate Information
                                  </u>
                                </h3>
                              </td>
                            </tr>
                            <tr>
                              <td className="sbody">Institution</td>
                              <td className="sbody">Certificate Awarded</td>
                              <td className="sbody">Certificate Aggregate</td>
                              <td className="sbody">Month/Year Completed</td>
                            </tr>
                            <tr>
                              <td className="shead uppercase">
                                {row?.instituteName || "N/A"}
                              </td>
                              <td className="shead uppercase">
                                {row?.certCategory?.title || "N/A"}
                              </td>
                              <td className="shead uppercase">
                                {row?.gradeValue || "N/A"}
                              </td>
                              <td className="shead uppercase">
                                {moment(
                                  `${row?.endMonth}-${row?.endYear}`,
                                  "M-YYYY"
                                ).format("MMMM YYYY")}
                              </td>
                            </tr>
                          </Fragment>
                        )}
                      </Fragment>
                    ))}
                  </Fragment>
                ) : null}

                {/* Referee */}
                {formData?.referee ? (
                  <Fragment>
                    <tr>
                      <td colSpan={4}>&nbsp;</td>
                    </tr>
                    <tr>
                      <td colSpan={4}>
                        <h3 className="black">
                          <u>Names and Addresses of Two Academic Referees</u>
                        </h3>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="sbody">
                        Referee Name
                      </td>
                      <td colSpan={2} className="sbody">
                        Referee Address
                      </td>
                    </tr>
                    {formData?.referee?.map((row, i) => (
                      <tr key={i}>
                        <td colSpan={2} className="shead uppercase">
                          {row?.title?.tag} {row?.fname}{" "}
                          {row?.mname ? row?.mname + " " : ""}
                          {row?.lname}
                        </td>
                        <td
                          align="left"
                          colSpan={2}
                          className="shead uppercase"
                        >
                          {row?.address || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ) : null}

                {/*

                            {/* Qualification }
                            <tr><td colSpan="4">&nbsp;</td></tr>
                            <tr>
                                <td colSpan="4">
                                    <h3 className="black"><u>Other Educational Qualifications</u></h3>
                                </td>
                            </tr>
                            <tr>
                                <td className="sbody">Qualification</td>
                                <td colSpan="2" className="sbody">Awarding Institution</td>
                                <td className="sbody">Date Awarded</td>
                            </tr>
                            <tr>
                                <td className="shead">BACHELOR OF SCIENCE</td>
                                <td colSpan="2" className="shead">KWAME NKRUMAH UNIVERSITY OF SCIENCE AND TECHNOLOGY</td>
                                <td className="shead">August, 2012</td>
                            </tr>
                            */}

                {/* Employment */}
                {formData?.employment ? (
                  <Fragment>
                    <tr>
                      <td colSpan={4}>&nbsp;</td>
                    </tr>
                    <tr>
                      <td colSpan={4}>
                        <hr className="pt-4" />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3}>
                        <h3 className="theading">
                          Work Experience Information
                        </h3>
                      </td>
                      <td>&nbsp;</td>
                    </tr>
                    <tr>
                      <td className="sbody">Employer Name</td>
                      <td className="sbody">Job Title</td>
                      <td className="sbody">Employer Address</td>
                      <td className="sbody">Duration</td>
                    </tr>
                    {formData?.employment?.map((row, i) => (
                      <tr>
                        <td className="shead uppercase">
                          {row?.employerName || "N/A"}
                        </td>
                        <td className="shead uppercase">
                          {row?.jobTitle || "N/A"}
                        </td>
                        <td className="shead uppercase">
                          {row?.employerAddress || "N/A"}
                        </td>
                        <td className="shead uppercase">
                          {moment(
                            `${row.startMonth}-${row.startYear}`,
                            "M-YYYY"
                          ).format("MMMM YYYY")}{" "}
                          -{" "}
                          {row.endMonth && row.endYear ? moment(
                            `${row.endMonth}-${row.endYear}`,
                            "M-YYYY"
                          ).format("MMMM YYYY"): "Present"}
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ) : null}

                {/* Result */}
                {formData?.result ? (
                  <Fragment>
                    <tr>
                      <td colSpan={4}>&nbsp;</td>
                    </tr>
                    <tr>
                      <td colSpan={4}>
                        <hr className="pt-4" />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        <h3 className="theading">
                          {" "}
                          Examination Results Information
                        </h3>
                      </td>
                      <td colSpan={2}>
                        <h3
                          className="theading hidden"
                          style={{
                            fontSize: "10px !important",
                            borderColor: "#b76117",
                            color: "#b76117",
                            letterSpacing: "0.07em",
                            padding: "5px 15px",
                          }}
                        >
                          TOTAL AGGREGATE : 0
                        </h3>
                      </td>
                    </tr>
                    {formData?.result.map((row, i) => (
                      <Fragment key={i}>
                        <tr>
                          <td colSpan={4}>
                            <h3 className="black">
                              <u>Results {i + 1} </u>
                            </h3>
                            {/* <h3 className="black"><u>Results 1 </u></h3> */}
                          </td>
                        </tr>
                        <tr>
                          <td className="sbody">Exams Type</td>
                          <td className="shead">{row?.certCategory?.title}</td>
                          <td className="sbody">Subject</td>
                          <td className="sbody">Grade</td>
                        </tr>
                        <tr>
                          <td className="sbody">Exams Year</td>
                          <td className="shead">{row?.startYear}</td>
                          <td className="shead uppercase">
                            {(row?.grades &&
                              row?.grades[0] &&
                              row?.grades[0]?.subject?.title) ||
                              ""}
                          </td>
                          <td className="shead uppercase">
                            {(row?.grades &&
                              row?.grades[0] &&
                              row?.grades[0]?.gradeWeight?.title) ||
                              ""}
                          </td>
                        </tr>
                        <tr>
                          <td className="sbody">Exams Sitting</td>
                          <td className="shead uppercase">
                            {row?.sitting == 1 ? "MAY/JUN" : "NOV/DEC"}
                          </td>
                          <td className="shead uppercase">
                            {(row?.grades &&
                              row?.grades[1] &&
                              row?.grades[1]?.subject?.title) ||
                              ""}
                          </td>
                          <td className="shead uppercase">
                            {(row?.grades &&
                              row?.grades[1] &&
                              row?.grades[1]?.gradeWeight?.title) ||
                              ""}
                          </td>
                        </tr>
                        <tr>
                          <td className="sbody">Index Number</td>
                          <td className="shead uppercase">
                            {row?.indexNumber}
                          </td>
                          <td className="shead uppercase">
                            {(row?.grades &&
                              row?.grades[2] &&
                              row?.grades[2]?.subject?.title) ||
                              ""}
                          </td>
                          <td className="shead uppercase">
                            {(row?.grades &&
                              row?.grades[2] &&
                              row?.grades[2]?.gradeWeight?.title) ||
                              ""}
                          </td>
                        </tr>
                        <tr>
                          <td className="sbody">
                            {row?.grades &&
                              (row?.grades[6] || row?.grades[7]) &&
                              "Subject"}
                          </td>
                          <td className="sbody">
                            {row?.grades &&
                              (row?.grades[6] || row?.grades[7]) &&
                              "Grade"}
                          </td>
                          <td className="shead uppercase">
                            {(row?.grades &&
                              row?.grades[3] &&
                              row?.grades[3]?.subject?.title) ||
                              ""}
                          </td>
                          <td className="shead uppercase">
                            {(row?.grades &&
                              row?.grades[3] &&
                              row?.grades[3]?.gradeWeight?.title) ||
                              ""}
                          </td>
                        </tr>
                        <tr>
                          <td className="shead uppercase">
                            {(row?.grades &&
                              row?.grades[6] &&
                              row?.grades[6]?.subject?.title) ||
                              ""}
                          </td>
                          <td className="shead uppercase">
                            {(row?.grades &&
                              row?.grades[6] &&
                              row?.grades[6]?.gradeWeight?.title) ||
                              ""}
                          </td>
                          <td className="shead uppercase">
                            {(row?.grades &&
                              row?.grades[4] &&
                              row?.grades[4]?.subject?.title) ||
                              ""}
                          </td>
                          <td className="shead uppercase">
                            {(row?.grades &&
                              row?.grades[4] &&
                              row?.grades[4]?.gradeWeight?.title) ||
                              ""}
                          </td>
                        </tr>
                        <tr>
                          <td className="shead uppercase">
                            {(row?.grades &&
                              row?.grades[7] &&
                              row?.grades[7]?.subject?.title) ||
                              ""}
                          </td>
                          <td className="shead uppercase">
                            {(row?.grades &&
                              row?.grades[7] &&
                              row?.grades[7]?.gradeWeight?.title) ||
                              ""}
                          </td>
                          <td className="shead uppercase">
                            {(row?.grades &&
                              row?.grades[5] &&
                              row?.grades[5]?.subject?.title) ||
                              ""}
                          </td>
                          <td className="shead uppercase">
                            {(row?.grades &&
                              row?.grades[5] &&
                              row?.grades[5]?.gradeWeight?.title) ||
                              ""}
                          </td>
                        </tr>

                        <tr>
                          <td colSpan={4}>&nbsp;</td>
                        </tr>
                      </Fragment>
                    ))}
                  </Fragment>
                ) : null}

                {/* Choice */}
                <tr>
                  <td colSpan={4}>
                    <hr className="pt-4" />
                  </td>
                </tr>
                <tr>
                  <td colSpan={3}>
                    <h3 className="theading">
                      {" "}
                      University Enrollment Information
                    </h3>
                  </td>
                  <td>&nbsp;</td>
                </tr>
                {formData?.choice?.map((row, i) => (
                  <tr>
                    <td className="shead">
                      &nbsp;&nbsp;&nbsp;Program Choice {i + 1}:{" "}
                    </td>
                    {/* <td className="shead">&nbsp;&nbsp;&nbsp;Program Choice 1: </td> */}
                    <td colSpan={4} className="sbody">
                      {row?.program?.longName}
                    </td>
                  </tr>
                ))}

                {/* Documents */}
                {formData?.document ? (
                  <Fragment>
                    <tr className="print:hidden">
                      <td colSpan={4}>
                        <hr className="pt-6" />
                      </td>
                    </tr>
                    <tr className="print:hidden">
                      <td colSpan={3}>
                        <h3 className="theading">Uploaded Documents</h3>
                      </td>
                      <td>&nbsp;</td>
                    </tr>
                    {formData?.document?.map((row, i) => (
                      <tr className="print:hidden">
                        <td colSpan={2} className="shead">
                          &nbsp;&nbsp;&nbsp;Document {i + 1}:&nbsp;&nbsp;&nbsp;{" "}
                          {row?.documentCategory?.title}
                        </td>
                        {/* <td className="shead">&nbsp;&nbsp;&nbsp;Program Choice 1: </td> */}
                        <td colSpan={2} className="sbody">
                          <Link
                            to={resolveAmsDocumentSrc(row) || "#"}
                            target="_blank"
                            className="px-3 py-1 w-fit border rounded font-medium flex items-center space-x-2 text-primary-accent"
                          >
                            <FaFilePdf className="text-red-400" />{" "}
                            <span>View Document</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ) : null}

                {/* Declaration */}
                {/* <tr><td colSpan={4}>&nbsp;</td></tr>
                            <tr><td colSpan={4}><br/></td></tr> */}
              </table>
            </section>
          </main>
        </div>
      </main>
    </div>
  );
}

export default FormTemplate;
