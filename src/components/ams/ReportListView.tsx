import React from 'react'
import { HiUsers, HiOutlineClipboardDocumentCheck, HiAcademicCap } from "react-icons/hi2";
import { useNavigation } from 'react-router-dom';
import ReportCard from './ReportCard';
import ReportDropdown from './ReportDropdown';

type Props = {
  sessions: any;
  programs: any;
}

const REPORTS = [
  {
    type: 'applicants',
    title: 'Applicants Report',
    description: 'Everyone who has applied this admission cycle',
    Icon: HiUsers,
    gradient: 'from-sky-500 to-blue-600',
    glow: 'hover:shadow-sky-500/20',
  },
  {
    type: 'shortlisted',
    title: 'Shortlisted Report',
    description: 'Applicants moved forward for admission',
    Icon: HiOutlineClipboardDocumentCheck,
    gradient: 'from-amber-500 to-orange-600',
    glow: 'hover:shadow-orange-500/20',
  },
  {
    type: 'matriculants',
    title: 'Admitted Students Report',
    description: 'Applicants fully admitted and ready to be matriculated',
    Icon: HiAcademicCap,
    gradient: 'from-emerald-500 to-green-600',
    glow: 'hover:shadow-emerald-500/20',
  },
] as const;

function ReportListView({ sessions, programs }: Props) {
  const navigation = useNavigation();
  const submittingType = navigation.state !== 'idle' ? navigation.formData?.get('type')?.toString() : null;

  const sessionOptions = sessions?.map((r: any) => ({ label: r.title, value: r.id }));
  const programOptions = programs?.map((r: any) => ({ label: r.shortName, value: r.id }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
      {REPORTS.map(({ type, title, description, Icon, gradient, glow }, i) => (
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
          <ReportDropdown label="SESSION" name="session" options={sessionOptions} />
          <ReportDropdown label="PROGRAM" name="program" options={programOptions} />
        </ReportCard>
      ))}
    </div>
  )
}

export default ReportListView
