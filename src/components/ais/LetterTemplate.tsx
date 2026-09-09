import ReactHtml from "html-react-parser";
import React, { useRef } from 'react';
import { useReactToPrint } from "react-to-print";
import { loadAcademicPlacerData } from '../../utils/util';
import PrintHeader from '../print/PrintHeader';

type Props = {
    data: any;
}

function LetterTemplate({ data }: Props) {
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  // const dm = data?.student ? data : dummyAKATSICOApplicant;
  // const template = data?.student ? data?.category?.admissionLetter[0]?.template : data?.template

  const dm = data;
  const template = data?.template;

  console.log("dm: ", dm);
  console.log("template: ", template);

  if(!template) return(<div className="px-4 py-2 text-sm text-primary/60 font-semibold italic">No template defined for this preview</div>)
  if(!dm) return(<div>Data Record Found For</div>)

  return (
    <div className="p-2 w-full relative md:scale-[85%] print:scale-[85%] print:-mt-6" ref={printRef}>
        <button onClick={handlePrint} className="w-full md:w-fit md:absolute md:-top-24 md:-left-20 print:hidden px-6 py-1 flex md:flex-none items-center space-x-2 rounded bg-secondary-accent text-white font-bold uppercase">
          <span>Print</span> <span className="flex md:hidden">Letter</span>
        </button>
        <PrintHeader />
        <main className="hidden print:block md:block w-full text-base print:text-[12pt] font-arial-narrow print:mt-6">
           <section className="mb-10 md:mb-10 flex flex-col space-y-6">
              {/* <h1 className="text-secondary-accent text-2xl print:text-xl text-center font-semibold print:font-bold tracking-widest">{data?.title || 'LETTER SAMPLE'}</h1> */}
              <div className="w-full flex justify-between space-y-6 print:space-y-6">
                <address className="order-2 text-sm print:text-[12pt]">
                  <p className="text-primary-dark font-semibold uppercase not-italic">REFERENCE: {data?.student?.id || '24010001'}</p>
                  <p className="text-primary-dark font-semibold uppercase not-italic">{data?.student?.fname}{data?.student?.mname ? data?.student?.mname+' ':''} {data?.student?.lname || 'Evans Jerry Amissah'}</p>
                </address>
                <section className="flex flex-col space-y-10 text-xl">
                  {data?.tag == 'def' 
                     ? <div className="order-1 font-semibold text-xl space-y-2 print:space-y-1">
                          <h2>{data?.student?.fname}{data?.student?.mname ? data?.student?.mname+' ':''} {data?.student?.lname || 'Evans Jerry Amissah'}</h2>
                          <h2>{data?.student?.indexno || '24010001'}</h2>
                          <h2>AKATSICO</h2>
                       </div>
                     : <h2 className="order-1 font-semibold text-xl">TO WHOM IT MAY CONCERN</h2>
                  }

                 { data?.tag == 'def' 
                  ? <h3 className="order-1 font-medium">Dear { data.student.gender == 'M' ? 'Sir':'Madam'},</h3>
                  : <h3 className="order-1 font-medium">Dear Sir/Madam,</h3>
                 }
                </section>
              </div>
           </section>
           <section className="print:font-medium print:leading-3 [&_p]:font-arial-narrow [&_p]:text-xl print:[&_p]:text-base [&_h1]:underline-offset-4 [&_h1]:font-arial-narrow [&_h1]:font-bold [&_h1]:text-xl [&_h1]:mb-5">{ ReactHtml(loadAcademicPlacerData(template,dm)) }</section>
        </main>
    </div>
  )
}

export default LetterTemplate