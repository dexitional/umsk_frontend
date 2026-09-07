import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import moment from "moment";
import React, { useRef } from "react";
import { HiUserAdd } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/img/logo/aucc/logo.png";
import { useUserStore } from "../../utils/authService";
const { REACT_APP_API_URL } = import.meta.env;

type Props = {
  data?: any;
};

function AISIDCardAUCC({ data }: Props) {
  const navigate = useNavigate();
  const pdfRef: any = useRef(null);
  const user = useUserStore((state) => state.user);

  const printCard = async () => {
    const pdf = new jsPDF("landscape", "mm", "credit-card");
    setTimeout(async () => {
      const mdata = await html2canvas(pdfRef.current, { scale: 6 });
      const img = mdata.toDataURL("image/jpg");
      const imgProperties = pdf.getImageProperties(img);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
      pdf.addImage(img, "JPEG", 0, 0, pdfWidth, pdfHeight);
      // Photo of User
      const image = new Image();
      image.src = `${REACT_APP_API_URL}/auth/photos/?tag=${data?.id}`;
      pdf.addImage(image, "JPEG", 4, 21, 20.8, 20.8);
      pdf.setProperties({
        title: data?.id,
        subject: "Student ID Card",
        keywords: "Student ID, UMS",
        author: "Praescent Solutions",
        creator: "Ebenezer Kwabena Blay Ackah",
      });
      //pdf.save("test.pdf");
      window.open(URL.createObjectURL(pdf.output("blob")));
    }, 0);
  };

  return (
    <div className="w-full rounded flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-6">
      <section className="px-8 py-6 w-3/5 flex items-center">
        <div
          ref={pdfRef}
          className="w-[85mm] h-[54mm] border-2 scale-125 bg-white"
        >
          <div>
            <div className="px-2 py-1 flex items-center">
              <img src={Logo} className="w-[60px] h-[60px]" />
              <div className="flex-1 flex flex-col -space-y-1 items-center font-roboto">
                <h1 className="m-0 text-black text-xl font-bold font-roboto tracking-wider">
                  AFRICAN UNIVERSITY
                </h1>
                <h2 className="m-0 text-black text-[0.8rem] font-medium font-roboto tracking-widest">
                  OF COMMUNICATIONS AND BUSINESS
                </h2>
                <h2 className="m-0 text-black text-[0.65rem] font-medium tracking-widest">
                  ( AUCB )
                </h2>
              </div>
            </div>
            <div className="mb-10 w-full border-b-4 border-[#b76118] flex">
              <div className="p-1 w-1/3 h-[7.8rem] bg-[#b76118]">
                <div className="w-24 h-24 flex items-center bg-white overflow-hidden">
                  <img
                    crossOrigin="anonymous"
                    src={`${REACT_APP_API_URL}/auth/photos/?tag=${data?.id}`}
                    loading="eager"
                    className="w-20 h-20 object-fit"
                  />
                </div>
                <div className="px-2 py-1 text-[0.6rem] text-[#f1f2f3] bg-gray-700 font-semibold text-center">
                  {[2].includes(data.stype) ? "POSTGRAD" : "UNDERGRAD"}
                </div>
              </div>

              <div className="w-full flex flex-col bg-white font-roboto">
                <div className="w-full font-bold border-b-2 border-b-[#b76118] border-t-2 border-t-[#b76118] bg-[#333] text-[0.65rem] text-white flex items-center justify-center">
                  <span className="bg-black px-2 py-0.5">
                    STAFF IDENTIFICATION CARD
                  </span>
                </div>
                <div className="px-2 w-full flex flex-col space-y-0 text-black text-[0.6rem] font-roboto">
                  <div className="-space-y-2.5">
                    <div className="m-2 font-semibold tracking-wide">
                      {(
                        data?.fname +
                        " " +
                        (data?.mname && data?.mname + " ") +
                        data?.lname
                      ).toUpperCase()}
                    </div>
                    <div className="m-2 font-semibold tracking-wide text-[0.55rem] text-gray-600">
                      {data?.program?.longName?.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex justify-between text-[0.55rem]">
                    <div className="m-2 font-semibold flex flex-col">
                      <span className="font-semibold text-[#b76118] text-[0.5rem]">
                        INDEX NO{" "}
                      </span>
                      <span>{data && data?.indexno}</span>
                    </div>
                    <div className="m-2 font-semibold flex flex-col">
                      <span className="font-semibold text-[#b76118] text-[0.5rem]">
                        STUDENT ID{" "}
                      </span>
                      <span>{data && data?.id}</span>
                    </div>
                    <div className="m-2 font-semibold flex flex-col">
                      <span className="font-semibold text-[#b76118] text-[0.5rem]">
                        SEX
                      </span>
                      <span>{data && data?.gender}</span>
                    </div>
                  </div>
                  <div className="mx-2 mt-2 flex justify-between">
                    <div className="flex flex-col -space-y-0.5">
                      <p className="m-0 font-bold text-[0.5rem] text-[#b76118]">
                        DATE ISSUED
                      </p>
                      <p className="my-1 mx-0 font-bold text-[7px] text-[#333]">
                        {moment(data?.entryDate || new Date())
                          .format("MMMM YYYY")
                          .toUpperCase()}
                      </p>
                    </div>
                    <div className="flex flex-col -space-y-0.5">
                      <p className="m-0 font-bold text-[0.5rem] text-[#b76118]">
                        NATIONALITY
                      </p>
                      <p className="my-1 mx-0 font-bold text-[7px] text-[#333]">
                        {data?.country?.title}
                      </p>
                    </div>
                    <div className="flex flex-col -space-y-0.5">
                      <p className="m-0 font-bold text-[0.5rem] text-[#b76118]">
                        EXPIRES ON
                      </p>
                      <p className="my-1 mx-0 font-bold text-[7px] text-[#333]">
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
        </div>
        {/* <StudentIDCard data={data} ref={pdfRef} /> */}
      </section>
      <section className="flex-1 grid gap-2 md:gap-4">
        {/* Print Account */}
        <button
          onClick={printCard}
          className="p-1.5 md:py-1 md:px-1 h-12 rounded-full flex items-center space-x-4 bg-primary-accent/5 border border-primary-accent/20 shadow"
        >
          <HiUserAdd className="text-primary-accent/60 h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 border-primary-accent/20 rounded-full" />
          <span className="font-semibold text-sm md:text-base text-primary-accent/70 font-noto">
            Print ID Card
          </span>
        </button>
      </section>
    </div>
  );
}

export default AISIDCardAUCC;
