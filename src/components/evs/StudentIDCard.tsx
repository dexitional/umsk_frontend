import React,{ forwardRef } from 'react'
import Logo from '../../assets/img/logo.png'
import moment from 'moment';
const API_URL = import.meta.env.REACT_APP_API_URL;

const StudentIDCard = forwardRef(({data}:any,ref: any) => {
  return (
    <div ref={ref} style={{ width:'85mm',height:'54mm',border:'1px solid #eee', borderTop:'6px solid #f93' }}>
        <div style={{ padding:'7px 10px',display:'flex', flexDirection:'row' }}>
            <div>
                <img src={Logo} style={{ width:'60px',height:'60px'}} />
            </div>
            <div style={{ flex:'1',display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',textAlign:'center',lineHeight:'10px', gap:'-5px'}}>
                <h1 style={{ margin:'0', color:'black',font:'bolder 18px arial'}}>AFRICAN UNIVERSITY </h1>
                <h2 style={{ margin:'0', color:'black', font:'normal 13px arial' }}>COLLEGE OF COMMUNICATIONS</h2>
                <h2 style={{ margin:'0', color:'black', font:'bold 10px arial' }}>( AUCC )</h2>
            </div>
        </div>
        <div style={{ marginBottom:'10px',borderBottom:'6px solid #b76118',display:'flex'}}>
            <div style={{ padding:'2px',width:'34%', height:'118px', background:'#b76118' }}>
                <div style={{ display:'flex', alignItems:'normal', justifyContent:'center', background:'#fff', overflow:'hidden'}}>
                  <img loading="eager" src={`${API_URL}/photos/?tag=${data.refno}` || Logo} style={{ width:'100px', height:'100px', objectPosition:'50% 50%', objectFit:'contain' }} />
                </div>
                <div style={{ padding:'3px', margin:'2px 4px', width:'100px',textAlign:'center',letterSpacing:'0.1em',font:'bolder 10px arial', background:'rgba(0,0,0,0.4)', color:'#f1f2f3'}}>{ [2].includes(data.stype) ? 'POSTGRAD':'UNDERGRAD' }</div>
            </div>
            <div style={{ width:'100%', display:'flex',flexDirection:'column', background:'#fff'}}>
                <div style={{ padding:'4px', width: '100%', font:'bolder 10px arial', color: '#fff', textAlign:'center', letterSpacing:'0.1em', borderTop:'2px solid #b76118', borderBottom:'2px solid #b76118', background:'#333' }}>
                   <span>STUDENT IDENTIFICATION CARD</span>
                </div>
                <div style={{ flex:'1', padding:'0px 5px', display:'flex', flexDirection:'column', gap:'-2px' }}>
                    <div style={{ margin:'5px 3px', font:'bold 10px tahoma', color:'#000'}}>{ data && data.name && data.name.toUpperCase() }</div>
                    <div style={{ margin:'3px 3px', font:'bold 10px tahoma'}}>{ data && data.program_name && data.program_name.toUpperCase() }</div>
                    <div style={{ display:'flex', flexDirection:"row", justifyContent:"space-between", textAlign:'left' }}>
                      <div style={{ margin:'3px 4px', font:'bold 9px tahoma', color:'#000'}}><span style={{ font:'bold 9px arial',color:'#b76118'}}>INDEX NO </span><br/>{ data && data.indexno }</div>
                      <div style={{ margin:'3px 6px', font:'bold 9px tahoma', color:'#000'}}><span style={{ font:'bold 9px arial',color:'#b76118'}}>STUDENT ID </span><br/>{ data && data.refno }</div>
                      <div style={{ margin:'3px 4px', font:'bold 9px tahoma', color:'#000', textAlign:'center' }}><span style={{ font:'bold 9px arial',color:'#b76118'}}>SEX</span><br/>{ data && data.gender }</div>
                      
                    </div>
                    <div style={{ margin:'5px 5px 0px', display:'flex', justifyContent:'space-between'}}>
                        <div style={{ display:'flex', flexDirection:'column',}}>
                          <p style={{ margin:'0',font:'bold 8px arial'}}>DATE ISSUED</p>
                          <p style={{ margin:'2px 0',font:'bolder 7px arial', color:'#333'}}>{ moment(data && data.doa || new Date()).format('MMMM YYYY').toUpperCase()}</p>
                        </div>
                        <div style={{ display:'flex', flexDirection:'column',}}>
                          <p style={{ margin:'0',font:'bold 8px arial'}}>NATIONALITY</p>
                          <p style={{ margin:'2px 0',font:'bolder 7px arial', color:'#333'}}>{ data && data.nationality }</p>
                        </div>
                        <div style={{ display:'flex', flexDirection:'column',}}>
                          <p style={{ margin:'0',font:'bold 8px arial'}}>EXPIRES ON</p>
                          <p style={{ margin:'2px 0',font:'bolder 7px arial', color:'#333'}}>OCTOBER { moment(data && data.doa || new Date()).add(4,'years').format('YYYY').toUpperCase()}</p>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </div>
  )
});

export default StudentIDCard