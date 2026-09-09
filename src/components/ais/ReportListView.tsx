import React from "react";
import { useNavigation } from "react-router-dom";
import {
  HiOutlineUserPlus,
  HiOutlinePauseCircle,
  HiOutlineBanknotes,
  HiOutlineIdentification,
  HiOutlineCheckBadge,
  HiOutlineArrowPath,
  HiAcademicCap,
  HiOutlineTableCells,
  HiOutlineBriefcase,
} from "react-icons/hi2";
import ReportCard from "./ReportCard";
import ReportDropdown from "./ReportDropdown";

type Props = {
  programs: any;
  majors: any;
  sessions: any;
  rsessions: any;
  gsessions: any;
};

const YEAR_OPTIONS = [1, 2, 3, 4].map((r) => ({ label: `Year ${r}`, value: r }));
const MODE_OPTIONS = ["M", "E", "W"].map((r) => ({
  label: r == "E" ? "Evening" : r == "W" ? "Weekend" : "Morning",
  value: r,
}));
const STAFF_CATEGORY_OPTIONS = [
  { label: "All Staff", value: "" },
  { label: "Academic Staff", value: "ACADEMIC" },
  { label: "Non-Academic Staff", value: "NON_ACADEMIC" },
];

function ReportListView({ programs, majors, sessions, rsessions, gsessions }: Props) {
  const navigation = useNavigation();
  const submittingType = navigation.state !== "idle" ? navigation.formData?.get("type")?.toString() : null;

  const programOptions = programs?.map((r: any) => ({ label: r.shortName, value: r.id }));
  const majorOptions = majors?.map((r: any) => ({ label: `${r.shortName} - ${r.program.shortName}`, value: r.id }));
  const sessionOptions = sessions?.map((r: any) => ({ label: `${r.title} - ${r.tag}`, value: r.id }));
  const rsessionOptions = rsessions?.map((r: any) => ({ label: r.title, value: r.id }));
  const gsessionOptions = gsessions?.map((r: any) => ({ label: r.title, value: r.id }));

  const REPORTS = [
    {
      type: "student_registration",
      title: "Student Registrations",
      description: "Students registered this academic session",
      Icon: HiOutlineUserPlus,
      gradient: "from-blue-500 to-indigo-600",
      glow: "hover:shadow-blue-500/20",
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
      type: "student_deferment",
      title: "Student Deferments",
      description: "Students who deferred their studies",
      Icon: HiOutlinePauseCircle,
      gradient: "from-amber-500 to-yellow-600",
      glow: "hover:shadow-amber-500/20",
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
      type: "student_debtor",
      title: "Student Debtors",
      description: "Students with outstanding fee balances",
      Icon: HiOutlineBanknotes,
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
      type: "student_profile",
      title: "Student Profiles",
      description: "Full biodata for enrolled students",
      Icon: HiOutlineIdentification,
      gradient: "from-indigo-500 to-violet-600",
      glow: "hover:shadow-indigo-500/20",
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
      type: "exam_eligible",
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
      type: "resit",
      title: "Resitting Students",
      description: "Students registered for a resit session",
      Icon: HiOutlineArrowPath,
      gradient: "from-secondary-accent-500 to-amber-600",
      glow: "hover:shadow-secondary-accent-500/20",
      fields: (
        <>
          <ReportDropdown label="ACADEMIC SESSION" name="session" options={sessionOptions} />
          <ReportDropdown label="RESIT SESSION" name="rsession" options={rsessionOptions} />
        </>
      ),
    },
    {
      type: "graduate_list",
      title: "Graduating Students",
      description: "Students cleared to graduate",
      Icon: HiAcademicCap,
      gradient: "from-emerald-500 to-green-600",
      glow: "hover:shadow-emerald-500/20",
      fields: (
        <ReportDropdown label="GRADUATION SESSION" name="gsession" options={gsessionOptions} />
      ),
    },
    {
      type: "graduate_sheet",
      title: "Graduating Broadsheet",
      description: "Consolidated results sheet for graduation",
      Icon: HiOutlineTableCells,
      gradient: "from-violet-500 to-purple-600",
      glow: "hover:shadow-violet-500/20",
      fields: (
        <ReportDropdown label="PROGRAM" name="program" options={programOptions} />
      ),
    },
    {
      type: "staff",
      title: "University Staff",
      description: "Staff directory by category",
      Icon: HiOutlineBriefcase,
      gradient: "from-slate-500 to-gray-600",
      glow: "hover:shadow-slate-500/20",
      fields: (
        <ReportDropdown label="CATEGORY" name="category" options={STAFF_CATEGORY_OPTIONS} />
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
