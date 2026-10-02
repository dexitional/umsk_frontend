import React from "react";
import { IconType } from "react-icons";
import { HiOutlineArrowTrendingDown, HiOutlineArrowTrendingUp, HiOutlineBanknotes, HiOutlineScale } from "react-icons/hi2";
import { useLoaderData } from "react-router-dom";
import AISPPageHeader from "../../components/aisp/AISPPageHeader";
import FeeListView from "../../components/aisp/FeeListView";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";

type Props = {};

export async function loader() {
  const user = useUserStore.getState().user;
  const data = await Service.fetchStudentFinance(user?.user?.tag);
  return { data };
}

const formatMoney = (n: number) =>
  Math.abs(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function SummaryTile({ label, value, caption, Icon, tint, delay }: { label: string; value: string; caption: string; Icon: IconType; tint: string; delay: number }) {
  return (
    <div className="aisp-rise aisp-card p-5 flex items-start gap-4" style={{ animationDelay: `${delay}ms` }}>
      <div className={`h-11 w-11 shrink-0 rounded-2xl bg-gradient-to-br text-white flex items-center justify-center shadow-lg ${tint}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</span>
        <span className="block mt-1 text-xl font-extrabold tracking-tight text-slate-900 truncate">{value}</span>
        <span className="block mt-0.5 text-xs text-slate-400">{caption}</span>
      </div>
    </div>
  );
}

function PgAISPFees({}: Props) {
  const { data }: any = useLoaderData();
  const rows = Array.isArray(data) ? data : [];
  const currency = rows[0]?.currency || "";
  const net = rows.reduce((sum: number, cur: any) => cur.amount + sum, 0);
  const charges = rows.filter((r: any) => r.amount > 0).reduce((sum: number, r: any) => sum + r.amount, 0);
  const payments = rows.filter((r: any) => r.amount < 0).reduce((sum: number, r: any) => sum + Math.abs(r.amount), 0);
  const inDebt = net > 0;

  return (
    <div className="space-y-6 md:space-y-8">
      <AISPPageHeader photo="gate"
        eyebrow="Finance"
        title="Fees & Charges"
        subtitle="Your complete financial statement — bills, payments and running balance."
        Icon={HiOutlineBanknotes}
      />

      <div className="grid sm:grid-cols-3 gap-4">
        {/* Balance — the headline figure */}
        <div
          className={`aisp-rise relative overflow-hidden rounded-3xl p-5 text-white shadow-xl bg-gradient-to-br ${
            inDebt ? "from-rose-500 via-rose-600 to-pink-700 shadow-rose-500/25" : "from-emerald-500 via-teal-600 to-sky-700 shadow-emerald-500/25"
          }`}
        >
          <div className="pointer-events-none absolute inset-0 aisp-grid opacity-60" />
          <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
          <div className="relative flex items-start gap-4">
            <div className="h-11 w-11 shrink-0 rounded-2xl bg-white/[0.15] ring-1 ring-inset ring-white/25 flex items-center justify-center">
              <HiOutlineScale className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-white/75">
                {inDebt ? "Outstanding Balance" : "Account Balance"}
              </span>
              <span className="block mt-1 text-2xl font-extrabold tracking-tight truncate">
                {currency} {formatMoney(net)}
              </span>
              <span className="block mt-0.5 text-xs text-white/75">
                {inDebt ? "Amount owed to the institution" : net < 0 ? "You are in credit" : "Fully settled"}
              </span>
            </div>
          </div>
        </div>
        <SummaryTile
          label="Total Charges"
          value={`${currency} ${formatMoney(charges)}`}
          caption="Bills & charges posted"
          Icon={HiOutlineArrowTrendingUp}
          tint="from-indigo-400 to-violet-600 shadow-indigo-500/30"
          delay={60}
        />
        <SummaryTile
          label="Total Paid"
          value={`${currency} ${formatMoney(payments)}`}
          caption="Payments received"
          Icon={HiOutlineArrowTrendingDown}
          tint="from-sky-400 to-blue-600 shadow-sky-500/30"
          delay={120}
        />
      </div>

      <FeeListView data={rows} />
    </div>
  );
}

export default PgAISPFees;
