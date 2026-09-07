import React,{useState,useEffect,useRef} from 'react'
import '../admission/FormPrint.css'
import Logo from '../../assets/img/logo.png'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { fetchSemesterSlip } from '../../store/utils/ssoApi'
import { useReactToPrint } from 'react-to-print';
import { helperData } from'../../store/utils/helperData'

const PaperDetailSlip = () => {
    const { sso } = useSelector(state=>state)
    const { modal } = sso
    const [ mdata, setMdata ] = useState({})
    const [ vdata, setVdata ] = useState([])
    const [ user, setUser ] = useState({})
    const printRef = useRef();
   


    const handlePrint = useReactToPrint({
      content: () => printRef.current,
    });

    const stageAverages = () => {
        let dt = [], cgp = 0, ccr = 0;
        modal.content.data && Object.entries(modal.content.data).map(([name,data],i) => {
            if(data && data.length > 0){
            data.map((row) => {
              cgp += helperData.getPoint(row.total_score,JSON.parse(row.grade_meta)) * row.credit
              ccr += row.credit
              setUser({ indexno: row.indexno, refno: row.refno, name: row.name, program_name: row.program_name, major_name: row.major_name, session: row.mode })
            }) 
            dt.push({ cgpa: (cgp/ccr).toFixed(2) })
          }
        }) 
        setVdata(dt)
    }

    
    useEffect(() => {
       // modal.content.user && setUser({...modal.content.user});
        modal.content.data && setMdata({ ...modal.content.data });
        stageAverages()
        
	},[])

	
    return (
    <>
    <div className="row">
        <div className="Box small-12 columns" style={{width:'900px', margin:'0px auto',float:'none',overflow:'hidden'}}>
            <div className="small-12 columns u-pr-0 right">
                <button onClick={handlePrint} className="Button u-floatRight u-mb-2">&nbsp;&nbsp;Print&nbsp;&nbsp;</button>
            </div>
        </div>
     </div>
    <div className="print" ref={printRef}>
    <div className="cover">
       <content>
           {/* REGISTRATION SLIP */}
           <div style={{marginTop:'40px'}}/>
           <section>
                <h1 className="h1title fore">AFRICAN UNIVERSITY COLLEGE OF COMMUNICATIONS, ACCRA</h1>
                <h1 className="h2title">DETAILED RESULTS STATEMENT</h1>
                <img src={Logo} style={{height:'90px', width:'90px',position:'relative',top:'-75px',left: '90px', margin:'0px auto -55px'}}/>
                <div className="title-cover">
                    <div className="title-group">
                       <span>FULL NAME: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>{user.name}</b></span><br/>
                       <span>STUDENT ID: &nbsp;&nbsp;&nbsp;&nbsp;<b>{user.refno}</b></span><br/>
                       <span>INDEX NUMBER: <b>{user.indexno}</b></span><br/>
                    </div>
                    <div className="title-group">
                       <span>PROGRAMME: <b>{user.program_name && user.program_name.toUpperCase()}</b></span><br/>
                       <span>MAJOR: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>{ user.major_name || 'None'}</b></span><br/>
                       <span>MODE: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>{user.session && (user.session == 'M'?'MORNING':(user.session == 'E' ? 'EVENING':'WEEKEND')) || ''}</b></span><br/>
                    </div>
                </div>
                <hr className="divider"/>
                { mdata && Object.entries(mdata).map(([name,data],i) => {
                 var sdata = { cgpa:0, ccr: 0, cgp: 0, tcr:0, tgp: 0 }
                return (
                <div style={{ marginBottom:'20px',marginTop:'20px'}}>
                    <h1 className="h1title">
                        <b className="h2title fore">{name}</b>{"  |  "}
                        <span className="h3title">LEVEL {data[0].level}</span>
                    </h1>
                    <table className="stable">
                        <tbody>
                            <tr className="thead">
                                <td className="codetitle" align="center">COURSE CODE</td>
                                <td className="tdtitle" align="left">COURSE TITLE</td>
                                <td align="center">CR</td>
                                <td align="center">GD</td>
                                <td align="center">GP</td>
                                <td></td>
                            </tr>
                            { data && data.length > 0 ?
                            data.map((row) => {
                             sdata = { ...sdata, tcr: sdata.tcr+row.credit, tgp: sdata.tgp+(helperData.getPoint(row.total_score,JSON.parse(row.grade_meta)) * row.credit)}
                             //setVata({...vdata, cgp: vdata.cgp+sdata.tgp, ccr: vdata.ccr+sdata.tcr })
                            return (    
                            <tr class="tbody">
                                <td align="center">{row.course_code && row.course_code.toUpperCase()}</td>
                                <td>{row.course_name && row.course_name.toUpperCase()}</td>
                                <td align="center">{row.credit}</td>
                                <td align="center">{row.grade}</td>
                                <td align="center">{ parseFloat(helperData.getPoint(row.total_score,JSON.parse(row.grade_meta))).toFixed(1)}</td>
                                <td>{row.score_type && row.score_type == 'R' ? 'Resit':''}</td>
                            </tr>
                             )}) : null }
                             <tr className="tbody">
                                <td className="codetitle">&nbsp;</td>
                                <td className="tdtitle"><b>CGPA : <span className="fore">{vdata[i].cgpa}</span></b></td>
                                <td align="center"><b>GPA : <span className="fore">{(sdata.tgp/sdata.tcr).toFixed(2)}</span></b></td>
                                <td align="center"><b>TCR : <span className="fore">{sdata.tcr}</span></b></td>
                                <td align="center"><b>TGP : <span className="fore">{sdata.tgp.toFixed(1)}</span></b></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                )})}

               <h3 className="ftitle" style={{display:'none'}}>THIS IS NOT AN OFFICIAL TRANSCRIPT</h3>
              <br/><br/>
            </section>

        </content>
    </div>
    </div>
    </> 
    )
}

export default PaperDetailSlip
