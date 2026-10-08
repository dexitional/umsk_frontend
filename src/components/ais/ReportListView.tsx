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
  HiOutlineUserGroup,
  HiOutlineGlobeAlt,
  HiOutlineHeart,
  HiOutlineEye,
  HiOutlineSpeakerWave,
  HiOutlineAcademicCap,
  HiOutlineCake,
  HiOutlineInboxArrowDown,
  HiOutlineClipboardDocumentCheck,
  HiOutlineEnvelopeOpen,
  HiOutlineClock,
  HiOutlineBuildingOffice2,
  HiOutlineWrenchScrewdriver,
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
  const sessionOptions = sessions?.map((r: any) => ({ label: r.title, value: r.id }));
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

  // GTEC statutory return -- each table downloads as its own Excel file,
  // laid out exactly like GTEC's sample return. Student/staff tables are
  // for the current academic session.
  const gtec = (table: string, title: string, description: string, Icon: any, fields: any = null) => ({
    type: `gtec_${table}`, title, description, Icon, fields,
    gradient: "from-sky-600 to-blue-700",
    glow: "hover:shadow-sky-500/20",
  });
  const STATUTORY_REPORTS = [
    gtec("t03", "Table 3: Applications", "Applications for admission by gender and programme", HiOutlineInboxArrowDown),
    gtec("t04", "Table 4: Qualified Applicants", "Applications qualified for admission", HiOutlineClipboardDocumentCheck),
    gtec("t05", "Table 5: Admission Offered", "Admissions offered by gender and programme", HiOutlineEnvelopeOpen),
    gtec("t06", "Table 6: New Entrants", "New entrants by gender and programme", HiOutlineUserPlus),
    gtec("t07", "Table 7: Student Enrolment", "Enrolment by year of study and gender", HiOutlineUserGroup),
    gtec("t08", "Table 8: Foreign Students", "Foreign students by nationality and gender", HiOutlineGlobeAlt),
    gtec("t09", "Table 9: Mobility Impairment", "Students with mobility impairment or loss of limbs", HiOutlineHeart),
    gtec("t10", "Table 10: Vision Impairment", "Students with vision impairment", HiOutlineEye),
    gtec("t11", "Table 11: Hearing & Speech Impairment", "Deaf, hard of hearing, speech-impaired or dual-sensory students", HiOutlineSpeakerWave),
    gtec("t12", "Table 12: Full-time Academic Staff", "Teaching staff by department, rank and qualification", HiOutlineAcademicCap),
    gtec("t13", "Table 13: Academic Staff Age", "Full-time teaching staff by department and age group", HiOutlineCake),
    gtec("t14", "Table 14: Part-time Academic Staff", "Part-time teaching staff by department, rank and qualification", HiOutlineClock),
    gtec("t15", "Table 15: Non-teaching Staff (Admin)", "Non-teaching staff in central administration and support units", HiOutlineBuildingOffice2),
    gtec("t16", "Table 16: Non-teaching Staff (Departments)", "Non-teaching staff in teaching departments", HiOutlineWrenchScrewdriver),
    gtec("t17", "Table 17: Graduating Students", "Graduates by programme and class of degree", HiAcademicCap,
      <ReportDropdown label="GRADUATION SESSION" name="gsession" options={gsessionOptions} />),
  ];

  const renderCards = (reports: any[], offset = 0) =>
    reports.map(({ type, title, description, Icon, gradient, glow, fields }, i) => (
      <ReportCard
        key={type}
        index={offset + i}
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
    ));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {renderCards(REPORTS)}
      </div>
      <section className="space-y-4">
        <div>
          <h2 className="text-sm md:text-base font-semibold text-gray-700">GTEC Statutory Returns</h2>
          <p className="text-[0.7rem] md:text-xs text-gray-400">
            Each table exports as its own Excel file in GTEC's format. A "Data notes" sheet lists any records that couldn't be counted.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {renderCards(STATUTORY_REPORTS, REPORTS.length)}
        </div>
      </section>
    </div>
  );
}

export default ReportListView;
