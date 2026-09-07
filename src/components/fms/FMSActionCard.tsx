import React, { useRef } from "react";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Service from "../../utils/fmsService";
import { useHasRole } from "../../utils/roles";

type Props = {
  data?: any;
};

function FMSActionCard({ data }: Props) {
  const navigate = useNavigate();
  const fileRef: any = useRef(null);
  const canManageBill = useHasRole("fms", ["bill::admin"]);

  const attachStudent = async () => {
    const inps = window.prompt("Provide Student ID !");
    if (inps) {
      const resp = await Service.includeBill(data?.id, {
        action: "create",
        tag: inps?.trim(),
      });
      if (resp) return navigate(0);
    }
    return false;
  };

  const revokeStudent = async () => {
    const inps = window.prompt("Provide Student ID !");
    if (inps) {
      const resp = await Service.includeBill(data?.id, {
        action: "remove",
        tag: inps?.trim(),
      });
      if (resp) return navigate(0);
    }
    return false;
  };

  const publishBill = async (e) => {
    const ok = window.confirm("Publish Bill ?");
    if (ok) {
      const resp = await Service.activateBill(data?.id);
      if (resp) return navigate(0);
    }
    return false;
  };

  const revokeBill = async (e) => {
    const ok = window.confirm("Revoke or Un-publish Bill ?");
    if (ok) {
      const resp = await Service.revokeBill(data?.id);
      if (resp) return navigate(0);
    }
    return false;
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
        {data.session.default && data.posted ? (
          <button
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
          <button
            onClick={publishBill}
            className="p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-green-200/10 border border-green-500/20 shadow"
          >
            <FaMoneyCheckDollar className="text-green-400/60 h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 border-green-500/40 rounded-full" />
            <span className="font-semibold text-sm md:text-base text-green-800/70 font-noto">
              Publish Bill{" "}
            </span>
          </button>
        ) : null}

        <button
          onClick={revokeStudent}
          className="p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-red-200/10 border border-red-500/20 shadow"
        >
          <FaMoneyCheckDollar className="text-red-400/60 h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 border-red-500/40 rounded-full" />
          <span className="font-semibold text-sm md:text-base text-red-700/70 font-noto">
            Remove From Student
          </span>
        </button>

        <button
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
