import React, { useState, useEffect, useRef } from "react";
import "../admission/FormPrint.css";
import Logo from "../../assets/img/logo.png";
import Signature from "../../assets/img/signature.png";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";
import moment from "moment";
import ReactHtml from "html-react-parser";
import { ToWords } from "to-words";
import { getLevelSemester } from "../../store/utils/util";

const PaperDefer = () => {
  const { sso } = useSelector((state) => state);
  const { modal } = sso;
  const [data, setData] = useState({});
  const [letter, setLetter] = useState({});
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const output = `
    <div style="margin-top:40px font-family:arial,times,helvetica;font-size:15pt">
      <p><b>Ref: #: AR/LO/Vol.1/0264</b></p>
      <p>::current_date</p>
      <p>::name<br/>::refno<br/>AUCC</p>
      <p>Dear Madam,</p>
      <p><u class="sbody" style="fontSize:16pt" ><b>RE: DEFERMENT LETTER</b></u></p>
      <p>Your letter dated ::letter_date is referred.</p>
      <p>I write to inform you that your application has been approved.</p>
      <p>You are to commence lectures in the level 100 First semester of the 2022/2023 academic year.</p>
      <p>Deferment has the maximum of two (2) Academic years, beyond which your studentship lapses.</p>
      <p>All the best.</p>
      <p>Yours faithfully,</p>
      <p>&nbsp;</p>
      </p>::signatory</p>
      <p>Priscilla Dede Martey (Ms.)<br/>Ag. Director, Academic Affairs</p>
      <p>CC: Ag. Director of Finance<br/>Head, Admission</p>
    </div>
    `;
  const loadPlacerData = (dt) => {
    const levelsem = getLevelSemester(data.semester)
    console.log(data)
    const sem_years = data && data.academic_year && data.academic_year.split('/')
    const new_cal = `${parseInt(sem_years && sem_years[0])+data.period}/${parseInt(sem_years && sem_years[1])+data.period}`
    dt = dt.replace("::name", data && data.name);
    dt = dt.replace("::refno", data && data.refno);
    dt = dt.replace("::resume_period", `${levelsem[0]} ${levelsem[1]} Semester of the ${new_cal}`);
    
    dt = dt.replace("::letter_date", data && moment(data.created_at).format('MMMM DD, YYYY'));
    dt = dt.replace("::current_date", data && moment(data.created_at).format('MMMM DD, YYYY'));
    dt = dt.replace("::reference", data && ` AR/LO/Vol.${moment(data.created_at).format('YY')}/${moment(data.created_at).format('MMDD')}`);
    dt = dt.replace(/::ccs/g, (letter && letter.cc));
    dt = dt.replace(/::signatory/g, (letter && letter.signatory));
    dt = dt.replace("::signature",`<img alt="signature" src="${(letter && letter.signature) || Signature}" width='150px' height='50px' />`);
    const toWords = new ToWords({
      localeCode: "en-US",
      converterOptions: {
        currency: false,
        ignoreDecimal: false,
        ignoreZeroCurrency: false,
        doNotAddOnly: true,
      }
    });
    dt = dt.replace(/::period/g,`${toWords.convert((data && data.period) || 1)} (${data && data.period})`);
    return dt;
  };

  useEffect(() => {
    //handlePrint()
    modal.content.rt && setData({ ...modal.content.rt });
    modal.content.letter && setLetter({ ...modal.content.letter });
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
                {/* <h2>
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
                </h2> */}
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
                Academic Registry
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
                registry@aucc.edu.gh
              </address>
            </div>
          </header>
          <content>
            <section>
              <table className="ptable" style={{ borderBottom:'none', boxShadow:'none' }}>
                <tbody>
                  <tr>
                    <td className="shead maincontent" colspan="3">
                      { ReactHtml(loadPlacerData(letter && letter.template || output))  }
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

export default PaperDefer;
