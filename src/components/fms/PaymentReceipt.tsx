import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Logo from "../../assets/img/logo/aucc/logo.png";
import PrintHeader from "../print/PrintHeader";
import moment from "moment";

type Props = {
  data: any;
};

function PaymentReceipt({ data }: Props) {
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <div
      className="relative md:scale-[85%] print:scale-[78%] md:-mt-14 print:-mt-20"
      ref={printRef}
    >
      <button
        onClick={handlePrint}
        className="w-full md:w-fit md:absolute md:-top-[1rem] md:-left-10 print:hidden px-6 py-1 flex md:flex-none items-center justify-center space-x-2 rounded bg-primary-accent text-white font-bold uppercase"
      >
        <span>Print</span>{" "}
        <span className="flex md:hidden">Official Receipt</span>
      </button>
       {/* PAGE 1 */}
      <main className="px-16 py-10 border hidden print:block md:block w-full print:text-[0.79rem] print:font-poppins">
        <div className="mt-0 mb-8 space-y-6">
          <h1 className="text-center text-gray-800 underline text-lg print:text-base font-[san-serif] font-semibold uppercase">
             <h2 className="text-2xl">AFRICAN UNIVERSITY COLLEGE</h2> <h3 className="text-lg">OF BUSINESS AND COMMUNICATIONS</h3>
          </h1>
         </div>
        {/* { ReactHtml(loadPlacerData(data?.template,dm)) } */}
        <div className="print:text-xs">
          <div
            className="fade-bg"
            style={{
              background: ` center top / 400px 400px no-repeat url(${Logo})`,
              minHeight: '45vh'
            }}
          ></div>
          <main className="w-full space-y-1 print:space-y-1">
              <h3 className="mx-auto w-3/4 text-center text-xl print:text-base text-red-500 font-semibold">
                FINANCE OFFICE
              </h3>
              <h3 className="center black d-none text-center text-xl text-red-600 font-semibold"> Please ensure the receipt is stamped and keep for reference.</h3>
            <section>
              <table className="ptable">
                <tr>
                  <td colSpan={3}>
                    <h3 className="theading"> OFFICIAL RECEIPT</h3>
                  </td>
                  <td>&nbsp;</td>
                </tr>
                <tr>
                  <td colSpan={4}>
                    <hr className="pt-0" />
                    <hr className="pt-0" />
                    <hr className="pt-0" />
                  </td>
                </tr>
               
                <tr><td colSpan={4}><h4 className="font-sans text-base font-bold text-red-800 italic underline decoration-dashed underline-offset-4">{data.transtype?.title}</h4></td></tr>
                <tr>
                  <td className="sbody">Payment Reference</td>
                  <td className="uppercase w-72">{data.transtag}</td>
                  <td className="sbody">Payment Amount</td>
                  {/* <td className="shead">{Intl.NumberFormat('en-US',{ 'currency':data.currency, 'currencySign': 'standard', compactDisplay: 'short', }).format(data.amount)}</td> */}
                  <td className="font-semibold">{data.currency} {data.amount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="sbody">Payment Date</td>
                  <td className="uppercase">{moment(data.createdAt).format('MMM-DD-YYYY')}</td>
                  <td className="sbody">Issued By</td>
                  <td className="">FINANCE DEPT.</td>
                </tr>
                <tr>
                  <td colSpan={4}>
                    <hr className="pt-4" />
                  </td>
                </tr>
                <tr>
                  <td className="sbody">Student ID</td>
                  <td className="">{data.studentId}</td>
                  <td className="sbody">Index Number</td>
                  <td className="">{data.student?.indexno}</td>
                </tr>
                <tr>
                  <td className="sbody">Student Name</td>
                  <td className="uppercase" colSpan={2}>{data.student?.fname} {data.student?.mname && data.student?.mname+ ' '}{data.student?.lname}</td>
                  <td className="sbody">Year</td>
                </tr>
                <tr>
                  <td className="sbody">Programme of Study</td>
                  <td className="uppercase" colSpan={2}>{data.student.program?.shortName.toLowerCase()}</td>
                  <td className="">{Math.ceil(data.student?.semesterNum/2)}</td>
                </tr>
                <tr>
                  <td colSpan={4}>
                    <hr className="pt-0" />
                    <hr className="pt-0" />
                    <hr className="pt-0" />
                  </td>
                </tr>
                <tr>
                  <td className="sbody">Amount Outstanding</td>
                  <td className="">{data.student.accountNet > 0 ? (!isNaN(Math.abs(data.accountNet)) ? Math.abs(data.accountNet).toFixed(2): '0.00'): '0.00'}</td>
                </tr>
                <tr>
                  <td colSpan={4}>
                    <hr className="pt-0" />
                    <hr className="pt-0" />
                    <hr className="pt-0" />
                  </td>
                </tr>
              </table>
            </section>
          </main>
        </div>
      </main>
      <hr className="my-4 border-b border-dashed border-gray-400" />
      {/* PAGE 2 */}
      <main className="px-16 py-10 border hidden print:block md:block w-full print:text-[0.79rem] print:font-poppins">
        <div className="mt-0 mb-8 space-y-6">
          <h1 className="text-center text-gray-800 underline text-lg print:text-base font-[san-serif] font-semibold uppercase">
             <h2 className="text-2xl">AFRICAN UNIVERSITY COLLEGE</h2> <h3 className="text-lg">OF BUSINESS AND COMMUNICATIONS</h3>
          </h1>
         </div>
        {/* { ReactHtml(loadPlacerData(data?.template,dm)) } */}
        <div className="print:text-xs">
          <div
            className="fade-bg"
            style={{
              background: ` center top / 400px 400px no-repeat url(${Logo})`,
              minHeight: '45vh'
            }}
          ></div>
          <main className="w-full space-y-1 print:space-y-1">
              <h3 className="mx-auto w-3/4 text-center text-xl print:text-base text-red-500 font-semibold">
                FINANCE OFFICE
              </h3>
              <h3 className="center black d-none text-center text-xl text-red-600 font-semibold"> Please ensure the receipt is stamped and keep for reference.</h3>
            <section>
              <table className="ptable">
                <tr>
                  <td colSpan={3}>
                    <h3 className="theading"> OFFICIAL RECEIPT</h3>
                  </td>
                  <td>&nbsp;</td>
                </tr>
                <tr>
                  <td colSpan={4}>
                    <hr className="pt-0" />
                    <hr className="pt-0" />
                    <hr className="pt-0" />
                  </td>
                </tr>
               
                <tr><td colSpan={4}><h4 className="font-sans text-base font-bold text-red-800 italic underline decoration-dashed underline-offset-4">{data.transtype?.title}</h4></td></tr>
                <tr>
                  <td className="sbody">Payment Reference</td>
                  <td className="uppercase w-72">{data.transtag}</td>
                  <td className="sbody">Payment Amount</td>
                  {/* <td className="shead">{Intl.NumberFormat('en-US',{ 'currency':data.currency, 'currencySign': 'standard', compactDisplay: 'short', }).format(data.amount)}</td> */}
                  <td className="font-semibold">{data.currency} {data.amount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="sbody">Payment Date</td>
                  <td className="uppercase">{moment(data.createdAt).format('MMM-DD-YYYY')}</td>
                  <td className="sbody">Issued By</td>
                  <td className="">FINANCE DEPT.</td>
                </tr>
                <tr>
                  <td colSpan={4}>
                    <hr className="pt-4" />
                  </td>
                </tr>
                <tr>
                  <td className="sbody">Student ID</td>
                  <td className="">{data.studentId}</td>
                  <td className="sbody">Index Number</td>
                  <td className="">{data.student?.indexno}</td>
                </tr>
                <tr>
                  <td className="sbody">Student Name</td>
                  <td className="uppercase" colSpan={2}>{data.student?.fname} {data.student?.mname && data.student?.mname+ ' '}{data.student?.lname}</td>
                  <td className="sbody">Year</td>
                </tr>
                <tr>
                  <td className="sbody">Programme of Study</td>
                  <td className="uppercase" colSpan={2}>{data.student.program?.shortName.toLowerCase()}</td>
                  <td className="">{Math.ceil(data.student?.semesterNum/2)}</td>
                </tr>
                <tr>
                  <td colSpan={4}>
                    <hr className="pt-0" />
                    <hr className="pt-0" />
                    <hr className="pt-0" />
                  </td>
                </tr>
                <tr>
                  <td className="sbody">Amount Outstanding</td>
                  <td className="">{data.student.accountNet > 0 ? (!isNaN(Math.abs(data.accountNet)) ? Math.abs(data.accountNet).toFixed(2): '0.00'): '0.00'}</td>
                </tr>
                <tr>
                  <td colSpan={4}>
                    <hr className="pt-0" />
                    <hr className="pt-0" />
                    <hr className="pt-0" />
                  </td>
                </tr>
               
              </table>
            </section>
          </main>
        </div>
      </main>
      
    </div>
  );
}

export default PaymentReceipt;
