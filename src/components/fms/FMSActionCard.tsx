import toast from "react-hot-toast";
import { requestError } from "../../utils/requestError";
import React, { useRef, useState } from "react";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Service from "../../utils/fmsService";
import { useHasRole } from "../../utils/roles";

type Props = {
  data?: any;
};

function FMSActionCard({ data }: Props) {
  const navigate = useNavigate();
  const inFlight = useRef(false);
  const [busy, setBusy] = useState(false);
  const canManageBill = useHasRole("fms", ["bill::admin"]);

  const run = async (action: () => Promise<any>) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    try {
      const response = await action();
      if (response) navigate(0);
      else toast.error('The billing action was not completed. Please try again.');
    } catch (error) {
      toast.error(requestError(error, 'The billing action failed. Please try again.'));
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  };
  const attachStudent = () => {
    const tag = window.prompt('Provide Student ID or index number')?.trim();
    if (tag) return run(() => Service.includeBill(data.id, { action: 'create', tag }));
  };
  const revokeStudent = () => {
    const tag = window.prompt('Provide Student ID or index number')?.trim();
    if (tag) return run(() => Service.includeBill(data.id, { action: 'remove', tag }));
  };
  const publishBill = () => {
    if (window.confirm('Publish this bill to the selected year groups?')) return run(() => Service.activateBill(data.id));
  };
  const revokeBill = () => {
    if (window.confirm('Revoke this bill and remove its student account entries?')) return run(() => Service.revokeBill(data.id));
  };

  if (!canManageBill) {
    return (
      <div className="p-3 border rounded-xl">
        <h1 className="w-full text-center text-gray-400/70 text-[0.65rem] font-semibold tracking-widest uppercase">
          No Actions Available ...
        </h1>
      </div>
    );
  }

  return (
    <div className="w-full rounded flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-6">
      <section className="w-full grid md:grid-cols-3 gap-2 md:gap-4">
        {data.session?.default && data.posted ? (
          <button disabled={busy}
            onClick={revokeBill}
            className="p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-red-200/10 border border-red-500/20 shadow"
          >
            <FaMoneyCheckDollar className="text-red-400/60 h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 border-red-500/40 rounded-full" />
            <span className="font-semibold text-sm md:text-base text-red-700/70 font-noto">
              Revoke Bill
            </span>
          </button>
        ) : null}
        {!data.posted ? (
          <button disabled={busy}
            onClick={publishBill}
            className="p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-green-200/10 border border-green-500/20 shadow"
          >
            <FaMoneyCheckDollar className="text-green-400/60 h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 border-green-500/40 rounded-full" />
            <span className="font-semibold text-sm md:text-base text-green-800/70 font-noto">
              Publish Bill{" "}
            </span>
          </button>
        ) : null}

        <button disabled={busy}
          onClick={revokeStudent}
          className="p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-red-200/10 border border-red-500/20 shadow"
        >
          <FaMoneyCheckDollar className="text-red-400/60 h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 border-red-500/40 rounded-full" />
          <span className="font-semibold text-sm md:text-base text-red-700/70 font-noto">
            Remove From Student
          </span>
        </button>

        <button disabled={busy}
          onClick={attachStudent}
          className="p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-green-200/10 border border-green-500/20 shadow"
        >
          <FaMoneyCheckDollar className="text-green-400/60 h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 border-green-500/40 rounded-full" />
          <span className="font-semibold text-sm md:text-base text-green-800/70 font-noto">
            Attach To Student
          </span>
        </button>
      </section>
    </div>
  );
}

export default FMSActionCard;
