import React,{useState,useEffect,useRef} from 'react'
import '../admission/FormPrint.css'
import Logo from '../../assets/img/logo.png'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { fetchSemesterSlip } from '../../store/utils/ssoApi'
import { useReactToPrint } from 'react-to-print';
import { getTargetGroup } from '../../store/utils/util'
import ReactHtml from 'html-react-parser'

const PaperReceipt = () => {
    const { sso } = useSelector(state=>state)
    const { modal } = sso
    const [ data, setData ] = useState({})
    const printRef = useRef();

    const handlePrint = useReactToPrint({
      content: () => printRef.current,
    });

    const title = (data) => {
       var tt = 'TEST'
       console.log(data.transtype_id);
       if([2,3,4].includes(data && data.transtype_id)){
           console.log(data.transtype_id);
           tt = `PAYMENT OF ${data.transtitle && data.transtitle.toUpperCase()} - ${data.refno}`
       }
      
       return tt;
    }
    

    useEffect(()=>{
      //handlePrint()
      //loadGrades()
      setData({...modal.content.data});
      console.log(modal)
    },[])

	
    return (
    <>
    <div className="row">
        <div className="Box small-12 columns" style={{width:'900px', margin:'0px auto',float:'none',overflow:'hidden'}}>
            <div className="small-12 columns u-pr-0 right">
                <button onClick={handlePrint} className="Button u-floatRight u-mb-2">&nbsp;&nbsp;Print &nbsp;&nbsp;</button>
            </div>
        </div>
     </div>
    <div className="print" ref={printRef}>
    <div className="cover">
       <content>
           {/* PAYMENT RECEIPT */}
           <div style={{marginTop:'40px'}}/>
           <section>
                <h1 className="h1title fore">AFRICAN UNIVERSITY COLLEGE OF COMMUNICATIONS, ACCRA</h1>
                <h3 className="h3title">DIRECTORATE OF FINANCE</h3>
                <h1 className="h2title" style={{fontSize:'25px',marginTop:'10px',paddingTop:'10px'}}>OFFICIAL RECEIPT</h1>
                
                <img src={Logo} style={{height:'90px', width:'90px',position:'relative',top:'-75px',left: '90px', margin:'0px auto -55px'}}/>
                <div className="separator"></div>
                <h4 className="h3title">{title(data)}</h4><hr/>
                <div className="title-cover">
                    <div className="title-group">
                       {data && [2,3,4].includes(data.transtype_id) && <>
                            <span className="h2title text-dark"><b>STUDENT NAME</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data.name && data.name.toUpperCase()} </span><br/>
                            <span className="h2title text-dark"><b>STUDENT REF ID</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data.refno} </span><br/>
                            <span className="h2title text-dark"><b>STUDENT INDEXNO</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data.indexno} </span><br/>
                       </>}

                       {data && ![2,3,4].includes(data.transtype_id) && <>
                            <span className="h2title text-dark"><b>REFERENCE </b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data.name && data.name.toUpperCase()} </span><br/>
                       </>}

                       <span className="h2title"><b>PAYMENT DATE</b><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{moment(data.transdate).format('LL').toUpperCase()}</b></span><br/>
                       <span className="h2title"><b>TRANSACTION ID</b><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data.transtag}</b></span><br/>
                       {data.feetype && ReactHtml(`<span className="h2title"><b>PAYMENT TYPE</b><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${data.feetype == 'NORMAL' ? 'ACTUAL PAYMENT': data.feetype}</b></span><br/>`) }
                    </div>
                </div>
                <hr/>
                <h4 className="h3title fore">PAID AMOUNT : {data.currency} {data.amount}</h4>
                <div className="separator"></div>
            </section>
             
             
            <hr/><br/><br/>

            <section>
                <h1 className="h1title fore">AFRICAN UNIVERSITY COLLEGE OF COMMUNICATIONS, ACCRA</h1>
                <h3 className="h3title">DIRECTORATE OF FINANCE</h3>
                <h1 className="h2title" style={{fontSize:'25px',marginTop:'10px',paddingTop:'10px'}}>OFFICIAL RECEIPT</h1>
                
                <img src={Logo} style={{height:'90px', width:'90px',position:'relative',top:'-75px',left: '90px', margin:'0px auto -55px'}}/>
                <div className="separator"></div>
                <h4 className="h3title">{title(data)}</h4><hr/>
                <div className="title-cover">
                    <div className="title-group">
                       {data && [2,3,4].includes(data.transtype_id) && <>
                            <span className="h2title text-dark"><b>STUDENT NAME</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data.name && data.name.toUpperCase()} </span><br/>
                            <span className="h2title text-dark"><b>STUDENT REF ID</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data.refno} </span><br/>
                            <span className="h2title text-dark"><b>STUDENT INDEXNO</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data.indexno} </span><br/>
                       </>}

                       {data && ![2,3,4].includes(data.transtype_id) && <>
                            <span className="h2title text-dark"><b>REFERENCE </b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data.name && data.name.toUpperCase()} </span><br/>
                       </>}

                       <span className="h2title"><b>PAYMENT DATE</b><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{moment(data.transdate).format('LL').toUpperCase()}</b></span><br/>
                       <span className="h2title"><b>TRANSACTION REF</b><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data.transtag}</b></span><br/>
                       {data.feetype && ReactHtml(`<span className="h2title"><b>PAYMENT TYPE</b><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${data.feetype == 'NORMAL' ? 'ACTUAL PAYMENT': data.feetype}</b></span><br/>`) }
                    </div>
                </div>
                <hr/>
                <h4 className="h3title fore">PAID AMOUNT : {data.currency} {data.amount}</h4>
                <div className="separator"></div>
            </section>

        </content>
    </div>
    </div>
    </> 
    )
}

export default PaperReceipt
