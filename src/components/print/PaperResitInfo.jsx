import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import { useReactToPrint } from 'react-to-print';
import Logo from '../../assets/img/logo.png';
import Mark from '../../assets/img/watermark.jpg';
import '../../components/admission/FormPrint.css';
import { getGradeByTotal } from '../../store/utils/admissionUtil';



const PaperResitInfo = () => {

  const { sso } = useSelector(state=>state)
  const { user,modal } = sso
  const dispatch = useDispatch()
  const printRef = useRef();
  const history = useHistory();
  const [ data, setData ] = useState([]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });


  useEffect(()=>{
    //handlePrint()
    //loadGrades()
     modal.content && setData({...modal.content})
     console.log(modal.content)
  },[])

  
  return (
     <>
     <div className="row">
        <div className="Box small-12 columns" style={{width:'900px', margin:'0px auto',float:'none',overflow:'hidden'}}>
            <div className="small-6 columns u-pl-0">
                <p className="u-mb-2 d-none"> <b>STAFF NUMBER : 15666</b> </p>
            </div>
            <div className="small-6 columns u-pr-0">
                <button onClick={handlePrint} className="Button u-floatRight u-mb-2">&nbsp;&nbsp;Print&nbsp;&nbsp;</button>
            </div>
        </div>
     </div>
     
     <div ref={printRef}>
     <div className="fade-bg" style={{ background:` center 75% / 650px 650px no-repeat url(${Mark})`}}></div>
     <div className="cover">
       <header>
           <div className="left-head">
               <img src={Logo} className="logo"/>
               <div className="left-cover">
                    <h2><span style={{fontSize:'27.5px',color:'#b76117',letterSpacing:'0.07em'}}>AFRICAN UNIVERSITY</span><br/>COLLEGE OF COMMUNICATIONS</h2>
                    <h3 className="title-group">ACADEMIC MANAGEMENT SYSTEM</h3>
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
                    University Post Office<br/>
                    Private Mail Bag<br/>
                    AUCC-Ghana<br/><br/>
                    Tel:+233 3220 00001<br/>
                    Email: hr@aucc.edu.gh<br/>
                    <span className="aurora-small">{moment().format('DD/MM/YYYY')}</span>
                </address>
           </div>
       </header>
       <content>
           <section >
               <table class="ptable">
                   {/* Personal */}
                   <tr>
                       <td style={{ minWidth:'200px'}}><h3 className="title">Resit Information</h3></td>
                       <td colSpan={2}>&nbsp;</td>
                   </tr>
                   <tr>
                       <td rowSpan={6}>
                           <img src={data.photo ? data.photo : Logo } style={{height:'200px',display:'block'}} />
                       </td>
                       <td className="shead">Student Name:</td>
                       <td className="sbody">{ data.name && data.name.toUpperCase() }</td>
                   </tr>
                   <tr>
                       <td className="shead">Index Number:</td>
                       <td className="sbody"><small><b>{ data.indexno }</b></small></td>
                   </tr>
                   <tr>
                       <td className="shead">Program:</td>
                       <td className="sbody"><small><b>{ data.program_name && data.program_name.toUpperCase() || '-- NONE --' }</b></small></td>
                   </tr>
                  <tr>
                       <td colSpan={2}><hr/></td>
                  </tr>
                  <tr>
                       <td className="shead">Course Name:</td>
                       <td className="sbody">{data.course_name && data.course_name.toUpperCase()}</td>
                   </tr>
                   <tr>
                       <td className="shead">Course Code:</td>
                       <td className="sbody">{data.course_code}</td>
                   </tr>
                   <tr>
                       <td rowSpan={11}></td>
                       <td className="shead">Trailed Session:</td>
                       <td className="sbody">{data.session_name  && data.session_name.toUpperCase()  }</td>
                   </tr>
                   <tr>
                       <td className="shead">Trailed Level/Year:</td>
                       <td className="sbody">{Math.ceil(data.semester/2)  }</td>
                   </tr>
                   <tr>
                       <td className="shead">Payment Status:</td>
                       <td className="sbody">{data.paid ? 'PAID':'NOT PAID' }</td>
                   </tr>
                   { data.paid ?
                   <tr>
                       <td className="shead">Payment Date:</td>
                       <td className="sbody">{data.paid_at ? moment(data.paid_at).format('DD MMMM, YYYY').toUpperCase() : 'NOT PAID' }</td>
                   </tr>
                    : null }
                   <tr>
                       <td className="shead">Register Status:</td>
                       <td className="sbody">{data.register ? 'REGISTERED':'NOT REGISTERED'}</td>
                   </tr>
                   <tr>
                       <td className="shead">Take Status:</td>
                       <td className="sbody">{data.taken ? 'TAKEN':' NOT TAKEN' }</td>
                   </tr>
                   { data.register ?
                   <>
                   <tr>
                       <td colSpan={2}><hr/></td>
                  </tr>
                  <tr>
                       <td className="shead">Resit Total Score:</td>
                       <td className="sbody">{data.total_score || 0}</td>
                   </tr>
                   <tr>
                       <td className="shead">Resit Grade:</td>
                       <td className="sbody">{getGradeByTotal(data.total_score || 0,data.grade_meta)}</td>
                   </tr>
                   </> : null
                   }
                  
               </table>
           </section>

        </content>
    </div>
    </div>
    </>
  )
}

export default PaperResitInfo
