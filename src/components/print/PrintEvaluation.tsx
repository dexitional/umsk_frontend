import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Logo from "../../assets/img/logo/aucc/logo.png";
import moment from "moment";
import Service from "../../utils/aisService";
import { useLoaderData } from "react-router";
const { REACT_APP_API_URL } = import.meta.env;
type Props = {
  data: any;
};

export async function loader({ params }) {

  const data = await Service.fetchRegistration(params?.studentId);
  return { data };
}


function PrintEvaluation() {
  
  const { data }:any = useLoaderData();
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <div
      className="relative md:scale-[85%] print:scale-[78%] "
      ref={printRef}
    >
      {/* PAGE 1 */}
      <main className="px-16 py-10 md:mx-auto border hidden print:block md:block print:w-full print:text-[0.79rem] print:font-poppins">
        <div className="mt-0 mb-8 space-y-6">
          <h1 className="text-center text-gray-800 underline text-lg print:text-base font-[san-serif] font-semibold uppercase">
             <h2 className="text-3xl">AFRICAN UNIVERSITY</h2> <h3 className="text-lg">OF BUSINESS AND COMMUNICATION</h3>
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
              <h3 className="mx-auto w-3/4 text-center text-xl print:text-base text-red-500 font-semibold">QUALITY ASSURANCE</h3>
              <h3 className="center black d-none text-center text-xl italic text-red-600 font-semibold"> Please ensure the receipt is stamped and provide for exams verification only.</h3>
            <section>
              <table className="ptable">
                <tr>
                  <td colSpan={3}>
                    <h3 className="theading">COURSE EVALUATION RECEIPT</h3>
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
                <tr>
                  <td className="sbody">Courses Evaluated</td>
                  <td className="uppercase w-72">{data?.length}</td>
                  <td className="sbody">Period of Evaluation</td>
                  {/* <td className="shead">{Intl.NumberFormat('en-US',{ 'currency':data.currency, 'currencySign': 'standard', compactDisplay: 'short', }).format(data.amount)}</td> */}
                  <td className="">{data && data[0]?.session?.title}</td>
                </tr>
                <tr>
                  <td className="sbody">Evaluation Date</td>
                  <td className="uppercase">{data && moment(data[0]?.completedAt).format('DD-MMM-YYYY')}</td>
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
                  <td className="">{data && data[0]?.student?.id}</td>
                  <td className="sbody">Index Number</td>
                  <td className="">{data && data[0]?.student?.indexno}</td>
                </tr>
                <tr>
                  <td className="sbody">Student Name</td>
                  <td className="uppercase" colSpan={2}>{data && `${data[0]?.student?.fname} ${data[0]?.student?.mname && data[0]?.student?.mname+' '}${data[0]?.student?.lname}`}</td>
                  <td className="sbody">Year: {data && Math.ceil(data[0]?.student?.semesterNum/2)} </td>
                </tr>
                <tr>
                  <td className="sbody">Programme of Study</td>
                  <td className="uppercase" colSpan={3}>{data && data[0]?.student?.program?.longName}</td>
                </tr>
                <tr>
                  <td colSpan={4}>
                    <hr className="pt-0" />
                    <hr className="pt-0" />
                    <hr className="pt-0" />
                  </td>
                </tr>
                <tr><td colSpan={4}><h4 className="font-sans text-sm font-bold text-red-800 italic decoration-dashed underline-offset-4">COURSES: [ {data.map(r => r.courseId).join(' , ')} ]</h4></td></tr>
                <tr>
                  <td colSpan={4}>
                    <hr className="pt-0" />
                    <hr className="pt-0" />
                    <hr className="pt-0" />
                  </td>
                </tr>
                <tr>
                  <td colSpan={4} className="">I hereby declare that the responses provided in the evaluations are correct and a true reflection of observations made when taking the courses.</td>
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
     
      
    </div>
  );
}

export default PrintEvaluation;
