import React, { useRef } from "react";
import { GoPasskeyFill } from "react-icons/go";
import { IoLockClosedSharp } from "react-icons/io5";
import { MdAssignmentAdd, MdPublish, MdUnpublished } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Service from "../../utils/aisService";
import { useHasRole } from "../../utils/roles";

type Props = {
  data?: any;
  isUser: boolean;
};

function AISResitActionCard({ data, isUser }: Props) {
  const navigate = useNavigate();
  const fileRef: any = useRef<HTMLInputElement>();
  const canCloseOrPublish = useHasRole("ais", ["resit::admin"]);
  const canSubmit = useHasRole("ais", ["resit::admin", "resit::assessor"]);
  const canAssign = useHasRole("ais", ["resit::admin", "resit::clerk"]);

  const assignSheet = async () => {
    const inp = window.prompt("Provide Staff ID of Assessor!");
    if (inp && inp != "") {
      const resp = await Service.assignSheet(data?.id, inp);
    }
  };

  const publishSheet = async () => {
    const ok = window.confirm("Publish Assessment Scores ?");
    if (ok) {
      await Service.publishSheet(data?.id);
      navigate(0);
    }
  };

  const unpublishSheet = async () => {
    const ok = window.confirm("Unpublish Assessment Scores ?");
    if (ok) {
      await Service.unpublishSheet(data?.id);
      navigate(0);
    }
  };

  const closeSheet = async () => {
    const ok = window.confirm("Close & Finalize Assessment Scores ?");
    if (ok) {
      await Service.closeSheet(data?.id);
      navigate(0);
    }
  };

  const submitSheet = async () => {
    const ok = window.confirm("Submit Assessment Scores ?");
    if (ok) {
      await Service.submitSheet(data?.id);
      navigate(0);
    }
  };

  return (
    <div className="w-full rounded flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-6">
      <section
        className={`w-full grid  gap-2 md:gap-4 ${
          data.finalized ? "md:grid-cols-1" : "md:grid-cols-4"
        }`}
      >
        {/* Publish Sheet  - Admin only, Disable futher editting */}
        {canCloseOrPublish &&
        !data?.finalized &&
        data?.certified ? (
          <button
            onClick={closeSheet}
            className="p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-primary/5 border border-primary/20 shadow"
          >
            <IoLockClosedSharp className="text-primary/60 h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 border-primary/20 rounded-full" />
            <span className="font-semibold text-sm md:text-base text-primary/70 font-noto">
              Close Sheet
            </span>
          </button>
        ) : null}

        {/* Publish Sheet - Dean only, Publish All results except Late Registrations */}
        {canCloseOrPublish &&
        !data?.finalized &&
        !data?.certified &&
        data?.assessed ? (
          <button
            onClick={publishSheet}
            className="p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-green-600/5 border border-green-600/20 shadow"
          >
            <MdPublish className="text-green-600/60 h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 border-green-600/20 rounded-full" />
            <span className="font-semibold text-sm md:text-base text-green-700/50 font-noto">
              Publish Sheet
            </span>
          </button>
        ) : null}

        {/* UnPublish Sheet - Admin only, UnPublish All results for corrections */}
        {canCloseOrPublish &&
        !data?.finalized &&
        data?.certified ? (
          <button
            onClick={unpublishSheet}
            className="p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-red-400/5 border border-red-400/20 shadow"
          >
            <MdUnpublished className="text-red-400/60 h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 border-red-400/20 rounded-full" />
            <span className="font-semibold text-sm md:text-base text-red-400/70 font-noto">
              Unpublish Sheet
            </span>
          </button>
        ) : null}

        {/* Submit Sheet - Assessor only, SUbmit All results For further publishing */}
        {canSubmit &&
        !data?.finalized &&
        !data?.assessed ? (
          <button
            onClick={submitSheet}
            className="p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-primary/5 border border-primary/20 shadow"
          >
            <GoPasskeyFill className="text-primary/60 h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 border-primary/20 rounded-full" />
            <span className="font-semibold text-sm md:text-base text-primary/70 font-noto">
              Submit Sheet
            </span>
          </button>
        ) : null}

        {/* Assign Sheet - HOD, Admin only - Assign Sheet to Staff */}
        {canAssign &&
        !data?.finalized &&
        !data?.assessed ? (
          <button
            onClick={assignSheet}
            className="p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-primary/5 border border-primary/20 shadow"
          >
            <MdAssignmentAdd className="text-primary/60 h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 border-primary/20 rounded-full" />
            <span className="font-semibold text-sm md:text-base text-primary/70 font-noto">
              Assign Sheet
            </span>
          </button>
        ) : null}

        {data?.finalized ? (
          <div className="px-3 py-1 w-fit rounded border text-sm font-medium text-gray-400 tracking-wider bg-slate-50">
            Sheet is published and closed! No futher editting is allowed.
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default AISResitActionCard;
