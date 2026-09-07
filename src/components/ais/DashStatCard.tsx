import React from "react";
import { useCountUp } from "../../utils/util";

type Props = {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: number;
  male?: number;
  female?: number;
};

function DashStatCard({ icon, iconBg, label, value, male, female }: Props) {
  const animatedValue = useCountUp(value ?? 0);

  return (
    <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col space-y-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="flex items-start justify-between">
        <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        {(male != null || female != null) && (
          <div className="flex items-center space-x-1.5">
            <span className="px-2 py-0.5 rounded-full bg-primary-accent/10 text-primary-accent text-[0.65rem] font-semibold">
              M&nbsp;{male ?? 0}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary/80 text-[0.65rem] font-semibold">
              F&nbsp;{female ?? 0}
            </span>
          </div>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold font-poppins text-primary tabular-nums">
          {animatedValue.toLocaleString()}
        </div>
        <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {label}
        </div>
      </div>
    </div>
  );
}

export default DashStatCard;
