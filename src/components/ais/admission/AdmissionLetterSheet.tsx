import ReactHtml from "html-react-parser";
import React from "react";
import moment from "moment";
import { capitalise, loadAdmissionPlacerData } from "../../../utils/util";
import PrintHeaderAkatsico from "../../print/PrintHeaderAucc";

type Props = { letter: any; session: any; student: any };

// One printed admission letter: the standard College of Education
// letterhead (Our Ref ADMISSIONS-<year>), the addressee block (name and
// address left; reference, index number and date right), "Dear <First
// name>," and then the template body. Arial Narrow, 12pt in print.
// Each sheet starts on a new page when a batch is printed. If the template
// doesn't place ::signature/::signatory itself, the signature block is
// added at the end.
function AdmissionLetterSheet({ letter, session, student }: Props) {
  const html = loadAdmissionPlacerData(letter?.template, { student, session, letter, bill: student?.bill });
  const placesSignature = /::signature|::signatory/.test(letter?.template || "");
  const fullName = [student?.fname, student?.mname, student?.lname].filter(Boolean).join(" ");

  return (
    <article className="admission-letter mx-auto w-full max-w-[210mm] bg-white p-6 md:p-10 rounded-lg border border-slate-200 shadow-sm print:max-w-none print:p-0 print:rounded-none print:border-0 print:shadow-none [&:not(:last-child)]:break-after-page">
      <PrintHeaderAkatsico ourRef={`ADMISSIONS-${session?.year || ""}`} />
      {/* One text size for the whole letter body (12pt in print); [&_*] resets
          any size set in the template editor. The letterhead keeps its own. */}
      <main className="w-full mt-4 print:mt-2.5 font-arial-narrow text-[16px] leading-[1.5] print:text-[12pt] print:leading-[1.45] [&_*]:!text-[1em]">
        {/* Addressee, reference and salutation (the template starts after these). */}
        <section className="mb-10 print:mb-8 flex flex-col space-y-6">
          <div className="w-full flex items-start justify-between gap-6">
            <address className="order-2 text-right">
              <p className="text-primary-dark font-semibold not-italic">Application Ref: {student?.id}</p>
              {student?.indexno ? <p className="text-primary-dark font-semibold not-italic">Index No: {student.indexno}</p> : null}
              <p className="not-italic">{moment().format("MMMM D, YYYY")}</p>
            </address>
            <section className="flex flex-col space-y-8 print:space-y-6">
              <div className="order-1 font-semibold space-y-0.5 uppercase">
                <h2>
                  {student?.title?.label ? `${student.title.label}. ` : ""}
                  {fullName}
                </h2>
                {student?.address ? <h2 className="whitespace-pre-line">{student.address}</h2> : null}
                {student?.hometown ? <h2>{student.hometown}</h2> : null}
              </div>
              <h3 className="order-1 font-medium">Dear {capitalise(student?.fname?.trim().split(/\s+/)[0]) || "Sir/Madam"},</h3>
            </section>
          </div>
        </section>
        <section className="print:font-medium [&_h1]:underline-offset-4 [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:font-bold [&_h3]:font-bold [&_.ql-align-center]:text-center [&_.ql-align-right]:text-right [&_.ql-align-justify]:text-justify [&_img]:inline-block">
          {ReactHtml(html)}
        </section>
        {!placesSignature ? (
          <footer className="mt-8">
            <p>Yours faithfully,</p>
            {letter?.signature ? <img src={letter.signature} className="my-2 h-14 object-contain" alt="" /> : null}
            <div className="font-semibold">{ReactHtml(letter?.signatory || "")}</div>
          </footer>
        ) : null}
      </main>
    </article>
  );
}

export default AdmissionLetterSheet;
