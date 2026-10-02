import React from "react";
// @ts-ignore
import moment from "moment";
import {
  HiCheck,
  HiOutlineArrowLeft,
  HiOutlineBanknotes,
  HiOutlineCalendarDays,
  HiOutlineDocumentDuplicate,
  HiOutlineDocumentText,
  HiOutlineEnvelope,
  HiOutlineHashtag,
  HiOutlinePencilSquare,
  HiOutlineReceiptPercent,
  HiOutlineTruck,
} from "react-icons/hi2";
import { Link, useLoaderData } from "react-router-dom";
import AISPInfoTile from "../../components/aisp/AISPInfoTile";
import AISPPanel from "../../components/aisp/AISPPanel";
import { AISPPhotoBlend } from "../../components/aisp/AISPPhotoBlend";
import Service from "../../utils/aisService";

type Props = {};

export async function loader({ params }) {
  const data = await Service.fetchTranswift(params.transwiftId);
  return { data };
}

function PgAISPService({}: Props) {
  const { data }: any = useLoaderData();
  const canEdit = !["COMPLETED", "PRINTED"].includes(data.status);
  // Progress through the request's lifecycle, for the tracker.
  const steps = [
    { label: "Payment received", done: true },
    { label: "Delivery details", done: !!data?.receipient },
    { label: "Printed", done: ["PRINTED", "COMPLETED"].includes(data?.status) },
    { label: "Completed", done: data?.status == "COMPLETED" },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <Link to="/aisp/services" className="aisp-rise inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
        <HiOutlineArrowLeft className="h-4 w-4" />
        All requests
      </Link>

      <section className="aisp-rise aisp-card overflow-hidden">
        <div className="relative p-6 md:p-8 bg-gradient-to-br from-secondary via-primary to-sky-700 text-white overflow-hidden">
          <AISPPhotoBlend photo="lab" className="opacity-[0.45]" />
          <div className="pointer-events-none absolute inset-0 aisp-grid opacity-70" />
          <div className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-sky-400/30 blur-3xl" />
          <div className="relative flex flex-col md:flex-row md:items-center gap-5">
            <div className="h-14 w-14 shrink-0 rounded-2xl bg-white/[0.15] ring-1 ring-inset ring-white/25 flex items-center justify-center">
              <HiOutlineDocumentText className="h-7 w-7" />
            </div>
            <div className="flex-1 min-w-0 space-y-1.5">
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">{data?.transact?.transtype?.title}</h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-sky-100/80">
                <span className="px-2.5 py-0.5 rounded-full bg-white/[0.15] text-white text-xs font-bold capitalize">{data?.status?.toLowerCase()}</span>
                <span>{data?.studentId}</span>
                <span className="capitalize">
                  {[data?.student?.fname, data?.student?.mname, data?.student?.lname].filter(Boolean).join(" ").toLowerCase()}
                </span>
              </div>
            </div>
            {canEdit ? (
              <Link to="edit" className="aisp-btn-light w-full md:w-auto">
                <HiOutlinePencilSquare className="h-4 w-4" />
                Update Delivery
              </Link>
            ) : null}
          </div>
        </div>

        {/* Tracker */}
        <ol className="px-6 md:px-8 py-6 grid grid-cols-4 gap-2">
          {steps.map((step, i) => (
            <li key={step.label} className="relative flex flex-col items-center text-center gap-2">
              {i > 0 ? (
                <span className={`absolute top-4 right-1/2 w-full h-0.5 ${step.done ? "bg-emerald-400" : "bg-slate-200"}`} />
              ) : null}
              <span
                className={`relative h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white ${
                  step.done ? "bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-md shadow-emerald-500/30" : "bg-slate-100 text-slate-400"
                }`}
              >
                {step.done ? <HiCheck className="h-4 w-4" /> : i + 1}
              </span>
              <span className={`text-[0.7rem] md:text-xs font-semibold ${step.done ? "text-slate-800" : "text-slate-400"}`}>{step.label}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-start">
        <AISPPanel title="Delivery Details" subtitle="Where your document is going" Icon={HiOutlineTruck}>
          <div className="grid sm:grid-cols-2 gap-3">
            <AISPInfoTile
              label={data.version == "HARDCOPY" ? "Postal Address" : "Email Address"}
              value={data?.receipient || "Not Provided Yet"}
              Icon={HiOutlineEnvelope}
              className="sm:col-span-2"
            />
            <AISPInfoTile label="Delivery Mode" value={data?.mode} Icon={HiOutlineTruck} />
            <AISPInfoTile label="Document Type" value={data?.version} Icon={HiOutlineDocumentDuplicate} />
            <AISPInfoTile label="Quantity" value={`${data?.quantity ?? "Not Set"}`} Icon={HiOutlineHashtag} />
          </div>
        </AISPPanel>

        <AISPPanel title="Payment Details" subtitle="Transaction that created this request" Icon={HiOutlineBanknotes}>
          <div className="grid sm:grid-cols-2 gap-3">
            <AISPInfoTile label="Transaction ID" value={data?.transact?.transtag} Icon={HiOutlineReceiptPercent} className="sm:col-span-2" />
            <AISPInfoTile label="Payment Amount" value={`${data?.transact?.amount ?? "Not Set"}`} Icon={HiOutlineBanknotes} />
            <AISPInfoTile
              label="Payment Date"
              value={data?.transact?.createdAt && moment(data?.transact?.createdAt).format("LL")}
              Icon={HiOutlineCalendarDays}
            />
          </div>
        </AISPPanel>
      </div>
    </div>
  );
}

export default PgAISPService;
