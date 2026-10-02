import React from 'react';
import { IconType } from 'react-icons';
import {
  HiOutlineBanknotes,
  HiOutlineChartBar,
  HiOutlineChatBubbleLeftRight,
  HiOutlineClipboardDocumentList,
  HiOutlineDocumentText,
  HiOutlineHandRaised,
  HiOutlineIdentification,
  HiOutlineKey,
  HiOutlineSquares2X2,
  HiOutlineUserGroup,
} from 'react-icons/hi2';
import { useHasRole } from '../../utils/roles';
import AISPNavItem from './AISPNavItem';

export type AISPNavLink = { title: string; url: string; Icon: IconType };

// Single source for the portal's navigation — the sidebar, the mobile
// drawer and the top bar's page title all read from here.
export const AISP_NAV: { label: string; items: AISPNavLink[] }[] = [
  {
    label: 'Overview',
    items: [
      { title: 'Dashboard', url: '/aisp/dash', Icon: HiOutlineSquares2X2 },
      { title: 'My Profile', url: '/aisp/profile', Icon: HiOutlineIdentification },
    ],
  },
  {
    label: 'Academics',
    items: [
      { title: 'Course Registration', url: '/aisp/registration', Icon: HiOutlineClipboardDocumentList },
      { title: 'Academic Results', url: '/aisp/results', Icon: HiOutlineChartBar },
      { title: 'Evaluations', url: '/aisp/evaluation', Icon: HiOutlineChatBubbleLeftRight },
    ],
  },
  {
    label: 'Finance & Services',
    items: [
      { title: 'Fees & Charges', url: '/aisp/fees', Icon: HiOutlineBanknotes },
      { title: 'Service Requests', url: '/aisp/services', Icon: HiOutlineDocumentText },
      { title: 'Elections Portal', url: '/evs/dash', Icon: HiOutlineHandRaised },
    ],
  },
  {
    label: 'Account',
    items: [
      { title: 'Change Password', url: '/aisp/changepwd', Icon: HiOutlineKey },
    ],
  },
];

type Props = {
  onNavigate?: () => void;
};

function AISPNav({ onNavigate }: Props) {
  const canManageRoles = useHasRole('ais', ['hrm::admin']);
  return (
    <nav className="flex flex-col gap-6">
      {AISP_NAV.map((group) => (
        <div key={group.label} className="flex flex-col gap-1">
          <span className="px-4 pb-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white/[0.35]">
            {group.label}
          </span>
          {group.items.map((item) => (
            <AISPNavItem key={item.url} {...item} onClick={onNavigate} />
          ))}
          {group.label === 'Account' && canManageRoles ? (
            <AISPNavItem title="Roles" url="/aisp/roles" Icon={HiOutlineUserGroup} onClick={onNavigate} />
          ) : null}
        </div>
      ))}
    </nav>
  );
}

export default AISPNav;
