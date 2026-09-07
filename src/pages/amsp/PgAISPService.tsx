import React from "react";
import SubPageTitle from "../../components/aisp/SubPageTitle";
// @ts-ignore
import moment from "moment";
import { FaRegFilePdf } from "react-icons/fa6";
import { RiUserReceived2Fill } from "react-icons/ri";
import { TbMessage2Check } from "react-icons/tb";
import { useLoaderData } from "react-router-dom";
import Service from "../../utils/hrsService";

type Props = {};

export async function loader({ params }) {
  const data = await Service.fetchService(params.serviceId);
  return { data };
}

function PgAISPService({}: Props) {
  const { data }: any = useLoaderData();
  return (
    <main className="md:pl-10 p-3 md:p-6 space-y-3 md:space-y-10">
      <SubPageTitle title={data?.title} page="Notice" />
      <div className="p-3 md:p-6 border bg-slate-50/50 rounded-xl md:space-y-6 space-y-6 ">
        <section className="relative flex space-x-2 md:space-x-6">
          <div className="hidden md:block p-2 md:p-4 h-16 w-16 md:h-32 md:w-32 border rounded-xl shadow-lg bg-white">
            <TbMessage2Check className="h-14 w-14 md:h-24 md:w-24 text-blue-950/40 " />
          </div>

          <div className="flex-1 flex flex-col space-y-6 md:space-y-5">
            <div className="flex space-x-2">
              <div className="block md:hidden p-2 md:p-4 h-16 w-16 border rounded-xl shadow-lg bg-white">
                <TbMessage2Check className="h-12 w-12 text-blue-950/40" />
              </div>
              <div className="space-y-3">
                <h1 className="text-md md:text-3xl md:tracking-wide leading-5 font-semibold text-blue-950/60">
                  {data?.title}
                </h1>
                <div className="w-full flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2 text-zinc-400 text-lg">
                  <div className="flex items-center space-x-2 md:space-x-4">
                    <span className="tracking-wider text-xs md:text-lg capitalize">
                      {data?.letter_no}
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                    <span className="text-xs md:text-lg capitalize">
                      {moment(data?.created_at).format("MMMM DD, YYYY")}
                    </span>
                    <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-blue-950/70"></div>
                  </div>
                  <div className="px-3 py-0.5 flex items-center space-x-2 border rounded">
                    <RiUserReceived2Fill className="h-5 w-5 text-blue-950/70" />
                    <span className="text-sm md:text-base font-medium text-blue-950/70 capitalize">
                      {data.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-gray-400 md:text-gray-600 text-sm md:text-lg">
              {data?.content}
            </p>
          </div>
        </section>

        {/* <section className="grid md:gap-x-8 md:gap-y-0 gap-y-2">
             <div className="p-2 md:py-4 md:px-4 flex flex-col space-y-3 md:space-y-6 border rounded-md md:rounded-xl bg-white">
               <h1 className="py-0.5 px-2 md:px-3 w-fit text-xs md:text-base font-semibold rounded-md bg-blue-950/60 text-white tracking-widest uppercase -skew-x-6">APPROVALS</h1>
               <div className="md:pl-6 flex items-center justify-center space-x-10">
                  <div className="flex items-center space-x-3 md:space-x-3">
                      <FaPhone className="rotate-90 w-3 h-3 md:h-5 md:w-6 text-blue-950/70" />
                      <span className="text-xs md:text-base text-gray-500">{data?.letter_no}</span>
                  </div>
                  <div className="flex items-center space-x-3 md:space-x-3">
                      <FaEnvelope className="w-3 h-3 md:h-5 md:w-6 text-blue-950/70" />
                      <span className="text-xs md:text-base text-gray-500">{data?.letter_no}</span>
                  </div>
                  <div className="flex items-center space-x-3 md:space-x-3">
                      <FaGlobe className="w-3 h-3 md:h-5 md:w-6 text-blue-950/70" />
                      <span className="text-xs md:text-base text-gray-500 italic">{data?.letter_no}</span>
                  </div>
                </div>
             </div>
         </section> */}

        {data.attachment && (
          <section className="">
            {/* Record */}
            <div className="p-2 md:py-4 md:px-4 flex items-center justify-center border rounded-md md:rounded-xl bg-white">
              <object
                data={data.attachment}
                type={`application/pdf`}
                className="w-full h-40 md:h-[20rem] flex items-center justify-center"
              >
                <p className="text-sm md:text-lg font-medium flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2">
                  <span>Here's a link to</span>{" "}
                  <a
                    className="text-red-400 flex items-center space-x-1"
                    href={data.attachment}
                    target="_blank"
                  >
                    <FaRegFilePdf className="h-6 w-6 text-red-400" />{" "}
                    <span>Download PDF</span>
                  </a>{" "}
                  <span>instead.</span>
                </p>
              </object>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default PgAISPService;
