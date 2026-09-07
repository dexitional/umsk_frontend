import React from "react";
import { useNavigation } from "react-router-dom";
import {
  HiOutlineCreditCard,
  HiOutlineDocumentText,
  HiOutlineCurrencyDollar,
  HiOutlineExclamationTriangle,
  HiOutlineCheckBadge,
  HiOutlineTicket,
} from "react-icons/hi2";
import ReportCard from "./ReportCard";
import ReportDateFilter from "./ReportDateFIlter";
import ReportDropdown from "./ReportDropdown";

type Props = {
  programs: any;
  majors: any;
  sessions: any;
  services: any;
  asessions: any;
};

const YEAR_OPTIONS = [1, 2, 3, 4].map((r) => ({ label: `Year ${r}`, value: r }));
const MODE_OPTIONS = ["M", "E", "W"].map((r) => ({
  label: r == "E" ? "Evening" : r == "W" ? "Weekend" : "Morning",
  value: r,
}));

function ReportListView({ programs, majors, sessions, services, asessions }: Props) {
  const navigation = useNavigation();
  const submittingType = navigation.state !== "idle" ? navigation.formData?.get("type")?.toString() : null;

  const programOptions = programs?.map((r: any) => ({ label: r.shortName, value: r.id }));
  const majorOptions = majors?.map((r: any) => ({ label: `${r.shortName} - ${r.program.shortName}`, value: r.id }));
  const sessionOptions = sessions?.map((r: any) => ({ label: `${r.title} - ${r.tag}`, value: r.id }));
  const serviceOptions = services?.map((r: any) => ({ label: r.title, value: r.id }));
  const asessionOptions = asessions?.map((r: any) => ({ label: r.title, value: r.id }));

  const REPORTS = [
    {
      type: "payments",
      title: "Payments",
      description: "Fee payments received in a date range",
      Icon: HiOutlineCreditCard,
      gradient: "from-blue-500 to-indigo-600",
      glow: "hover:shadow-blue-500/20",
      fields: (
        <>
          <span className="col-span-2">
            <ReportDropdown label="SERVICE" name="service" options={serviceOptions} />
          </span>
          <ReportDateFilter label="START PERIOD" name="start" options={serviceOptions} />
          <ReportDateFilter label="END PERIOD" name="end" options={serviceOptions} />
        </>
      ),
    },
    {
      type: "bills",
      title: "Bills",
      description: "Billing records by program and session",
      Icon: HiOutlineDocumentText,
      gradient: "from-violet-500 to-purple-600",
      glow: "hover:shadow-violet-500/20",
      fields: (
        <>
          <ReportDropdown label="PROGRAM" name="program" options={programOptions} />
          <ReportDropdown label="ACADEMIC SESSION" name="session" options={sessionOptions} />
        </>
      ),
    },
    {
      type: "charges",
      title: "Charges",
      description: "Charges applied in a date range",
      Icon: HiOutlineCurrencyDollar,
      gradient: "from-amber-500 to-orange-600",
      glow: "hover:shadow-amber-500/20",
      fields: (
        <>
          <ReportDateFilter label="START PERIOD" name="start" options={serviceOptions} />
          <ReportDateFilter label="END PERIOD" name="end" options={serviceOptions} />
        </>
      ),
    },
    {
      type: "debtors",
      title: "Debtors",
      description: "Students with outstanding fee balances",
      Icon: HiOutlineExclamationTriangle,
      gradient: "from-rose-500 to-red-600",
      glow: "hover:shadow-rose-500/20",
      fields: (
        <>
          <ReportDropdown label="PROGRAM" name="program" options={programOptions} />
          <ReportDropdown label="MAJOR" name="major" options={majorOptions} />
          <ReportDropdown label="YEAR" name="year" options={YEAR_OPTIONS} />
          <ReportDropdown label="MODE" name="mode" options={MODE_OPTIONS} />
        </>
      ),
    },
    {
      type: "eligible",
      title: "Exams Eligibility",
      description: "Students eligible to sit exams",
      Icon: HiOutlineCheckBadge,
      gradient: "from-teal-500 to-cyan-600",
      glow: "hover:shadow-teal-500/20",
      fields: (
        <>
          <ReportDropdown label="PROGRAM" name="program" options={programOptions} />
          <ReportDropdown label="MAJOR" name="major" options={majorOptions} />
          <ReportDropdown label="YEAR" name="year" options={YEAR_OPTIONS} />
          <ReportDropdown label="MODE" name="mode" options={MODE_OPTIONS} />
        </>
      ),
    },
    {
      type: "voucher",
      title: "Vouchers",
      description: "Vouchers sold for an admission session",
      Icon: HiOutlineTicket,
      gradient: "from-emerald-500 to-green-600",
      glow: "hover:shadow-emerald-500/20",
      fields: (
        <ReportDropdown label="ADMISSION SESSION" name="asession" options={asessionOptions} />
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
      {REPORTS.map(({ type, title, description, Icon, gradient, glow, fields }, i) => (
        <ReportCard
          key={type}
          index={i}
          type={type}
          title={title}
          description={description}
          Icon={Icon}
          gradient={gradient}
          glow={glow}
          isSubmitting={submittingType === type}
        >
          {fields}
        </ReportCard>
      ))}
    </div>
  );
}

export default ReportListView;
