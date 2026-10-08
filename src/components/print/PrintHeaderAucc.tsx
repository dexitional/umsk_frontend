import React from 'react'
import Logo from '../../assets/img/logo.webp';

type Props = {
  // "Our Ref" value, e.g. ADMISSIONS-2026/2027 on admission letters.
  ourRef?: string;
  yourRef?: string;
  office?: string;
}

// College letterhead in the standard College of Education layout: the
// college name in bold Courier across the top; the reply note, references
// and office on the left; the crest in the middle; address and contacts on
// the right; a thin rule underneath. Printed with letters and transcripts.
function PrintHeaderAkatsico({ ourRef = "", yourRef = "", office = "OFFICE OF THE PRINCIPAL" }: Props) {
  return (
    <div className="hidden print:block md:block text-black">
      <h1 className="text-center font-courier font-bold uppercase leading-none tracking-[0.03em] text-[2.4rem] print:text-[24pt]">
        Akatsi College of Education
      </h1>
      <div className="mt-4 print:mt-3 grid grid-cols-[1fr_auto_1fr] items-start gap-6 print:gap-4">
        {/* Reply note, references, office */}
        <div className="font-courier font-bold text-[0.86rem] print:text-[9pt] leading-[1.15]">
          <p className="font-sans italic font-bold text-[0.74rem] print:text-[7.5pt] leading-[1.15]">
            In case of reply, the number and date of this<br />
            <span className="underline">letter should be quoted:</span>
          </p>
          <p className="mt-2 print:mt-1.5"><i className="font-semibold">Our Ref:</i> {ourRef}</p>
          <p><i className="font-semibold">Your Ref:</i> {yourRef}</p>
          <p className="mt-6 print:mt-5 uppercase tracking-wide">{office}</p>
        </div>
        {/* Crest */}
        <img className="h-28 print:h-[24mm] object-contain" src={Logo} alt="Akatsi College of Education crest" />
        {/* Address and contacts */}
        <div className="justify-self-end font-courier font-bold text-[0.86rem] print:text-[9pt] leading-[1.15]">
          <p>Akatsi, Volta Region, Ghana</p>
          <p>GPS: VX-0021-0401</p>
          <p className="mt-2 print:mt-1.5"><span className="font-bold">Telephone:</span> +233 25 675 4949</p>
          <p><span className="invisible font-bold">Telephone:</span> +233 24 538 3769</p>
          <p className="mt-2 print:mt-1.5"><span className="font-bold">E-mail:</span> info@akatsico.edu.gh</p>
          <p><span className="font-bold">Website:</span> www.akatsico.edu.gh</p>
        </div>
      </div>
      <hr className="mt-2 print:mt-1.5 border-t border-slate-400" />
    </div>
  )
}

export default PrintHeaderAkatsico
