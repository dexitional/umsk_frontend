import React from "react";
// @ts-ignore
import moment from "moment";
import { MdCalendarToday, MdLocalShipping, MdNumbers, MdOutlineDescription, MdOutlinePayments, MdReceiptLong } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import { Link, useLoaderData } from "react-router-dom";
import AISPBioCard from "../../components/aisp/AISPBioCard";
import Logo from "../../assets/img/logo/aucc/logo.png";
import Service from "../../utils/aisService";

type Props = {};

export async function loader({ params }) {
  const data = await Service.fetchTranswift(params.transwiftId);
  return { data };
}

function PgAISPService({}: Props) {
  const { data }: any = useLoaderData();
  const canEdit = !["COMPLETED", "PRINTED"].includes(data.status);
  return (
    <div className="p-4 md:p-0 space-y-6 md:space-y-8">
      <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm relative">
        {canEdit ? (
          <Link
            to={`edit`}
            className="p-2 absolute right-5 top-5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <TbEdit className="h-4 w-4 text-slate-500" />
          </Link>
        ) : null}
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 shrink-0 p-2 border border-slate-100 rounded-xl bg-white">
            <img src={Logo} className="h-full w-full object-contain" />
          </div>
          <div className="flex-1 min-w-0 space-y-1.5">
            <h1 className="text-lg md:text-xl font-bold text-primary truncate">
              {data?.transact?.transtype?.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold capitalize">
                {data?.status}
              </span>
              <span className="text-xs text-slate-400">{data?.studentId}</span>
              <span className="text-xs text-slate-400">
                {data?.student?.fname}{" "}
                {data?.student?.mname ? data?.student?.mname + " " : ""}
                {data?.student?.lname}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-primary">Delivery Details</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <AISPBioCard
            label={data.version == "HARDCOPY" ? "Postal Address" : "Email Address"}
            value={data?.receipient || "Not Provided Yet"}
            Icon={MdLocalShipping}
          />
          <AISPBioCard label="Delivery Mode" value={data?.mode || "Not Set"} Icon={MdLocalShipping} />
          <AISPBioCard label="Document Type" value={data?.version || "Not Set"} Icon={MdOutlineDescription} />
          <AISPBioCard label="Quantity" value={`${data?.quantity ?? "Not Set"}`} Icon={MdNumbers} />
        </div>
      </div>

      <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-primary">Payment Details</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <AISPBioCard label="Transaction ID" value={data?.transact?.transtag || "Not Set"} Icon={MdReceiptLong} />
          <AISPBioCard label="Payment Amount" value={`${data?.transact?.amount ?? "Not Set"}`} Icon={MdOutlinePayments} />
          <AISPBioCard
            label="Payment Date"
            value={
              (data?.transact?.createdAt && moment(data?.transact?.createdAt).format("LL")) ||
              "Not Set"
            }
            Icon={MdCalendarToday}
          />
        </div>
      </div>
    </div>
  );
}

export default PgAISPService;
