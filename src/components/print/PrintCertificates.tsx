import moment from "moment";
import React, { useRef } from "react";
import { useLoaderData, useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import Logo from '../../assets/img/logo.png'
import Service from "../../utils/aisService";

type Props = {};

export async function loader({ params }) {
  let data = await Service.fetchGraduateSession(params.sessionId);
  let vc = await Service.fetchLetter('vc');
  let reg = await Service.fetchLetter('reg');
  
  return { data,vc,reg };
}

function PrintCertificates({}: Props) {
 
  const location = useLocation();
  const data = location.state?.data;
  const { data:gsdata, vc, reg} :any = useLoaderData();

  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const getAcademicData = ( kdata) => {
    let credit = 0;
    let gradepoint = 0;
    let classObtained;
    const cgpa: any = [];
    const crt: any = [];
    const gpt: any = [];

    kdata && Array.from(kdata)?.map(([_, row]: any, i: number) => {
        // Calculate Total Credit Hours, Total Gradepoint
        credit += row.reduce((sum, cur) => cur.credit + sum, 0);
        gradepoint += row.reduce((sum, cur) => cur.credit * cur.gradepoint + sum,0);
        let gpa = gradepoint / credit;
        // Calculate Class
        classObtained = row[0].classes?.find((r: any) => parseFloat(r.min) <= gpa && gpa <= parseFloat(r.max));
        // Return variables
        cgpa.push(gpa.toFixed(3));
        gpt.push(gradepoint);
        crt.push(credit);
    });
    return { cgpa, gpt, crt, classObtained: classObtained?.class };
  }

  
  return (
    <div ref={printRef} className="print:m-0 print:p-0 relative w-full flex flex-col justify-center items-center bg-white print:scale-[85%]">
      
      <button onClick={handlePrint} className="w-full md:w-fit print:hidden px-6 py-1 flex md:flex-none items-center space-x-2 rounded bg-primary-accent text-white font-bold uppercase">
        <span>Print</span> <span className="flex md:hidden">Broadsheet</span>
      </button>
      
      { data.map((r,i) => {
        const st = r[1][0][1][0];
        const mdata = r[1];
        const { classObtained } = getAcademicData(mdata);
        const programs = st?.program?.toLowerCase()?.split('in');
        const progTitle = programs[0]?.toLowerCase()?.split('of');
        const classes = classObtained.toLowerCase().split('class');
        const classTitle = classes.length > 1 ? `${classes[0].toUpperCase()} CLASS HONOURS ${classes[1]}`: classes[0]?.toUpperCase()
        const certDate = moment(gsdata?.start).format('Do MMMM YYYY');

        return (
          <div key={i} className="my-10 mx-auto px-16 py-10 w-full rounded border shadow-sm shadow-slate-300 print:px-6 print:py-0 print:m-0 print:w-full print:shadow-none print:border-0 print:scale-100 print:break-after-page">
            <main className="my:py-20 print:h-screen flex flex-col justify-between space-y-20">
                 <header className="flex flex-row items-center justify-center space-x-6">
                    <img src={Logo} alt="Institute Logo" className="h-20 print:h-24" />
                    <div>
                        <h1 className="font-black text-5xl print:text-5xl tracking-[0.05rem]">AFRICAN UNIVERSITY</h1>
                        <h3 className="font-bold font-serif text-2xl print:text-2xl tracking-[0.03em] text-primary-dark">OF COMMUNICATIONS AND BUSINESS</h3>
                    </div>
                 </header>
                 <main className="flex flex-col items-center space-y-10">
                     <div className="flex flex-col items-center space-y-10 font-serif text-3xl print:text-4xl italic">
                        <p className="text-primary-dark">This is to certify that</p>
                        <p className="capitalize">{st?.fname?.trim()?.toLowerCase()} {st?.mname ? st?.mname?.trim()?.toLowerCase()+' ':''}{st?.lname?.trim()?.toLowerCase()}</p>
                     </div>
                     <div className="font-serif font-medium text-xl print:text-2xl leading-10 print:leading-relaxed text-center">
                        <p>Having pursued a prescribed course of study,</p>
                        <p>and having passed the requisite examinations this <span className="italic">{certDate}</span></p>
                        <p>has been duly admitted by the University to the Degree of</p>
                     </div>
                     <div className="font-medium text-3xl print:text-3xl leading-10 text-center">
                        <p className="font-serif italic"><span className="capitalize">{progTitle[0]?.trim()?.toLowerCase()}</span> of <span className="capitalize">{progTitle[1]?.trim()?.toLowerCase()}</span></p>
                        <p className="font-serif capitalize">({programs[1]?.trim()?.toLowerCase()})</p>
                     </div>
                     <div>
                       <p className="font-medium text-2xl print:font-bold print:text-2xl text-primary-dark capitalize">{classTitle}</p>
                     </div>
                     <div>
                        <p className="font-serif font-medium text-xl print:font-medium print:text-2xl leading-10 text-center">Given under our authority</p>
                     </div>

                 </main>
                 <footer className="w-full flex flex-col space-y-20">
                    <div className="w-full flex items-center justify-end">
                        <div className="flex flex-col text-center">
                          <span className="text-sm">Student Registration No:</span>
                          <span className="font-bold">{st?.studentId}</span>
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-3"> 
                        <div className="col-span-1 flex flex-col items-left space-y-4">
                          <img src={vc?.signature || ""} alt="VC Signature" className="h-24 w-44 relative -translate-x-[20px]" />
                          <span>Vice-Chancellor</span>
                        </div>
                        <div className="col-span-1 flex flex-col items-center space-y-4">
                          <img src={reg?.signature || ""} alt="Registrar Signature" className="h-24 w-44 relative " />
                          <span>Registrar</span>
                        </div>
                        <div className="col-span-1 items-center">&nbsp;</div>
                        
                    </div>
                 </footer>

            </main>
          </div>
        )
      })}
    </div>
  );
}

export default PrintCertificates;
