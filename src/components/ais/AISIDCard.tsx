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

function AISIDCard({ data }: Props) {
  const navigate = useNavigate();
  const pdfRef: any = useRef(null);
  const user = useUserStore((state) => state.user);

  const printCard = async () => {
    const pdf = new jsPDF("landscape", "mm", "credit-card");
    setTimeout(async () => {
      const mdata = await html2canvas(pdfRef.current, { scale: 2 });
      const img = mdata.toDataURL("image/jpg");
      const imgProperties = pdf.getImageProperties(img);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
      pdf.addImage(img, "JPEG", 0, 0, pdfWidth, pdfHeight);
      // Photo of User
      const image = new Image();
      image.src = `${REACT_APP_API_URL}/auth/photos/?tag=${data?.id}`;
      pdf.addImage(image, "JPEG", 4, 18.2, 20.8, 24.8);
      pdf.setProperties({
        title:
          data?.fname +
          " " +
          (data?.mname ? data?.mname + " " : "") +
          data?.lname,
        subject: "Student ID Card",
        keywords: "Student ID, UMS",
        author: "AUCB",
        creator: "AUCB",
      });
      //pdf.save("test.pdf");
      window.open(URL.createObjectURL(pdf.output("blob")));
    }, 0);
  };

  const handlePrint = useReactToPrint({
    content: () => pdfRef.current,
  });

  return (
    <div className="w-full rounded flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-6">
      <section className="px-8 py-6 md:w-3/5 print-w-full flex items-center">
        <div
          ref={pdfRef}
          className="w-[85mm] h-[54mm] border print:border-0 border-b-4 print:border-b-4 border-b-primary-accent md:scale-125 bg-white"
        >
          <div>
            <div className="px-2 py-1 flex items-center">
              <img src={Logo} className="w-[50px] h-[50px]" />
              <div className="flex-1 flex flex-col space-y-1 items-center font-roboto">
                <div className="-space-y-1">
                  <h1 className="m-0 font-black text-sm font-arial text-center leading-4">
                    AFRICAN UNIVERSITY OF <br />
                    COMMUNICATIONS AND BUSINESS
                  </h1>
                </div>
              </div>
            </div>
            <div className="mb-10 w-full border-primary-accent flex">
              <div className="p-2 w-1/3 h-[8.2rem] bg-primary-accent">
                <div className="w-21 h-24 flex justify-center items-center bg-white overflow-hidden rounded">
                  <img
                    crossOrigin="anonymous"
                    src={`${REACT_APP_API_URL}/auth/photos/?tag=${data?.id}`}
                    loading="eager"
                    className="w-20 h-20 object-cover rounded"
                  />
                </div>
                <div className="my-1 px-2 py-1 text-[0.5rem] text-white bg-gray-900 font-semibold text-center">
                  {[2].includes(data.stype) ? "POSTGRADUATE" : "UNDERGRADUATE"}
                </div>
              </div>

              <div className="w-full flex flex-col bg-white font-roboto">
                <div className="w-full font-medium bg-gray-900 text-[0.65rem] text-white flex items-center justify-center">
                  <span className="print:px-2 -print:py-2 px-2 py-0.5 tracking-wider">
                    STUDENT IDENTIFICATION CARD
                  </span>
                </div>
                <div className="px-2 flex-1 flex flex-col justify-between space-y-0 text-black text-[0.6rem] font-roboto">
                  <div className="w-full space-y-0.5 text-center">
                    <div className="m-2 mb-1 font-semibold text-xs tracking-loose">
                      {(
                        data?.fname +
                        " " +
                        (data?.mname ? data?.mname + " " : "") +
                        data?.lname
                      ).toUpperCase()}
                    </div>
                    <div className="my-1 mx-2 font-medium tracking-wide leading-3 text-[0.6rem] text-gray-600">
                      {data?.program?.shortName?.toUpperCase()}
                    </div>
                    <div className="m-2 font-semibold text-xs tracking-loose">
                      {data && data?.indexno}
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
                        DATE OF ISSUE
                      </p>
                      <p className="my-1 mx-0 font-bold text-[0.5rem]">
                        {moment(data?.entryDate || new Date())
                          .format("MMMM YYYY")
                          .toUpperCase()}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-0">
                      <p className="m-0 font-bold text-[0.5rem]">NATIONALITY</p>
                      <p className="my-1 mx-0 font-bold text-[0.5rem]">
                        {data?.country?.nationality?.toUpperCase()}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-0">
                      <p className="m-0 font-bold text-[0.5rem]">
                        DATE OF EXPIRE
                      </p>
                      <p className="my-1 mx-0 font-bold text-[0.5rem]">
                        OCTOBER{" "}
                        {moment(data?.entryDate || new Date())
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
          <div className="w-[85mm] h-[54mm] break-before-page hidden print:block ">
             <img src={Back} alt="ID Back" className="object-contain"/>
          </div>
        </div>
        {/* <StudentIDCard data={data} ref={pdfRef} /> */}
      </section>
      <section className="flex-1 flex flex-col space-y-2">
        {/* Print Account */}
        {/* <button onClick={printCard} className="p-1.5 md:py-1 md:px-1 h-12 rounded-full flex items-center space-x-4 bg-primary-accent/5 border border-primary-accent/20 shadow">
            <HiUserAdd className="text-primary-accent/60 h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 border-primary-accent/20 rounded-full" />
            <span className="font-semibold text-sm md:text-base text-primary-accent/70 font-noto">Print ID Card - PDF</span>
          </button> */}
        <button
          onClick={handlePrint}
          className="p-1.5 md:py-1 md:px-1 h-12 rounded-full flex items-center space-x-4 bg-primary-accent/5 border border-primary-accent/20 shadow"
        >
          <HiUserAdd className="text-primary-accent/60 h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 border-primary-accent/20 rounded-full" />
          <span className="font-semibold text-sm md:text-base text-primary-accent/70 font-noto">
            Print ID Card - HTML
          </span>
        </button>
      </section>
    </div>
  );
}

export default AISIDCard;
