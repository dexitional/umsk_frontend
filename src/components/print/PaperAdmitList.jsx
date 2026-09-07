import React,{useState,useEffect,useRef} from 'react'
import '../admission/FormPrint.css'
import Logo from '../../assets/img/logo.png'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { fetchSemesterSlip } from '../../store/utils/ssoApi'
import { useReactToPrint } from 'react-to-print';

const PaperAdmitList = () => {
    const { sso } = useSelector(state=>state)
    const { modal } = sso
    const [ data, setData ] = useState([])
    //const [ session, setSession ] = useState({})
    
    const printRef = useRef();

    const handlePrint = useReactToPrint({
      content: () => printRef.current,
    });
    
    useEffect(() => {
        //modal.content.session && setSession({...modal.content.session});
        modal.content.data && setData([...modal.content.data]);
    },[])

	
    return (
    <>
    <div className="row">
        <div className="Box small-12 columns" style={{width:'900px', margin:'0px auto',float:'none',overflow:'hidden'}}>
            <div className="small-12 columns u-pr-0 right">
                <button onClick={handlePrint} className="Button u-floatRight u-mb-2">&nbsp;&nbsp;Print List&nbsp;&nbsp;</button>
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
                <h2 className="h2title">{`${new Date().getFullYear()} ADMISSIONS`}</h2>
                <h3 className="h3title">LIST OF ADMITTED APPLICANTS</h3>
                <img src={Logo} style={{height:'90px', width:'90px',position:'relative',top:'-75px',left: '90px', margin:'0px auto -55px'}}/>
                <hr className="divider"/>
                <table className="stable">
                    <tbody>
                        <tr className="thead">
                            <td className="tdtitle" align="left">STUDENT ID</td>
                            <td className="tdtitle" align="left">STUDENT NAME</td>
                            <td className="tdtitle" align="center">PROGRAMME</td>
                            <td className="tdtitle" align="left">YEAR</td>
                        </tr>
                        { data && data.length > 0 ?
						data.map((row) =>
                        <tr class="tbody">
                            <td align="left">{row.serial}</td>
                            <td align="left">
                                <span>{row.name} <b>({row.gender})</b></span><br/>
                                <small style={{fontWeight:'bolder', color:''}}>{row.phone && <span style={{fontWeight:'bolder', color:'#b76117'}}> -- {row.phone} &nbsp;<b>({moment().diff(row.dob,'years')+' YRS'})</b></span>}</small>
                                
                            </td>
                            <td align="center">{row.program_name}</td>
                            <td align="left"> YEAR { Math.ceil(row.start_semester/2) }</td>
                        </tr>
                          ) : null }
                    </tbody>
              </table>
            </section>

           <br/><br/>
          

        </content>
    </div>
    </div>
    </> 
    )
}

export default PaperAdmitList
