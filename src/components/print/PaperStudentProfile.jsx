import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import { useReactToPrint } from 'react-to-print';
import Logo from '../../assets/img/logo.png';
import Mark from '../../assets/img/watermark.jpg';
import '../../components/admission/FormPrint.css';



const PaperStudentProfile = () => {

  const { sso } = useSelector(state=>state)
  const { user,modal } = sso
  const dispatch = useDispatch()
  const printRef = useRef();
  const history = useHistory();
  const [ data, setData ] = useState({});

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
                    <h3 className="title-group">University Student Information</h3>
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
                    Academic Registry<br/>
                    University Post Office<br/>
                    AUCC-Ghana<br/><br/>
                    Tel:+233 3220 00001<br/>
                    <span className="aurora-small">Dated: {moment().format('DD/MM/YYYY')}</span>
                </address>
           </div>
       </header>
       <content>
           <h3 className="center black d-none"> Please Indicate Your Envelope Number At The Back Of Your EMS Envelope</h3>
           <h3 className="red w50 ws-auto center d-none">Add photocopies of all related documents, certificates & results Keep a copy of this printout for any future enquiry.</h3>
           <section >
               <table class="ptable">
                   {/* Personal */}
                   <tr>
                       <td style={{ minWidth:'200px'}}><h3 className="title">Student File </h3></td>
                       <td colSpan={2}>&nbsp;</td>
                   </tr>
                   <tr>
                       <td rowSpan={12}>
                           <img src={`https://portal.aucc.edu.gh/api/photos/?tag=${data.refno}`} style={{height:'200px',display:'block'}} />
                       </td>
                       <td className="shead">Student Reference ID:</td>
                       <td className="sbody">{ data.refno }</td>
                   </tr>
                   <tr>
                       <td className="shead">Student Index Number:</td>
                       <td className="sbody"><small><b>{ data.indexno}</b></small></td>
                   </tr>
                   <tr>
                       <td className="shead">Student E-mail:</td>
                       <td className="sbody"><small><b>{ data.institute_email && data.institute_email.toUpperCase() || '-- NONE --'}</b></small></td>
                   </tr>
                   <tr>
                       <td className="shead"> Program of Study:</td>
                       <td className="sbody"><small><b>{ data.program_name && data.program_name.toUpperCase() || '-- NONE --' }</b></small></td>
                   </tr>
                   <tr>
                       <td className="shead"> Program Major:</td>
                       <td className="sbody"><small><b>{ data.major_name && data.major_name.toUpperCase() || '-- NONE --' }</b></small></td>
                   </tr>
                   <tr>
                       <td className="shead"> Mode of Study:</td>
                       <td className="sbody"><small><b>{ data.session == 'M' ? 'MORNING': ( data.session == 'E' ? 'EVENING':'WEEKEND' ) }</b></small></td>
                   </tr>
                   <tr>
                       <td className="shead"> Date of Admission:</td>
                       <td className="sbody"><small><b>{ data.doa && moment(data.doa).format('MMMM, YYYY').toUpperCase() || '-- NONE --' }</b></small></td>
                   </tr>
                   <tr>
                       <td className="shead">Active Year :</td>
                       <td className="sbody"><small><b>{ Math.ceil(data.semester/2)}  - ( LEVEL { Math.ceil(data.semester/2)*100} )</b></small></td>
                   </tr>

                   <tr>
                     <td className="shead"> Academic Status:</td>
                     <td className="sbody">
                        <small>
                          { (data.complete_status == 0 && data.defer_status == 0) && <b> ACTIVE </b> }
                          { (data.complete_status == 0 && data.defer_status == 1) && <b> DEFFERED </b> }
                          { (data.complete_status == 1) && <b> COMPLETED ({data.complete_type})</b> }
                         
                        
                        </small>
                     </td>
                   </tr>
                  <tr>
                       <td colSpan={2}><hr/></td>
                  </tr>
                  <tr>
                       <td className="shead">Title:</td>
                       <td className="sbody">{data.title && data.title.toUpperCase() || '-- NONE --'}</td>
                   </tr>
                   <tr>
                       <td className="shead">Surname:</td>
                       <td className="sbody">{data.lname && data.lname.toUpperCase() || '-- NONE --'}</td>
                   </tr>
                   <tr>
                       <td rowSpan={11}></td>
                       <td className="shead">Other Names:</td>
                       <td className="sbody">{data.fname && data.fname.toUpperCase()} {data.mname && data.mname.toUpperCase()}</td>
                   </tr>
                   <tr>
                       <td className="shead">Date of Birth:</td>
                       <td className="sbody">{data.dob && moment(data.dob).format('DD MMMM, YYYY').toUpperCase() || '-- NONE --'}</td>
                   </tr>
                   <tr>
                       <td className="shead">Gender:</td>
                       <td className="sbody">{data.gender == 'M' ? 'MALE':'FEMALE'}</td>
                   </tr>
                  <tr>
                       <td className="shead">Home Town:</td>
                       <td className="sbody">{data.hometown || '-- NONE --'}</td>
                   </tr>
                  <tr>
                       <td className="shead">Phone Number:</td>
                       <td className="sbody">{data.phone || '-- NONE --'}</td>
                   </tr>
                   <tr>
                       <td className="shead">Email Address:</td>
                       <td className="sbody">{data.email && data.email.toUpperCase() || '-- NONE --'}</td>
                   </tr>
                   <tr>
                       <td className="shead">Postal Address:</td>
                       <td className="sbody">{data.address && data.address.toUpperCase() || '-- NONE --'}</td>
                   </tr>
                   <tr>
                       <td className="shead">National ID:</td>
                       <td className="sbody">{data.national_type}{data.national_id && ' [ '+data.national_id.toUpperCase()+' ]' || '-- NONE --'}</td>
                   </tr>
                   <tr>
                       <td className="shead">Guardian name & address:</td>
                       <td className="sbody">{data.guardian_name && data.guardian_name.toUpperCase()} {data.guardian_phone && ` ( ${data.guardian_phone.toUpperCase()} )`}</td>
                   </tr>
                   
                </table>
           </section>

        </content>
    </div>
    </div>
    </>
  )
}

export default PaperStudentProfile
