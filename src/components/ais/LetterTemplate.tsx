import ReactHtml from "html-react-parser";
import React, { useRef } from 'react';
import { useReactToPrint } from "react-to-print";
import { loadAcademicPlacerData } from '../../utils/util';
// The college letterhead prints with every letter (PrintHeader hides it in
// print, for pre-printed stationery -- still used by receipts/transcripts).
import PrintHeaderAkatsico from '../print/PrintHeaderAucc';

type Props = {
    data: any;
}

function LetterTemplate({ data }: Props) {
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    // Same page setup as admission letters: small top margin so the
    // letterhead sits near the top edge of the page.
    pageStyle: "@page { size: A4; margin: 6mm 15mm 12mm; } @media print { body { -webkit-print-color-adjust: exact; } }",
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
    <div className="p-2 print:p-0 w-full relative md:scale-[85%] print:scale-100" ref={printRef}>
        <button onClick={handlePrint} className="w-full md:w-fit md:absolute md:-top-24 md:-left-20 print:hidden px-6 py-1 flex md:flex-none items-center space-x-2 rounded bg-secondary-accent text-white font-bold uppercase">
          <span>Print</span> <span className="flex md:hidden">Letter</span>
        </button>
        <PrintHeaderAkatsico />
        {/* One text size for the whole letter body (12pt in print); [&_*] resets
            any size set in the template editor. The letterhead keeps its own. */}
        <main className="hidden print:block md:block w-full print:mt-2.5 font-arial-narrow text-[16px] leading-[1.5] print:text-[12pt] print:leading-[1.45] [&_*]:!text-[1em]">
           <section className="mb-10 md:mb-10 flex flex-col space-y-6">
              {/* <h1 className="text-secondary-accent text-2xl print:text-xl text-center font-semibold print:font-bold tracking-widest">{data?.title || 'LETTER SAMPLE'}</h1> */}
              <div className="w-full flex items-start justify-between gap-6">
                <address className="order-2">
                  <p className="text-primary-dark font-semibold not-italic">Reference: {data?.student?.id || '24010001'}</p>
                  <p className="text-primary-dark font-semibold uppercase not-italic">{data?.student?.fname}{data?.student?.mname ? data?.student?.mname+' ':''} {data?.student?.lname || 'Evans Jerry Amissah'}</p>
                </address>
                <section className="flex flex-col space-y-8 print:space-y-6">
                  {data?.tag == 'def' 
                     ? <div className="order-1 font-semibold space-y-0.5">
                          <h2>{data?.student?.fname}{data?.student?.mname ? data?.student?.mname+' ':''} {data?.student?.lname || 'Evans Jerry Amissah'}</h2>
                          <h2>{data?.student?.indexno || '24010001'}</h2>
                          <h2>AKATSICO</h2>
                       </div>
                     : <h2 className="order-1 font-semibold">TO WHOM IT MAY CONCERN</h2>
                  }

                 { data?.tag == 'def' 
                  ? <h3 className="order-1 font-medium">Dear { data.student.gender == 'M' ? 'Sir':'Madam'},</h3>
                  : <h3 className="order-1 font-medium">Dear Sir/Madam,</h3>
                 }
                </section>
              </div>
           </section>
           <section className="print:font-medium [&_h1]:underline-offset-4 [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:font-bold [&_h3]:font-bold [&_.ql-align-center]:text-center [&_.ql-align-right]:text-right [&_.ql-align-justify]:text-justify [&_img]:inline-block">{ ReactHtml(loadAcademicPlacerData(template,dm)) }</section>
        </main>
    </div>
  )
}

export default LetterTemplate