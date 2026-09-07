import React from "react";
import { formatCurrency, useCountUp } from "../../utils/util";

type Props = {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: number;
  currency?: boolean;
};

function DashStatCard({ icon, iconBg, label, value, currency }: Props) {
  const animatedValue = useCountUp(value ?? 0);

  return (
    <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col space-y-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${iconBg}`}>
        {icon}
      </div>
      <div>
        <div className="text-sm md:text-xl font-bold font-poppins text-primary tabular-nums">
          {currency ? formatCurrency(animatedValue, "en-GH", "GHS") : animatedValue.toLocaleString()}
        </div>
        <div className="text-[0.65rem] md:text-xs font-medium text-slate-400 uppercase tracking-wider">
          {label}
        </div>
      </div>
    </div>
  );
}

export default DashStatCard;
