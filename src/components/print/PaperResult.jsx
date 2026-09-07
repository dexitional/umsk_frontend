import React,{useState,useEffect,useRef} from 'react'
import '../admission/FormPrint.css'
import Logo from '../../assets/img/logo.png'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { fetchSemesterSlip } from '../../store/utils/ssoApi'
import { useReactToPrint } from 'react-to-print';
import { helperData }  from '../../store/utils/helperData'

const PaperResult = () => {
    const { sso } = useSelector(state=>state)
    const { user,modal } = sso
    const [ courses, setCourses ] = useState([])
    const printRef = useRef();
   

    const loadSemesterSlip = async () => {
		const res = await fetchSemesterSlip(user.user.session_id,user.user.indexno)
		if(res.success){
		   if(res.data.length > 0){
			  setCourses([...res.data])
              console.log(res.data)
		   }
        }
	}

    const getGrade = (num) => {
        if(num == null) return 'IC'
        num = parseFloat(num)
        const vs = modal.content.grades && modal.content.grades.find(row => row.min <= num && num <= row.max)
        return (vs && vs.grade) || 'I';
     }
 
     const getPoint = (num) => {
        num = parseFloat(num)
        const vs = modal.content.grades && modal.content.grades.find(row => row.min <= num && num <= row.max)
        return (vs && parseFloat(vs.gradepoint)) || 0;
     }

    const handlePrint = useReactToPrint({
      content: () => printRef.current,
    });
    

    useEffect(() => {
	  loadSemesterSlip()
      //handlePrint()
      console.log(`${modal.content.data}`)
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
                <h2 className="h2title">{user.user.program_name && user.user.program_name.toUpperCase()}</h2>
                <h3 className="h3title">{`${modal.content.title}, YEAR ${modal.content.data.year} RESULTS`}</h3>
                <img src={Logo} style={{height:'90px', width:'90px',position:'relative',top:'-75px',left: '90px', margin:'0px auto -55px'}}/>
                
                <hr className="divider"/>
                <div className="title-cover">
                    <div className="title-group">
                       <span>Name: {user.user.lname && user.user.lname.toUpperCase()}, {`${user.user.fname} ${user.user.mname || ''}`}</span><br/>
                       <span>Student ID: {user.user.refno}</span><br/>
                       <span>Index Number: {user.user.indexno && user.user.indexno.toUpperCase()}</span><br/>
                       <span>Option: {user.user.session && (user.user.session == 'M'?'MORNING':(user.user.session == 'E' ? 'EVENING':'WEEKEND')) || 'MORNING'}</span><br/>
                    </div>
                    <div className="title-group">
                       <span>Programme: {user.user.program_name && user.user.program_name.toUpperCase()}</span><br/>
                       <span>Major: { user.user.major_name || 'None'}</span><br/>
                       <span>Year: { modal.content.data && modal.content.data.year }</span><br/>
                       <span>Date printed: {moment().format('DD-MMM-YYYY HH:MM A')}</span><br/>
                    </div>
                </div>
                <hr className="divider"/>
                <table className="stable">
                    <tbody>
                        <tr className="thead">
                            <td className="codetitle" align="center">Course code</td>
                            <td className="tdtitle">Course name</td>
                            <td align="center">Credits</td>
                            <td align="center">Marks</td>
                            <td align="center">Grade</td>
                            <td className="codetitle" align="center">Grade Point</td>
                        </tr>
                        { modal.content.data.data && modal.content.data.data.length > 0 ?
						modal.content.data.data.map((row) =>
                        row.flag_visible == 1 ?
                        <tr class="tbody">
                            <td align="left">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{row.course_code && row.course_code.toUpperCase()}</td>
                            <td>{row.course_name && row.course_name.toUpperCase()} {row.score_type == 'R' ? ' (Resit)':''}</td>
                            <td align="center">{row.credit}</td>
                            <td align="center">{row.total_score}</td>
                            <td align="left">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{getGrade(row.total_score)}</td>
                            <td align="center">{ (getPoint(row.total_score)).toFixed(1) }</td>
                        </tr>
                        :
                        <tr class="tbody">
                            <td align="left">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{row.course_code && row.course_code.toUpperCase()}</td>
                            <td>{row.course_name && row.course_name.toUpperCase()} {row.score_type == 'R' ? ' (Resit)':''}</td>
                            <td align="center">{row.credit}</td>
                            <td align="center">--</td>
                            <td align="center" colSpan={2}>RESULT NOT RELEASED</td>
                        </tr>
                         ) : 
                         <tr>
                            <td colspan="6" align="center"><b>NO RESULTS PUBLISHED !!</b></td>
                         </tr>
                        }
                    </tbody>
              </table>
              <hr className="divider"/>
              <div className="title-cover">
                    <div className="title-group flex-2">&nbsp;</div>
                    <div className="title-group"><b>CRT:&nbsp;</b>{modal.content.data && modal.content.data.data.reduce((acc,row)=> row.credit+acc,0)}</div>
                    <div className="title-group"><b>GPT:&nbsp;</b>{modal.content.data && modal.content.data.data.reduce((acc,row)=>(getPoint(row.total_score) * row.credit)+acc,0).toFixed(1)}</div>
                   { /*<div className="title-group"><b>CCR:&nbsp;</b>10</div>
                    <div className="title-group"><b>CGV:&nbsp;</b>10</div>*/}
                    <div className="title-group"><b>GPA:&nbsp;</b>{ modal.content.data && ((modal.content.data.data.reduce((acc,row)=> (getPoint(row.total_score) * row.credit)+acc,0) / (modal.content.data.data.reduce((acc,row)=> row.credit+acc,0))).toFixed(2)) }</div>
                    <div className="title-group"><b>CGPA:&nbsp;</b>{ modal.content.data.cgpa || (  modal.content.data && modal.content.data.data && ((modal.content.data.data.reduce((acc,row)=> (getPoint(row.total_score) * row.credit)+acc,0) / (modal.content.data.data.reduce((acc,row)=> row.credit+acc,0))).toFixed(2))) }</div>
                    <div className="title-group flex-2">&nbsp;</div>
              </div><br/>
              <div className="separator"></div>
            </section>



        </content>
    </div>
    </div>
    </> 
    )
}

export default PaperResult

{/*


element.style {
}
<style>
.token-padding {
    padding-left: 15px;
    padding-right: 15px;
    border: 4px solid #f58635;
    position: relative;
}
<style>
.token-information {
    border-radius: 10px;
    overflow: hidden;
}
@media (min-width: 576px)
<style>
.card-full-height {
    height: calc(77% - 30px);


*/}