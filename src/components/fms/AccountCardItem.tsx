import moment from "moment";
import React from "react";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { FaPhone } from "react-icons/fa";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { GiMoneyStack } from "react-icons/gi";
import { HiMiniAcademicCap } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/img/logo/aucc/logo.png";
import Service from "../../utils/fmsService";
import Helper from "../../utils/aisService";

const { REACT_APP_API_URL } = import.meta.env;

type Props = {
  data: any;
};

function AccountCardItem({ data }: Props) {
  const navigate = useNavigate();

  const retireAccount = async () => {
    const ok = window.confirm("Retire Student Account Balance ?");
    if (ok) {
      const resp = await Service.retireAccount(data?.id);
      if (resp) return navigate(0);
    }
    return false;
  };

  const getIndex = async () => {
    const ok = window.confirm("Generate Index Number ?");
    if (ok) {
      const resp = await Helper.generateIndex(data?.id);
      if (resp) return navigate(0);
    }
  };

  const fineLate = async () => {
    const ok = window.confirm(`Charge Late Registration Fine for ${data?.id}`);
    if (ok) {
      const resp = await Service.lateCharge({ studentId: data?.id });
      if (resp) return navigate(0);
    }
    return false;
  };

  return (
    <div className="p-4 md:p-6 min-h-max border border-primary/20 rounded-xl bg-slate-50/50 hover:bg-slate-100 space-y-2 md:group">
      <h2 className="text-base md:text-base font-semibold font-noto text-gray-500 uppercase">
        {data?.id}
      </h2>
      <div className="w-full flex items-center justify-between space-x-2">
        <div className="w-full flex items-center justify-between space-x-2">
          <div className="text-sm md:text-sm text-primary-dark/70 font-bold font-roboto capitalize">
            {(
              data?.fname +
              " " +
              (data?.mname ? data?.mname + " " : "") +
              data?.lname
            ).toUpperCase()}
          </div>
          <div className="py-0.5 px-2 text-sm rounded bg-primary/60 text-white font-bold">
            {data?.gender}
          </div>
        </div>
        <img
          crossOrigin="anonymous"
          src={`${REACT_APP_API_URL}/auth/photos/?tag=${data?.id}` || Logo}
          className="p-1 h-12 w-12 border rounded-md bg-white object-contain"
        />
      </div>
      <div className="space-y-1.5 font-roboto">
        <div className="flex items-center space-x-4">
          <HiMiniAcademicCap className="shrink-0 h-5 w-5 text-primary/70" />
          <span
            className={`${
              data.program?.longName ? "text-gray-500" : "text-red-500"
            } text-xs  font-bold capitalize`}
          >
            {data.program?.longName || "Not assigned"}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <FaPhone className="rotate-90 h-4 w-5 text-primary/70" />
          <span className="text-sm text-gray-500">{data?.phone}</span>
        </div>
        <div className="flex items-center space-x-4">
          <AiOutlineFieldNumber className="h-4 w-5 text-primary/70" />
          <span
            className={` ${
              data.indexno
                ? "font-semibold text-gray-500 "
                : "font-medium text-gray-400 "
            } text-xs tracking-wider`}
          >
            {data?.indexno || "INDEX NUMBER NOT GENERATED"}
          </span>
        </div>

        <div className="mt-10 flex items-center space-x-3">
          <GiMoneyStack className="h-6 w-6 text-primary/70" />
          <div
            className={`${
              data?.accountNet > 0 ? "bg-red-50" : "bg-green-50"
            } px-2 py-0.5  rounded border text-sm font-bold text-gray-500`}
          >
            {data?.accountNet > 0 ? "DEBT:" : "BAL:"}{" "}
            {data.entryGroup == "INT" ? "USD" : "GH₵"}{" "}
            {Math.abs(data?.accountNet)}
          </div>
          <Link
            to={`${encodeURIComponent(data?.id)}`}
            className="py-0.5 px-2 rounded flex items-center space-x-1.5 bg-primary/60"
          >
            <FaMoneyBillTransfer className="h-4 w-4 text-amber-200" />
            {/* <span className="text-sm text-white font-semibold">View</span> */}
          </Link>
        </div>
      </div>
      <div className="flex flex-col space-y-1.5">
        <div className="px-3 py-2 opacity-80 md:opacity-100 md:hidden flex rounded-md border bg-blue-50/30 items-center md:justify-between space-x-2 md:group">
          <div className="flex group-hover:hidden items-center justify-center space-x-3 text-center">
            <span
              className={`${
                moment(data?.start_date).format("YYYY") ==
                moment().format("YYYY")
                  ? "bg-green-950/60"
                  : "bg-red-950/60"
              } py-0.5 px-2 rounded flex items-center space-x-1.5 text-sm text-white font-semibold`}
            >
              Level
            </span>
            <span className="font-semibold font-roboto text-base text-primary/60">
              {Math.ceil(data?.semesterNum / 2) * 100}
            </span>
          </div>
        </div>
        <div className="px-3 py-2 opacity-80 md:opacity-100 flex rounded-md border bg-white items-center md:justify-start space-x-2 group">
          <button
            onClick={retireAccount}
            className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-primary/60"
          >
            <span className="text-sm text-white font-semibold">RETIRE</span>
          </button>

          {!data?.indexno ? (
            <button
              onClick={getIndex}
              className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-primary/60"
            >
              <span className="text-sm text-white font-semibold">GET ID</span>
            </button>
          ) : null}

          <button
            onClick={fineLate}
            className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-primary/60"
          >
            <button type="submit" className="text-sm text-white font-semibold">
              FINE LATE
            </button>
          </button>

          <div className="hidden md:flex md:group-hover:hidden items-center justify-center space-x-3 text-center">
            <span
              className={`${
                !data?.completeStatus
                  ? "bg-primary-dark/60"
                  : "bg-primary-accent/60"
              } py-0.5 px-2 rounded flex items-center space-x-1.5 text-sm text-white font-semibold`}
            >
              LEVEL
            </span>
            <span className="font-semibold font-roboto text-base text-primary/60">
              {Math.ceil(data?.semesterNum / 2) * 100 || "COMPLETED"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountCardItem;
