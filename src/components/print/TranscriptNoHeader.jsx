import moment from 'moment'
import React from 'react'
import Logo from '../../assets/img/logo/aucc/logo.png'

function TranscriptNoHeader({ user,fgpa }) {
  return (
  <header className="flex flex-col space-y-10">
      <section className="block print:hidden">
        <div className="space-y-1 print:-space-y-2">
          <h1 className="m-0 p-0 text-[3.5rem] print:text-[2.7rem] text-primary-dark font-roboto font-semibold tracking-widest md:leading-[4rem] text-center">AFRICAN UNIVERSITY </h1>
          <h2 className="m-0 print:-mt-3 p-0 text-[2.1rem] print:text-[1.65rem] text-primary-accent font-bold font-roboto tracking-wider text-center leading-0">OF COMMUNICATIONS AND BUSINESS</h2>
        </div>
        <div className="my-6 mx-auto w-[90%] print:mt-6 print:mb-6 max-w-4xl flex flex-row justify-center">
            <div className="flex-1 space-y-4  print:space-y-2 print:text-xs">
                <div className="flex space-x-5 text-sm print:text-xs">
                    <div className="">
                        <p>TELEPHONE:</p>
                        {/* <p>DIRECT:</p> */}
                        {/* <p>FAX:</p> */}
                    </div>
                    <div className="font-semibold">
                        {/* <p>233-3321-32480-3 Ext. 208/219</p> */}
                        <p>233-3070-16193</p>
                        {/* <p>233-3321-32484</p> */}
                    </div>
                </div>
                <div className="flex space-x-10 text-sm print:text-xs">
                    <div className="">
                        <p>E-MAIL:</p>
                        <p>WEBSITE:</p>
                    </div>
                    <div className="font-medium">
                        <p>info@aucb.edu.gh</p>
                        <p>www.aucb.edu.gh</p>
                    </div>
                </div>
            </div>
            <div className="w-42 print:w-42 flex item-center justify-center">
                <img className="h-24 print:h-[4.5rem]" src={Logo} />
            </div>
            <div className="flex-1 space-y-6 print:space-y-4 print:text-xs">
                <div className="flex justify-center font-semibold text-slate-900 tracking-wider">
                    <p className="print:m-0 print:leading-[17px] text-sm print:text-xs text-left leading-[1.2rem]">Registrar's Office<br/>Postal Box LG 510<br/>Legon, Accra<br/>Ghana.</p>
                </div>
                {/* <div className="flex justify-center">
                    <p className="pl-44 print:pr-0 print:m-0 print:leading-[17px] font-medium text-sm print:text-xs text-right leading-[1.2rem]">{ moment().format("Do MMMM, YYYY")}</p>
                </div> */}
            </div>
        </div>
        <h1 className="text-primary-accent text-2xl print:text-xl text-center font-semibold print:font-bold underline underline-offset-8 tracking-widest">OFFICIAL TRANSCRIPT</h1>
      
      </section>
      <div className="hidden print:block h-40 w-full"></div>

      {/* Main Transcript Content */}
      <section className="mx-auto w-[95%] flex justify-between">
        <div className="title-group2 font-extrabold tracking-widest -space-y-1 print:-space-y-2">
          <div>Name: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b style={{ fontSize:'18px' }}>{user.lname && user.lname.toUpperCase()}, {`${user.fname} ${user.mname || ''}`}</b></div>
          <div>Programme: &nbsp;<b style={{ fontSize:'18px' }}>{user?.program?.shortName?.toUpperCase()}</b></div>
          { user?.major && <div>Major: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b style={{ fontSize:'18px' }}>{ user?.major?.longName  || ' -- NONE --'}</b></div>}
          { user?.category == 'PG' 
            ? <div>CGPA: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b style={{ fontSize:'18px' }}>{!isNaN(fgpa) ? parseFloat(fgpa)?.toFixed(2) : '0.00'}</b></div>
            : <div>FGPA: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b style={{ fontSize:'18px' }}>{!isNaN(fgpa) ? parseFloat(fgpa)?.toFixed(2) : '0.00'}</b></div>
          }
        </div>
        {/* <pre>{JSON.stringify(user,0,null)}</pre> */}
        <div className="title-group2 font-extrabold tracking-widest -space-y-1 print:-space-y-2">
          <div>Student Number: &nbsp;<b style={{ fontSize:'18px' }}>{user?.indexno} </b></div>
          <div>Sex: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b style={{ fontSize:'18px' }}>{user.gender ? user.gender == 'M' ? 'MALE':'FEMALE': ' -- NONE --'} </b></div>
          <div>Date of Award: &nbsp;&nbsp;<b style={{ fontSize:'18px' }}>{ moment(user?.exitDate || new Date()).format('MMMM YYYY').toUpperCase() }</b></div>
          <div>Date Printed: &nbsp;&nbsp;&nbsp;<b style={{ fontSize:'18px' }}>{ moment().format('MMM DD, YYYY').toUpperCase() } </b></div>
        </div>
      </section>
    </header>)
}

export default TranscriptNoHeader