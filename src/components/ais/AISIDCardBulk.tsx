import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import moment from "moment";
import React, { useRef } from "react";
import { HiUserAdd } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import Adinkra from "../../assets/img/adinkra-bullet.png";
import Logo from "../../assets/img/logo/aucc/logo.png";
import Back from "../../assets/img/id-back.jpg";
import { useUserStore } from "../../utils/authService";
const { REACT_APP_API_URL } = import.meta.env;

type Props = {
  data?: any;
};

function AISIDCardBulk({ data }: Props) {
  const navigate = useNavigate();
  const pdfRef: any = useRef(null);
  const user = useUserStore((state) => state.user);

  const handlePrint = useReactToPrint({
    content: () => pdfRef.current,
  });

  

  return (
    <div className="w-full rounded flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-6">
      <section className="relative px-8 py-6 md:w-full print-w-full flex items-center">
        <button className="py-1 px-4 absolute -top-16 md:-top-20 left-36 md:left-96 bg-primary text-white font-semibold rounded-full tracking-widest" onClick={handlePrint}>PRINT ID CARDS</button>
        <div ref={pdfRef} className="w-full md:grid md:grid-cols-2 md:gap-x-4 md:gap-y-14">
          { data?.filter(r => r.indexno).map((row:any, i: number) => (
            <>
              {/* Front Cover */}
              <div className={`w-[85mm] h-[54mm] border ${i != 0 && 'break-before-page'} print:border-0 border-b-4 print:border-b-4 border-b-primary-accent md:scale-125 bg-white`}>
                <div className="px-2 py-1 flex items-center">
                  <img src={Logo} className="w-[50px] h-[50px]" />
                  <div className="flex-1 flex flex-col space-y-1 items-center font-roboto">
                    <div className="-space-y-1">
                      <h1 className="m-0 font-black flex flex-col font-noto text-center leading-[0.1rem]">
                        <span className="font-black text-lg tracking-wider">AFRICAN UNIVERSITY</span>
                        <span className="font-semibold text-[0.7rem]">OF COMMUNICATIONS AND BUSINESS</span>
                      </h1>
                    </div>
                  </div>
                </div>
                <div className="mb-10 w-full border-primary-accent flex">
                  <div className="p-2 w-1/3 h-[8.2rem] bg-primary-accent rounded-md">
                    <div className="w-21 h-24 flex justify-center items-center bg-white overflow-hidden rounded-t">
                      <img
                        crossOrigin="anonymous"
                        src={`${REACT_APP_API_URL}/auth/photos/?tag=${row?.id}`}
                        loading="eager"
                        className="w-20 h-20 object-cover rounded-t"
                      />
                    </div>
                    <div className="my-1 px-2 py-1 text-[0.5rem] text-white bg-gray-900 rounded-b font-bold text-center tracking-wide">
                      {[2].includes(row?.stype) ? "POSTGRADUATE" : "UNDERGRADUATE"}
                    </div>
                  </div>

                  <div className="w-full flex flex-col bg-white font-roboto">
                    <div className="-ml-1 w-full font-bold bg-gray-900 rounded-r text-[0.65rem] text-white flex items-center justify-center">
                      <span className="print:px-2 -print:py-2 px-2 py-0.5 tracking-widest">
                        STUDENT IDENTIFICATION CARD
                      </span>
                    </div>
                    <div className="px-2 flex-1 flex flex-col justify-between space-y-0 text-black text-[0.6rem] font-roboto">
                      <div className="w-full space-y-0.5 text-left">
                        <div className="m-2 mb-1 font-black text-[0.65rem] tracking-loose">
                          {(
                            row?.fname +
                            " " +
                            (row?.mname ? row?.mname + " " : "") +
                            row?.lname
                          ).toUpperCase()}
                        </div>
                        <div className="my-1 mx-2 font-semibold tracking-wide leading-3 text-[0.6rem] text-primary-dark ">
                          {row?.program?.shortName?.toUpperCase()} 
                        </div>
                        <div className="m-2 font-semibold text-[0.6rem] tracking-loose">
                          {row && row?.indexno} | <span className="text-gray-600/90">SID: {row && row?.id}</span>
                        </div>
                      </div>

                      <div
                        className={`mt-2 relative flex justify-between text-gray-900 bg-ur('${Logo}')`}
                      >
                        <img
                          src={Adinkra}
                          alt="BG"
                          className="absolute -right-2 -bottom-1 h-28 opacity-20"
                        />
                        <div className="flex flex-col space-y-0">
                          <p className="m-0 font-bold text-[0.5rem]">
                            ISSUE DATE
                          </p>
                          <p className="my-1 mx-0 font-bold text-[0.5rem]">
                            {moment(row?.entryDate || new Date())
                              .format("MMMM YYYY")
                              .toUpperCase()}
                          </p>
                        </div>
                        <div className="flex flex-col space-y-0">
                          <p className="m-0 font-bold text-[0.5rem]">NATIONALITY</p>
                          <p className="my-1 mx-0 font-bold text-[0.5rem]">
                            {row?.country?.nationality?.toUpperCase()}
                          </p>
                        </div>
                        <div className="flex flex-col space-y-0">
                          <p className="m-0 font-bold text-[0.5rem]">
                            EXPIRE DATE
                          </p>
                          <p className="my-1 mx-0 font-bold text-[0.5rem]">
                            OCTOBER{" "}
                            {moment(row?.entryDate || new Date())
                              .add(4, "years")
                              .format("YYYY")
                              .toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Back Cover */}
              <div className="w-[85mm] h-[54mm] break-before-page hidden print:block ">
                <img src={Back} alt="ID Back" className="object-contain"/>
              </div>
            </>
          ))}
         
        </div>
       
      </section>
     
    </div>
  );
}

export default AISIDCardBulk;
