import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useReactToPrint } from 'react-to-print'
import Logo from '../../assets/img/logo.png'
import './admission/FormPrint.css'

const PaperTranscript = () => {
    const { sso } = useSelector(state=>state)
    const { modal } = sso
    const [ courses, setCourses ] = useState([])
    const [ user, setUser ] = useState({})
    
    const printRef = useRef();

    const handlePrint = useReactToPrint({
      content: () => printRef.current,
    });
    
    useEffect(() => {
        modal.content.user && setUser({...modal.content.user});
        modal.content.regdata && setCourses([...modal.content.regdata]);
    },[])

	
    return (
    <>
    <div className="row">
        <div className="Box small-12 columns" style={{width:'900px', margin:'0px auto',float:'none',overflow:'hidden'}}>
            <div className="small-12 columns u-pr-0 right">
                <button onClick={handlePrint} className="Button u-floatRight u-mb-2">&nbsp;&nbsp;Print Registration Slip&nbsp;&nbsp;</button>
            </div>
        </div>
     </div>
    <div className="print" ref={printRef}>
    <div className="cover">
       <content>
           <div style={{marginTop:'40px'}}/>
           <section>
                <h1 className="h1title fore">AFRICAN UNIVERSITY COLLEGE OF COMMUNICATIONS, ACCRA</h1>
                <h2 className="h2title">{user.program_name && user.program_name.toUpperCase()}</h2>
                <h3 className="h3title">DETAILED RESULTS STATEMENT</h3>
                <img src={Logo} style={{height:'90px', width:'90px',position:'relative',top:'-75px',left: '90px', margin:'0px auto -55px'}}/>
                <hr className="divider"/>
                <div className="title-cover">
                    <div className="title-group">
                       <span>Name: {user.lname && user.lname.toUpperCase()}, {`${user.fname} ${user.mname || ''}`}</span><br/>
                       <span>Student ID: {user.refno}</span><br/>
                       <span>Index Number: {user.indexno && user.indexno.toUpperCase()}</span><br/>
                       <span>Mode: {user.session && (user.session == 'M'?'Morning':(user.session == 'E' ? 'Evening':'Weekend')) || 'Morning'}</span><br/>
                    </div>
                    <div className="title-group">
                       <span>Programme: {user.program_name && user.program_name.toUpperCase()}</span><br/>
                       <span>Major: { user.major_name || 'None'}</span><br/>
                       <span>Year: {Math.ceil(user.semester/2)}</span><br/>
                       <span>Date/time printed: {moment().format('DD-MMM-YYYY HH:MM A')}</span><br/>
                    </div>
                </div>
                <hr className="divider"/>
                <div>
                    <h1>
                        <span></span>
                        <span></span>
                    </h1>
                    <table className="stable">
                        <tbody>
                            <tr className="thead">
                                <td className="codetitle" align="center">COURSE CODE</td>
                                <td className="tdtitle" align="left">COURSE TITLE</td>
                                <td align="center">GRADE</td>
                                <td></td>
                            </tr>
                            { courses && courses.length > 0 ?
                            courses.map((row) =>
                            <tr class="tbody">
                                <td align="center">{row.course_code && row.course_code.toUpperCase()}</td>
                                <td>{row.course_name && row.course_name.toUpperCase()}</td>
                                <td align="center">{row.grade}</td>
                                <td>{row.score_type && row.score_type == 'R' ? 'Resit':''}</td>
                            </tr>
                            ) : null }
                        </tbody>
                    </table>
                </div>
                
              <hr className="divider"/>
              <h3 className="ftitle" style={{display:'none'}}>THIS IS NOT AN OFFICIAL TRANSCRIPT</h3>
              <br/><br/><br/><br/><div className="separator"></div>
            </section>

        </content>
    </div>
    </div>
    </> 
    )
}

export default PaperTranscript
