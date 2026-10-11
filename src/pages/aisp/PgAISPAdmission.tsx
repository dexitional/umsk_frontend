import moment from "moment";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  HiOutlineArrowRight,
  HiOutlineBanknotes,
  HiOutlineBuildingLibrary,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineDocumentCheck,
  HiOutlinePrinter,
  HiOutlineXCircle,
} from "react-icons/hi2";
import { Link, useLoaderData, useRevalidator } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import AdmissionLetterSheet from "../../components/ais/admission/AdmissionLetterSheet";
import AISPPageHeader from "../../components/aisp/AISPPageHeader";
import { feesCleared } from "../../utils/admission";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";

// A fresher's admission offer: status + Accept / Reject while PENDING, the
// fee bill and where to pay it, and the admission letter to read and print.
export async function loader() {
  const user = useUserStore.getState().user;
  try {
    const data = await Service.fetchMyAdmission(user?.user?.tag);
    return { data };
  } catch (error: any) {
    return { error: error?.response?.data?.message || "Your admission details could not be loaded." };
  }
}

const formatMoney = (n: number) => (Number(n) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function StatusCard({ data, onRespond, responding }: { data: any; onRespond: (decision: "ACCEPTED" | "REJECTED") => void; responding: boolean }) {
  const program = data?.students?.[0]?.program?.longName;
  const answeredOn = data?.admissionRespondedAt ? moment(data.admissionRespondedAt).format("MMMM D, YYYY") : "";

  const student = data?.students?.[0];
  if (data?.admissionStatus === "ACCEPTED" && !feesCleared(student)) {
    const currency = student?.bill?.currency === "USD" ? "USD" : "GH¢";
    return (
      <div className="aisp-rise aisp-card p-5 md:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <HiOutlineClock className="h-10 w-10 shrink-0 text-amber-500" />
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-slate-900">Offer accepted · fees outstanding</h2>
          <p className="text-sm text-slate-500">
            You accepted admission into <span className="capitalize">{program?.toLowerCase()}</span>
            {answeredOn ? ` on ${answeredOn}` : ""}. Your outstanding balance is{" "}
            <span className="font-semibold text-slate-700">
              {currency} {formatMoney(student?.accountNet)}
            </span>
            . The full student portal opens once your fees are paid (see payment details below).
          </p>
        </div>
        <Link to="/aisp/fees" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark">
          View fee statement <HiOutlineArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  if (data?.admissionStatus === "ACCEPTED") {
    return (
      <div className="aisp-rise aisp-card p-5 md:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <HiOutlineCheckCircle className="h-10 w-10 shrink-0 text-emerald-500" />
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-slate-900">Offer accepted</h2>
          <p className="text-sm text-slate-500">
            You accepted admission into <span className="capitalize">{program?.toLowerCase()}</span>
            {answeredOn ? ` on ${answeredOn}` : ""}. The full student portal is now open to you.
          </p>
        </div>
        <Link to="/aisp/dash" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark">
          Go to dashboard <HiOutlineArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  if (data?.admissionStatus === "REJECTED") {
    return (
      <div className="aisp-rise aisp-card p-5 md:p-6 flex items-start gap-4">
        <HiOutlineXCircle className="h-10 w-10 shrink-0 text-rose-500" />
        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-900">Offer rejected</h2>
          <p className="text-sm text-slate-500">
            You rejected this admission offer{answeredOn ? ` on ${answeredOn}` : ""}. If this was a mistake, please contact the Registry.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="aisp-rise aisp-card p-5 md:p-6 space-y-4">
      <div className="flex items-start gap-4">
        <HiOutlineClock className="h-10 w-10 shrink-0 text-amber-500" />
        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-900">Congratulations! You have been offered admission</h2>
          <p className="text-sm text-slate-500">
            You have been admitted into <span className="font-semibold capitalize text-slate-700">{program?.toLowerCase()}</span>. Read your
            admission letter below, then accept or reject the offer. The rest of the student portal opens once you accept and pay your fees.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2.5 sm:pl-14">
        <button
          type="button"
          disabled={responding}
          onClick={() => onRespond("ACCEPTED")}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
        >
          <HiOutlineCheckCircle className="h-5 w-5" /> Accept Admission Offer
        </button>
        <button
          type="button"
          disabled={responding}
          onClick={() => onRespond("REJECTED")}
          className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-5 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
        >
          <HiOutlineXCircle className="h-5 w-5" /> Reject Admission Offer
        </button>
      </div>
    </div>
  );
}

function FeesCard({ bill }: { bill: any }) {
  const bank = bill?.bankacc;
  const currency = bill?.currency === "USD" ? "USD" : "GH¢";
  const payable = (Number(bill?.amount) || 0) - (Number(bill?.discount) || 0);
  return (
    <div className="aisp-rise aisp-card p-5 md:p-6 space-y-4" style={{ animationDelay: "60ms" }}>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <HiOutlineBanknotes className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-900">Fees &amp; payment</h2>
          <p className="text-xs text-slate-400">Your current fees and where to pay them</p>
        </div>
      </div>
      {bill ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4 space-y-1">
            <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-slate-400">{bill.narrative || "Fees"}</span>
            <span className="block text-2xl font-extrabold tracking-tight text-slate-900">
              {currency} {formatMoney(payable)}
            </span>
            {bill.discount ? (
              <span className="block text-xs text-slate-500">
                {currency} {formatMoney(bill.amount)} less {currency} {formatMoney(bill.discount)} discount
              </span>
            ) : null}
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 space-y-1 text-sm">
            <span className="flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-slate-400">
              <HiOutlineBuildingLibrary className="h-4 w-4" /> Pay into
            </span>
            {bank ? (
              <>
                <span className="block font-bold text-slate-900">{bank.bankName}</span>
                <span className="block text-slate-600">Account name: {bank.accountName}</span>
                <span className="block text-slate-600">Account number: <span className="font-semibold text-slate-900">{bank.bankAccount}</span></span>
                {bank.bankBranch ? <span className="block text-slate-600">Branch: {bank.bankBranch}</span> : null}
              </>
            ) : (
              <span className="block text-slate-500">Payment details are in your admission letter. Contact the Accounts office if you need help.</span>
            )}
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-500">Your fees have not been published yet. Check back later or contact the Accounts office.</p>
      )}
      <Link to="/aisp/fees" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
        View full fee statement <HiOutlineArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function PgAISPAdmission() {
  const { data, error }: any = useLoaderData();
  const user = useUserStore((state) => state.user);
  const revalidator = useRevalidator();
  const [responding, setResponding] = useState(false);
  const printRef = useRef(null);
  const student = data?.students?.[0];
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Admission Letter ${student?.id || ""}`,
    pageStyle: "@page { size: A4; margin: 6mm 15mm 12mm; } @media print { body { -webkit-print-color-adjust: exact; } }",
  });

  const respond = async (decision: "ACCEPTED" | "REJECTED") => {
    const question =
      decision === "ACCEPTED"
        ? "Accept this admission offer?"
        : "Reject this admission offer? You will not be able to change this yourself afterwards.";
    if (!window.confirm(question)) return;
    setResponding(true);
    try {
      await Service.respondAdmission(user?.user?.tag, decision);
      toast.success(decision === "ACCEPTED" ? "Admission offer accepted. Welcome!" : "Admission offer rejected.");
      // Re-runs the portal's root loader too, which lifts the gate on accept.
      revalidator.revalidate();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Your response was not saved. Please try again.");
    } finally {
      setResponding(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <AISPPageHeader
        photo="gate"
        eyebrow="Admission"
        title="Admission Offer"
        subtitle="Your admission letter, fees and your response to the offer."
        Icon={HiOutlineDocumentCheck}
      />

      {error ? (
        <p className="aisp-card px-5 py-8 text-center text-sm text-slate-500">{error}</p>
      ) : (
        <>
          <StatusCard data={data} onRespond={respond} responding={responding} />
          <FeesCard bill={student?.bill} />

          <section className="space-y-4">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Admission Letter</h2>
                <p className="text-xs text-slate-400 mt-0.5">Print or save a copy for your records</p>
              </div>
              {data?.letter ? (
                <button type="button" onClick={handlePrint} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark">
                  <HiOutlinePrinter className="h-4 w-4" /> Print letter
                </button>
              ) : null}
            </div>
            {data?.letter ? (
              <div ref={printRef} className="overflow-x-auto">
                <AdmissionLetterSheet letter={data.letter} session={data.session} student={student} />
              </div>
            ) : (
              <p className="aisp-card px-5 py-8 text-center text-sm text-slate-500">
                Your admission letter is not available yet. Please check back later or contact the Registry.
              </p>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default PgAISPAdmission;
