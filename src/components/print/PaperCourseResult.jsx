import React,{useState,useEffect,useRef} from 'react'
import '../admission/FormPrint.css'
import Logo from '../../assets/img/logo.png'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { fetchSemesterSlip } from '../../store/utils/ssoApi'
import { useReactToPrint } from 'react-to-print';
import { getGradeByTotal, getStudyMode } from '../../store/utils/admissionUtil'

const PaperCourseResult = () => {
    const { sso } = useSelector(state=>state)
    const { user,modal } = sso
    const [ courses, setCourses ] = useState([])
    const printRef = useRef();

    const loadSemesterSlip = async () => {
		const res = await fetchSemesterSlip(user.user.session_id,user.user.indexno)
		if(res.success){
		   if(res.data.length > 0){
			  setCourses([...res.data])
           }
        }
	}


    const handlePrint = useReactToPrint({
      content: () => printRef.current,
    });
    

    useEffect(() => {
	  loadSemesterSlip()
      //handlePrint()
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
           {/* COURSE RESULT STATEMENTS */}
           <div style={{marginTop:'40px'}}/>
           
           <section>
                <h1 className="h1title fore">AFRICAN UNIVERSITY COLLEGE OF COMMUNICATIONS, ACCRA</h1>
                <h2 className="h2title">{ modal && modal.content.header.calendar } - { modal && (modal.content.header.stream == 'MAIN' ? 'MAIN & SEPTEMBER':'SUB & JANUARY') } STREAM</h2>
                <h3 className="h3title">{modal && modal.title} <br/><br/><h2 >RESULT STATEMENT</h2></h3>
                <img src={Logo} style={{ height:'90px', width:'90px',position:'relative',top:'-75px',left: '90px', margin:'0px auto -55px' }}/>
                <div className="separator"></div>
                <div className="title-cover">
                    <div className="title-group">
                       <b>CALENDAR : &nbsp;&nbsp;{ modal && modal.content.header.calendar }</b><br/>
                       <b>STREAM :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ modal && (modal.content.header.stream == 'MAIN' ? 'MAIN & SEPTEMBER':'SUB & JANUARY') }</b><br/>
                       <b>TYPE :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ modal && (modal.content.header.flag_certified == '1' ? 'CERTIFIED & PUBLISHED':'PROVISIONAL') } </b><br/>
                    </div>
                    <div className="title-group">
                       <b>PROGRAMME : &nbsp;&nbsp;{ modal && modal.content.header.program_name }</b><br/>
                       <b>YEAR : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ modal && Math.ceil(modal.content.header.semester/2) }</b><br/>
                       <b>CLASS : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ modal && getStudyMode(modal.content.header.session).toUpperCase() }</b><br/>
                    </div>
                </div><br/>
                 <div className="separator"></div>
                <table className="stable">
                    <tbody>
                        <tr className="thead">
                            <td className="codetitle" align="left">INDEX NO</td>
                            <td className="tdtitle">STUDENT</td>
                            <td align="center">CLASS </td>
                            <td align="center">EXAMS</td>
                            <td align="center">TOTAL</td>
                            <td align="center">GRADE</td>
                           
                        </tr>
                        { modal && modal.content.data.map(row => 
                        <tr class="tbody">
                            <td align="left"><b>{row.indexno.toUpperCase()}</b></td>
                            <td><b>{row.name.toUpperCase()}</b></td>
                            <td align="center">{row.class.value}</td>
                            <td align="center">{row.exam.value}</td>
                            <td align="center"><b>{parseInt(row.class.value)+parseInt(row.exam.value)}</b></td>
                            <td align="center"><b>{getGradeByTotal((parseInt(row.class.value)+parseInt(row.exam.value)),row.scheme)}</b></td>
                        </tr>
                        ) ||
                         <tr>
                            <td colspan="6" align="center"><b>NO RESULTS PUBLISHED !!</b></td>
                         </tr>
                       }
                    </tbody>
              </table>
              
            </section>



        </content>
    </div>
    </div>
    </> 
    )
}

export default PaperCourseResult

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