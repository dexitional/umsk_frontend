import ReactHtml from "html-react-parser";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { dummyAUCCApplicant, loadPlacerData } from "../../utils/util";
import PrintHeader from "../print/PrintHeader";

type Props = {
  data: any;
};

function LetterTemplateHead({ data }: Props) {
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const dm = data?.student ? data : dummyAUCCApplicant;
  const template = data?.student ? data?.letter?.template : data?.template;

  // const template = data?.student
  // ? data?.category?.admissionLetter[0]?.template
  // : data?.template;

  // const dm =  data || dummyAUCCApplicant;
  // const template = data?.category?.admissionLetter[0]?.template || data?.template;
  
  return (
    <div
      className="p-2 w-full relative md:scale-[85%] print:scale-[90%] print:-mt-20"
      ref={printRef}
    >
      <button
        onClick={handlePrint}
        className="w-full md:w-fit md:absolute md:-top-40 md:-left-10 print:hidden px-6 py-1 flex md:flex-none items-center space-x-2 rounded bg-primary-accent text-white font-bold uppercase"
      >
        <span>Print</span>{" "}
        <span className="flex md:hidden">Admission Letter</span>
      </button>
      <PrintHeader />
      <main className="hidden print:block md:flex flex-col space-y-2 w-full print:text-xs">
        <div className="md:mb-0 space-y-6 print:-space-y-3">
          <h1 className="text-primary-accent text-2xl print:text-base font-semibold tracking-widest">
            OFFER OF ADMISSION
          </h1>
          <div className="w-full flex justify-between space-y-3 print:space-y-3">
            <address className="text-sm print:text-[0.65rem] text-left order-2">
              <p className="text-primary-dark font-semibold uppercase not-italic">
                REFERENCE: {data?.student?.id || "24010001"}
              </p>
              <p className="text-primary-dark font-semibold uppercase not-italic">
                {data?.student?.fname} {data?.student?.mname ? data?.student?.mname + " " : ""} {data?.student?.lname || "Evans Jerry Amissah"}
              </p>
            </address>
            <div className="text-lg print:text-xs font-medium order-1">
              Dear <span className="capitalize">{data?.student?.fname?.toLowerCase() || "Evans"}</span>,
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col print:font-medium [&]:leading-[20px] print:[&]:leading-[17px] [&]:-space-y-1">
          {ReactHtml(loadPlacerData(template, dm))}
        </div>
      </main>
    </div>
  );
}

export default LetterTemplateHead;
