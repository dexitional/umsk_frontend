import React, { useLayoutEffect, useRef } from "react";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { ImPlus } from "react-icons/im";
import { PiListNumbersBold } from "react-icons/pi";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useUserStore } from "../../utils/authService";
import { BsFileExcel } from "react-icons/bs";
import { FaFileExcel, FaUpload } from "react-icons/fa6";
import { excelToJson } from "../../utils/util";
import Service from "../../utils/aisService";
import toast from "react-hot-toast";
import { useHasRole } from "../../utils/roles";

type Props = {
  args?: any;
};

function GraduateActions() {

  const importRef: any = useRef();
  const navigate = useNavigate();
  const canImportGraduates = useHasRole("ais", ["graduation::admin"]);

  const importTrigger = async () => {
    importRef.current.click();
  };
  const importSheet = async (e) => {
    const file = e.target.files[0];
    if (file && (file.type.match("application/vnd.openxmlformats-officedocument.*") || file.type.match("text/csv"))) {
      excelToJson(file, async (data) => {
       await Service.uploadGraduate(data);
       setTimeout(() => navigate(0), 2000);
      });
    } else {
      toast.error(`PLEASE CHOOSE EXCEL ( .XLSX ) FILE ONLY !`);
    }
  };
  
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
     <div className="flex items-center space-x-2 space-y-1 flex-wrap md:flex-nowrap md:space-y-0">

          {canImportGraduates ? (
          <div className="p-1 w-fit rounded border md:border-2 flex items-center justify-between space-x-1">
            <div className="flex items-center space-x-1">
              <button onClick={importTrigger} className={`px-3 bg-blue-50 md:h-8 h-6 rounded border flex items-center justify-center group gap-2`}>
                <FaUpload  className="text-green-600"/>
                <span className="font-semibold text-sm text-primary/60">Upload Graduation Data</span>
              </button>
              <button className={`px-3 bg-green-50 md:h-8 h-6 rounded border flex items-center justify-center group gap-2`}>
                <FaFileExcel  className="text-green-600"/>
                <span className="font-semibold text-sm text-primary/60">Graduation Excel Sample  </span>
              </button>
              <input
                type="file"
                name="import"
                ref={importRef}
                onChange={importSheet}
                style={{ display: "none" }}
              />
            </div>
           {/*
            <button
              className={`${
               true ? "bg-slate-200" : "bg-slate-50"
              } md:h-8 md:w-8 h-6 w-6 rounded border flex items-center justify-center`}
            >
              <PiListNumbersBold className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
            </button> */}

            {/* <button onClick={() => setView('list')} className={`${view == 'list' ? 'bg-slate-200':'bg-slate-50'} md:h-8 md:w-8 h-6 w-6 rounded border flex items-center justify-center`}>
                    <GiHamburgerMenu className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
                </button>
                <button onClick={() => setView('card')} className={`${view == 'card' ? 'bg-slate-200':'bg-slate-50'} md:h-8 md:w-8 h-6 w-6 rounded border flex items-center justify-center`}>
                    <MdDashboard className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
                </button> */}
          </div>
          ) : null}


          {/* <Link
            to={"#"}
            className="py-0 md:py-2 px-3 md:px-4 h-9 md:h-10 rounded-md border bg-primary/90 flex items-center space-x-3"
          >
            <ImPlus className="text-white h-3 w-3 md:h-4 md:w-4" />
            <span className="flex text-white text-sm md:text-base font-medium">
             Test
            </span>
          </Link> */}
      </div> 
    </div>
  );
}

export default GraduateActions;
