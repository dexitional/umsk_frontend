import React, { useState, useEffect, useRef } from "react";
import "../admission/FormPrint.css";
import Logo from "../../assets/img/logo.png";
import Signature from "../../assets/img/signature.png";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";
import moment from "moment";
import ReactHtml from "html-react-parser";
import { ToWords } from "to-words";

const PaperLetter = () => {
  const { sso } = useSelector((state) => state);
  const { modal } = sso;
  const [data, setData] = useState({});
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const output = `<div style="font-family:arial,times,helvetica;font-size:12pt">
    <p><u class="sbody">ADMISSION TO THE ::program_name PROGRAMME (::admission_title)</u></p>
    <p>Congratulations!</p>
    <p>I am pleased to inform you that, upon review of your application and, on the basis of your ::cert_condition, you have been offered admission to Level ::start_level of the <b>::program_name</b> programme for the ::session_year Academic year.</p>
    <p><b>Holders of Diploma/HND are to submit original copies of their certificate for verification, after which they may be exempted from the university of Ghana required course (offered at AUCC) for one semester. All other applicants will have to pass those required courses to complete their admission.</b></p>
    <p>Your field of specialisation will be confirmed at the end of Level 200 following an orientation session where you will learn about all the available specialisations and the possible career opportunities available in each specialisation.</p>
    <p>The programme fee per semester is <b>::fee_amount.</b> The fee must be paid through Cal Bank in the name of the <b>African University College of Communications (AUCC) into account number ::bank_account at any branch of Cal Bank.</b> After payment, the pay-in-slip must first be presented to the Accounts Officer at AUCC who will issue a receipt, a copy of which must be presented to the appropriate Secretariat of AUCC towards registration.</p>
    <p><b>Please note that registration is ongoing and lectures is scheduled to begin on ::lecture_start.</b></p>
    <p>Should you decide to withdraw from the programme within three weeks of registration, the University shall refund your fees to you less an administrative fee of 30%. No refunds will be made for withdrawals after the third week of registration.</p>
    <p>All students are required to obey the rules and regulations of AUCC. A copy of the Student Handbook will be provided to you. Kindly note that AUCCs <b>Weekend School is held on Fridays and Saturdays</b>, and Management reserves the right to change sessions and courses when class sizes are not economically viable.</p>
    <p>All correspondence in relation to your admission should be addressed to the Registrar and should include your reference number as above.</p>
    <p>Congratulations once again. We look forward to personally welcoming you to our campus!</p>
    <p>Yours faithfully,</p>
    <p>&nbsp;</p>
    </p>::signatory</p>
    </div>
    `;
  const loadPlacerData = (dt) => {
    dt = dt.replace("::cert_condition", data && data.letter_condition);
    dt = dt.replace(
      "::start_level",
      data && Math.ceil(data.start_semester % 2) * 100
    );
    dt = dt.replace(/::program_name/g, data && data.program_name);
    dt = dt.replace(/::session_year/g, data && data.academic_year);
    dt = dt.replace("::signatory", data && data.signatory);
    dt = dt.replace(/::bank_account/g, data && data.bank_account);
    dt = dt.replace(/::admission_title/g, data && data.admission_title);
    dt = dt.replace(/::lecture_start/g,data && moment(data.cal_lecture_start).format("dddd, Do MMMM, YYYY"));
    dt = dt.replace(/::register_start/g,data && moment(data.cal_register_start).format("dddd, Do MMMM, YYYY"));
    dt = dt.replace(/::register_end/g,data && moment(data.cal_register_end).format("dddd, Do MMMM, YYYY"));
    dt = dt.replace(/::orient_start/g,data && moment(data.cal_orient_start).format("dddd, Do MMMM, YYYY"));
    const toWords = new ToWords(
      data && data.currency == "USD"
        ? {
            localeCode: "en-US",
            converterOptions: {
              currency: true,
              ignoreDecimal: false,
              ignoreZeroCurrency: false,
              doNotAddOnly: true,
            },
          }
        : {
            localeCode: "en-GH",
            converterOptions: {
              currency: true,
              ignoreDecimal: false,
              ignoreZeroCurrency: false,
              doNotAddOnly: true,
            },
          }
    );

    dt = dt.replace(
      "::signature",
      `<img src="${
        (data && data.signature) || Signature
      }" width='150px' height='50px' />`
    );
    dt = dt.replace(
      /::fee_amount/g,
      `${toWords.convert((data && data.amount) || 0)} ${
        data && data.currency == "GH"
          ? " ( $" + data.amount + " )"
          : " ( GH¢" + data.amount + " )"
      }`
    );
    dt = dt.replace(
      /::discount_amount/g,
      `${toWords.convert((data && data.amount - (data.discount || 0)) || 0)} ${
        data && data.currency == "GH"
          ? " ( $" + (data.amount - (data.discount || 0)) + " )"
          : " ( GH¢" + (data.amount - (data.discount || 0)) + " )"
      }`
    );
    return dt;
  };

  useEffect(() => {
    //handlePrint()
    //loadGrades()
    modal.content && setData({ ...modal.content.data });
  }, []);

  return (
    <>
      <div className="row">
        <div
          className="Box small-12 columns"
          style={{
            width: "900px",
            margin: "0px auto",
            float: "none",
            overflow: "hidden",
          }}
        >
          <div className="small-12 columns u-pr-0 right">
            <button
              onClick={handlePrint}
              className="Button u-floatRight u-mb-2"
            >
              &nbsp;&nbsp;Print &nbsp;&nbsp;
            </button>
          </div>
        </div>
      </div>
      <div className="print" ref={printRef}>
        <div
          className="fade-bg"
          style={{
            background: `url(${Logo}) center 50% / 650px 650px no-repeat`,
            display: "block",
            zIndex: 10,
          }}
        ></div>
        <div className="cover">
          <br />
          <br />
          <header>
            <div className="left-head">
              <img src={Logo} className="logo" />
              <div className="left-cover">
                <h2>
                  <span
                    style={{
                      fontSize: "27.5px",
                      color: "#b76117",
                      letterSpacing: "0.07em",
                    }}
                  >
                    AFRICAN UNIVERSITY
                  </span>
                  <br />
                  COLLEGE OF COMMUNICATIONS
                </h2>
                <h2>
                  <span
                    style={{
                      fontSize: "15px",
                      color: "#666",
                      letterSpacing: "0.35em",
                      top: "-30px",
                    }}
                  >
                    OFFER OF ADMISSION
                  </span>
                </h2>
              </div>
            </div>
            <div className="right-head address">
              {/*
                <address>
                    School of Graduate Studies<br/>
                    Private Mail Bag<br/>
                    University Post Office<br/>
                    Kumasi-Ghana<br/><br/>

                    Tel:+233 3220 60331<br/>
                    Fax:+233 3220 60137<br/>
                    Email: graduatestudies@knust.edu.gh<br/><br/>
                    <span className="small">30/10/2020</span>
                </address>
                */}
              <address>
                Admissions Office
                <br />
                African University
                <br />
                College of Communications <br />
                Postal Box LG 510
                <br />
                Adabraka, Accra
                <br />
                &nbsp;
                <span style={{ float: "left", direction: "ltr" }}>
                  +233 307016193
                </span>
                <br />
                admissions@aucc.edu.gh
              </address>
            </div>
          </header>
          <content>
            <section>
              <table className="ptable">
                <tbody>
                  <tr rowspan="2">
                    <td style={{ minwidth: "200px" }} colspan="2">
                      <h4
                        className="title"
                        style={{ color: "rgb(183, 97, 23)" }}
                      >
                        Ref No: {data && data.serial}
                      </h4>
                      <h4>
                        <span
                          style={{
                            color: "rgb(183, 97, 23)",
                            fontSize: "20px !important",
                          }}
                        >
                          {data && data.fname + " " + data.lname}
                          <br />
                          <span style={{ color: "#666" }}>
                            {data && data.resident_address}
                          </span>
                        </span>
                      </h4>
                      <br />
                      <span
                        className="shead"
                        style={{
                          fontFamily: "arial,times,helvetica",
                          fontSize: "12pt",
                        }}
                      >
                        Dear {data && data.fname},
                      </span>
                      <br />
                      <br />
                    </td>
                    <td align="right">
                      <h4 className="title">
                        {moment(data && data.created_at).format(
                          "MMMM DD, YYYY"
                        )}
                      </h4>
                      <br />
                    </td>
                  </tr>
                  <tr>
                    <td className="shead maincontent" colspan="3">
                      {ReactHtml(loadPlacerData((data && data.template) || ""))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>
          </content>
        </div>
      </div>
    </>
  );
};

export default PaperLetter;
