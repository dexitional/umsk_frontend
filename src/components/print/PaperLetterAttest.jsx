import ReactHtml from "html-react-parser";
import moment from "moment";
import React, { useRef } from "react";
import { useLoaderData } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import Logo from "../../assets/img/logo.png";
import Signature from "../../assets/img/thumb.png";
import Service from '../../utils/aisService';
import "./FormPrint.css";


// Loader for Single Project
export async function loader({ params }){
  const transwift = await Service.fetchTranswift(params.transwiftId)
  const letter = await Service.fetchLetter('att');
  console.log(transwift, letter)
  return { transwift,letter }
}

const PaperLetterAttest = () => {
 
  const { transwift,letter }  = useLoaderData();
  const student = transwift?.student;
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const output = `<div style="font-family:serif,times,helvetica;font-size:14pt">
    <p><u class="sbody" style="text-transform:uppercase;font-size:14pt">ATTESTATION LETTER IN RESPECT OF ::name <br/>
    INDEX NUMBER: ::indexno </u></p>
    <p><span style="text-transform:capitalize;color:#333;">::name</span> is ::academic_status student of the <span style="text-transform:capitalize;color:#333;">::program_name</span> programme at the African University College of Communications (AUCC).</p>
    <p>He was admitted to the University College in ::admit_year Academic year and completed the programme in ::complete_year.</p>
    <p>Any assistance you can offer ::person will be very much appreciated.</p>
    <p>Please do not hesitate to contact us for further clarification.</p>
    <p>Yours faithfully,</p>
    <p>&nbsp;</p>
    </p>::signature</p>
    </p>::signatory</p>
    </div>
    `;
  const loadPlacerData = (dt) => {
    dt = dt.replace(/::name/g, `${student?.fname} ${student?.mname ? student?.mname+' ': ''}${student?.lname}`);
    dt = dt.replace(/::academic_status/g, student?.completeStatus ? "a past":"currently an active");
    dt = dt.replace("::start_level",Math.ceil(student?.entrySemesterNum % 2) * 100
    );
    dt = dt.replace(/::program_name/g, student?.program?.longName?.toLowerCase());
    dt = dt.replace(/::admit_year/g, `${moment(student?.entryDate).format('YYYY')}/${moment(student?.entryDate).add(1,'year').format('YYYY')}`);
    dt = dt.replace(/::complete_year/g, student?.exitDate ? moment(student?.exitDate).format("MMMM, YYYY") : "the respective period");
    dt = dt.replace("::signatory", letter?.signatory);
    dt = dt.replace(/::indexno/g, student?.indexno);
    dt = dt.replace(/::person/g, student?.gender == 'M' ? 'him':'her');
    dt = dt.replace(
      "::signature",
      `<img src="${
        (letter?.signature) || Signature
      }" width='150px' height='50px' />`
    );
   
    return dt;
  };

  return (
    <>
      <div className="row">
         <div className="w-full"><button onClick={handlePrint} className="px-4 py-0.5 rounded-sm bg-primary-dark text-white font-semibold">Print</button></div>
      </div>
      <div className="print" ref={printRef}>
        <div className="" style={{background: `url(${Logo}) center 50% / 650px 650px no-repeat`, display: "block", zIndex: 10 }}></div>
        <div className="">
          <br /><br />
          <header>
            <div className="left-head">
              <img src={Logo} className="logo" />
              <div className="left-cover">
                <h2>
                  <span style={{ fontSize: "27.5px",color: "#b76117",letterSpacing: "0.07em" }}>AFRICAN UNIVERSITY</span>
                  <br/> OF COMMUNICATIONS AND BUSINESS
                </h2>
                <h2><span style={{ fontSize: "15px",color: "#666",letterSpacing: "0.35em",top: "-30px" }}>LETTER OF ATTESTATION</span></h2>
              </div>
            </div>
            <div className="text-base">
              
                {/* <address>
                    School of Graduate Studies<br/>
                    Private Mail Bag<br/>
                    University Post Office<br/>
                    Kumasi-Ghana<br/><br/>

                    Tel:+233 3220 60331<br/>
                    Fax:+233 3220 60137<br/>
                    Email: graduatestudies@knust.edu.gh<br/><br/>
                    <span className="small">30/10/2020</span>
                </address> */}
               
            
              <address className="text-sm">
                Registrar's Office <br />
                Postal Box LG 510<br />
                Adabraka, Accra<br />
                <br/>registrar@aucb.edu.gh
              </address>
             </div>
          </header>
          <content>
            <div className="h-[56rem]">
              <table className="ptable" style={{ marginTop:'120px' }}>
                <tbody>
                  <tr rowspan="2">
                    <td style={{ minwidth: "200px" }} colSpan={2}>
                      <p
                        className=""
                        style={{ 
                          fontSize: "20px",
                          fontFamily:'serif',
                          fontWeight:600,
                          color: "#333",
                          marginBottom:"30px"
                       }}>
                        Ref. #: {student?.indexno}
                      </p>
                      <p>
                        <span style={{ color: "#333",fontSize: "14pt", fontWeight:'bold', fontFamily:'serif' }}>TO WHOM IT MAY CONCERN</span>
                      </p>
                      <br />
                      <span className="shead" style={{fontFamily: "serif",fontSize: "14pt",}}>Dear Sir/Madam,</span>
                      <br /><br /></td>
                    <td align="right"><p className="title" style={{ fontFamily: "serif", fontSize: "14pt" }}>{moment(new Date()).format("MMMM DD, YYYY")}</p><br /></td>
                  </tr>
                  <tr><td className="shead maincontent" colSpan={3}>{ReactHtml(loadPlacerData(letter?.template || output))}</td></tr>
                </tbody>
              </table>
            </div>
          </content>
        </div>
      </div>
    </>
  );
};

export default PaperLetterAttest;
