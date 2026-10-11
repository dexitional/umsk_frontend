import React, { useEffect, useRef, useState } from "react";
import { HiCheck } from "react-icons/hi2";

type Props = {
  name: string;
  label: string;
  defaultValue?: string | null;
  // At least one year must be ticked (the browser blocks submit otherwise).
  required?: boolean;
  hint?: string;
};

const YEARS = [1, 2, 3, 4];

// Bill target group codes (mainGroupCode / discountGroupCode) are 4
// characters, one per year: "1010" = Years 1 and 3. This edits the code as
// year checkboxes and submits the same string through a hidden input, so
// the backend (getBillCodePrisma / getSemesterFromCode) is unchanged. With
// nothing ticked it submits "" (no group), unless `required`.
function YearGroupCodeField({ name, label, defaultValue, required, hint }: Props) {
  const [years, setYears] = useState<boolean[]>(() => YEARS.map((_, i) => String(defaultValue || "").charAt(i) === "1"));
  const firstBox = useRef<HTMLInputElement>(null);
  const any = years.some(Boolean);
  const all = years.every(Boolean);
  const code = any ? years.map((y) => (y ? "1" : "0")).join("") : "";

  useEffect(() => {
    firstBox.current?.setCustomValidity(required && !any ? "Select at least one year." : "");
  }, [required, any]);

  const toggle = (i: number) => setYears((ys) => ys.map((y, j) => (j === i ? !y : y)));

  return (
    <fieldset aria-label={label} className="flex flex-col space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm md:text-base text-gray-500 font-medium">
          {label}
          {required ? <span className="text-rose-500"> *</span> : null}
        </span>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-primary-dark/5 px-2 py-0.5 font-mono text-xs text-gray-500" title="Stored target group code">
            CODE: {code || "NONE"}
          </span>
          <button
            type="button"
            onClick={() => setYears(YEARS.map(() => !all))}
            className="rounded-md border border-primary-dark/10 px-2 py-0.5 text-xs font-semibold text-primary/80 hover:bg-primary/5"
          >
            {all ? "Clear all" : "All years"}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {YEARS.map((year, i) => (
          <label key={year} className="relative cursor-pointer">
            <input
              ref={i === 0 ? firstBox : undefined}
              type="checkbox"
              checked={years[i]}
              onChange={() => toggle(i)}
              className="peer sr-only"
              aria-label={`Year ${year}`}
            />
            <span
              className="flex items-center gap-3 rounded-lg border border-primary-dark/10 bg-primary-dark/5 px-3 py-2.5 transition-colors
                peer-checked:border-primary/60 peer-checked:bg-primary/10
                peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40
                hover:border-primary/30"
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                  years[i] ? "border-primary bg-primary text-white" : "border-slate-300 bg-white text-transparent"
                }`}
              >
                <HiCheck className="h-3.5 w-3.5" />
              </span>
              <span className="leading-tight">
                <span className={`block text-sm font-semibold ${years[i] ? "text-primary-dark" : "text-gray-600"}`}>Yr {year}</span>
                <span className="block text-[0.7rem] text-gray-400">L {year}00</span>
              </span>
            </span>
          </label>
        ))}
      </div>
      {hint ? <span className="text-xs text-gray-400">{hint}</span> : null}
      <input type="hidden" name={name} value={code} />
    </fieldset>
  );
}

export default YearGroupCodeField;
