import React, { useRef } from 'react'
import PrintHeader from '../print/PrintHeader'
import { useReactToPrint } from "react-to-print";
import ReactHtml from "html-react-parser";
import { dummyAUCCApplicant, loadPlacerData } from '../../utils/util';

type Props = {
    data: any;
}

function LetterTemplate({ data }: Props) {
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });

  const dm = data?.student ? data : dummyAUCCApplicant;
  const template = data?.student ? data?.category?.admissionLetter[0]?.template : data?.template
  return (
    <div className="p-2 w-full relative md:scale-[85%] print:scale-[85%] print:-mt-14" ref={printRef}>
        <button onClick={handlePrint} className="w-full md:w-fit md:absolute md:-top-40 md:-left-10 print:hidden px-6 py-1 flex md:flex-none items-center space-x-2 rounded bg-primary-accent text-white font-bold uppercase"><span>Print</span> <span className="flex md:hidden">Admission Letter</span></button>
        <PrintHeader />
        <main className="hidden print:block md:block w-full print:text-[0.79rem] print:font-poppins">
           <div className="md:mb-4 space-y-6">
               <h1 className="text-primary-accent text-xl print:text-base font-semibold tracking-widest">OFFER OF ADMISSION</h1>
               <div className="space-y-6 print:space-y-3">
                    <address className="print:text-xs">
                        <p className="text-primary-dark font-semibold uppercase not-italic">REFERENCE: {data?.student?.id || '24010001'}</p>
                        <p className="text-primary-dark font-semibold uppercase not-italic">{data?.student?.fname}{data?.student?.mname && data?.student?.mname+' '} {data?.student?.lname || 'Evans Jerry Amissah'}</p>
                    </address>
                    <p>Dear {data?.student?.fname || 'Evans'},</p>
               </div>
           </div>
           { ReactHtml(loadPlacerData(template,dm)) }
        </main>
    </div>
  )
}

export default LetterTemplate