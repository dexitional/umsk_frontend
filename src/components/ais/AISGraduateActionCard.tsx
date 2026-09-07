import React, { useRef, useState } from "react";
import { BsFileExcel, BsPeople } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Service from "../../utils/aisService";
import { FaFileExcel } from "react-icons/fa6";
import { excelToJson } from "../../utils/util";
import toast from "react-hot-toast";
import { useHasRole } from "../../utils/roles";
import { TbLoader } from "react-icons/tb";

type Props = {
  data?: any;
  isUser: boolean;
};

function AISGraduateActionCard({ data, isUser }: Props) {
  const navigate = useNavigate();
  const canPublish = useHasRole("ais", ["graduation::admin", "graduation::clerk"]);
  const [generating, setGenerating] = useState(false);

  const importRef: any = useRef();
  
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

  const generateList = async () => {
    const ok = window.confirm("Generate New Graduation List?");
    if (!ok) return;
    setGenerating(true);
    try {
      await Service.generateGraduates(data?.id);
      toast.success("Graduation list generated successfully.");
      setTimeout(() => navigate(0), 2000);
    } catch (error) {
      toast.error("Failed to generate graduation list. Please try again.");
      setGenerating(false);
    }
  };

  const importSupplement = async (e) => {
    const file = e.target.files[0];
    if (file && (file.type.match("application/vnd.openxmlformats-officedocument.*") || file.type.match("text/csv"))) {
      excelToJson(file, async (data) => {
       await Service.uploadGraduateSupplement(data);
       setTimeout(() => navigate(0), 2000);
      });
    } else {
      toast.error(`PLEASE CHOOSE EXCEL ( .XLSX ) FILE ONLY !`);
    }
  };

  return (
    <div className="w-full rounded flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-6">
      <section
        className={`w-full grid  gap-2 md:gap-4 ${
          data.finalized ? "md:grid-cols-1" : "md:grid-cols-2"
        }`}
      >
        {/* Publish Sheet  - Admin only, Disable futher editting */}
        {canPublish ? (
          <>

            <input
              type="file"
              name="import"
              ref={importRef}
              onChange={importSupplement}
              style={{ display: "none" }}
            />

            <button
              onClick={generateList}
              disabled={generating}
              className="p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-primary/5 border border-primary/20 shadow disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {generating ? (
                <TbLoader className="animate-spin text-primary/60 h-8 w-8 md:h-10 md:w-10 p-1 md:p-1 bg-white border-2 md:border-4 border-primary/20 rounded-full" />
              ) : (
                <BsPeople className="text-primary/60 h-8 w-8 md:h-10 md:w-10 p-1 md:p-1 bg-white border-2 md:border-4 border-primary/20 rounded-full" />
              )}
              <span className="font-semibold text-sm md:text-base text-primary/70 font-noto">
                {generating ? (
                  <span className="flex items-center space-x-2">
                    <span className="animate-pulse">Generating...</span>
                  </span>
                ) : (
                  "Generate Graduation List"
                )}
              </span>
            </button>

          {/* <button
            onClick={generateList}
            className="p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-primary/5 border border-primary/20 shadow"
          >
            <BsPeople className="text-primary/60 h-8 w-8 md:h-10 md:w-10 p-1 md:p-1 bg-white border-2 md:border-4 border-primary/20 rounded-full" />
            <span className="font-semibold text-sm md:text-base text-primary/70 font-noto">
              Generate Certificate Numbers
            </span>
          </button> */}

          {/* <button
            onClick={generateList}
            className="p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-primary/5 border border-primary/20 shadow"
          >
            <BsPeople className="text-primary/60 h-8 w-8 md:h-10 md:w-10 p-1 md:p-1 bg-white border-2 md:border-4 border-primary/20 rounded-full" />
            <span className="font-semibold text-sm md:text-base text-primary/70 font-noto">
              Graduand Broadsheet
            </span>
          </button> */}

          {/* <button
            onClick={generateList}
            className="p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-primary/5 border border-primary/20 shadow"
          >
            <BsPeople className="text-primary/60 h-8 w-8 md:h-10 md:w-10 p-1 md:p-1 bg-white border-2 md:border-4 border-primary/20 rounded-full" />
            <span className="font-semibold text-sm md:text-base text-primary/70 font-noto">
              Import Graduates ( Legacy Data )
            </span>
          </button> */}

            <button
              onClick={importTrigger}
              className="p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-primary/5 border border-primary/20 shadow"
            >
              <FaFileExcel className="text-primary/60 h-8 w-8 md:h-10 md:w-10 p-1 md:p-1 bg-white border-2 md:border-4 border-primary/20 rounded-full" />
              <span className="font-semibold text-sm md:text-base text-primary/70 font-noto">Import Supplementary List</span>
            </button>

          </>
        ) : null}
      </section>
    </div>
  );
}

export default AISGraduateActionCard;
