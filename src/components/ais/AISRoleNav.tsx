import React from 'react'
import { Menu } from '@headlessui/react'
import { CgMenuGridO } from "react-icons/cg";
import { useUserStore } from '../../utils/authService';
import { FaChartBar, FaProjectDiagram } from 'react-icons/fa'
import { GrDashboard, GrDocument } from 'react-icons/gr'
import AISNavItem from './AISNavItem'
import { BsPeople } from 'react-icons/bs'
import { HiMiniClipboardDocumentList } from 'react-icons/hi2'
import { HiOutlineAcademicCap } from 'react-icons/hi'
type Props = {
  user: any;
}

function AISRoleNav({ user }: Props) {
  
  const aisRoles = user?.roles?.filter((r:any) => r?.app?.toLowerCase() == 'ais');
  
  return (
    <Menu as='div' className="relative">
        <div className="px-4 p-2 md:hidden flex items-center justify-between border-b-2 border-slate-200/50 bg-slate-100 text-gray-400">
         
          <div className="flex items-center">
             <span className="px-3 p-1 text-sm tracking-widest font-bold text-primary/60 bg-white border-2 border-primary/60 rounded-md"><span className="text-primary/80">ACADEMICS</span>&reg;</span>
          </div>
          <Menu.Button className="p-0.5 bg-white border shadow-sm rounded-md">
            <CgMenuGridO className="h-7 w-7 text-gray-500/70"/>
          </Menu.Button>
        </div>
        {/* Mobile Navigation Slide */}
        <Menu.Items className="z-20 absolute top-13 left-0 min-h-max w-full border-b-4 border-blue-200/90 bg-blue-100 backdrop-blur-sm backdrop-opacity-70 bg-opacity-95">
          <div className="py-4 px-6 flex-1 flex flex-col space-y-1 md:space-y-4">
            <Menu.Item as={AISNavItem} title="User Dashboard" url="dash" Icon={GrDashboard}></Menu.Item>
            { aisRoles?.find((r:any) => ['acareport::admin'].includes(r?.role)) &&  (<Menu.Item as={AISNavItem} title="Reports" url="System Reports" Icon={FaChartBar}></Menu.Item>)}
            { aisRoles?.find((r:any) => ['student::admin','student::clerk'].includes(r?.role)) &&  (<Menu.Item as={AISNavItem} title="Student Module" url="students" Icon={BsPeople}></Menu.Item>) }
            { aisRoles?.find((r:any) => ['course::admin','course::clerk'].includes(r?.role)) &&  (<Menu.Item as={AISNavItem} title="Course Module" url="courses" Icon={HiMiniClipboardDocumentList}></Menu.Item>) }
            { aisRoles?.find((r:any) => ['program::admin','program::clerk','program::idcard'].includes(r?.role)) &&  (<Menu.Item as={AISNavItem} title="Program Module" url="programs" Icon={FaProjectDiagram}></Menu.Item>) }
            { aisRoles?.find((r:any) => ['program::admin','program::clerk'].includes(r?.role)) && (<Menu.Item as={AISNavItem} title="Department Module" url="departments" Icon={HiOutlineAcademicCap}></Menu.Item>) }
            { aisRoles?.find((r:any) => ['program::admin','program::clerk'].includes(r?.role)) && (<Menu.Item as={AISNavItem} title="Faculty Module" url="faculties" Icon={GrDashboard}></Menu.Item>) }            { aisRoles?.find((r:any) => ['acareport::admin'].includes(r?.role)) &&  (<Menu.Item as={AISNavItem} title="Faculty Module" url="faculties" Icon={GrDashboard}></Menu.Item>) }
            { aisRoles?.find((r:any) => ['curriculum::admin','curriculum::clerk'].includes(r?.role)) && (<Menu.Item as={AISNavItem} title="Curriculum Module" url="curriculums" Icon={GrDashboard}></Menu.Item>) }
            { aisRoles?.find((r:any) => ['scheme::admin','scheme::clerk'].includes(r?.role)) && (<Menu.Item as={AISNavItem} title="Scheme Module" url="schemes" Icon={GrDashboard}></Menu.Item>) }
            { aisRoles?.find((r:any) => ['calendar::admin','calendar::clerk'].includes(r?.role)) && (<Menu.Item as={AISNavItem} title="Academic Calendar" url="calendars" Icon={GrDashboard}></Menu.Item>) }
            { aisRoles?.find((r:any) => ['logs::admin','logs::clerk'].includes(r?.role)) &&  (<Menu.Item as={AISNavItem} title="Progression Log" url="progression" Icon={GrDashboard}></Menu.Item>) }
            { aisRoles?.find((r:any) => ['logs::admin','logs::clerk'].includes(r?.role)) &&  (<Menu.Item as={AISNavItem} title="Registration Log" url="registrations" Icon={GrDashboard}></Menu.Item>) }
            { aisRoles?.find((r:any) => ['logs::admin','logs::clerk'].includes(r?.role)) &&  (<Menu.Item as={AISNavItem} title="Evaluation Log" url="evaluations" Icon={GrDashboard}></Menu.Item>) }
            { aisRoles?.find((r:any) => ['sheet::admin','sheet::dean','sheet::hod','sheet::head','sheet::pg-registry','sheet::ug-registry'].includes(r?.role)) &&  (<Menu.Item as={AISNavItem} title="Assessment Sheet" url="sheets" Icon={GrDashboard}></Menu.Item>) }
            { aisRoles?.find((r:any) => ['mysheet::assessor'].includes(r?.role)) &&  (<Menu.Item as={AISNavItem} title="Assessor Sheet" url="mysheets" Icon={GrDashboard}></Menu.Item>) }
            { aisRoles?.find((r:any) => ['resit::admin','resit::assessor'].includes(r?.role)) &&  (<Menu.Item as={AISNavItem} title="My Resits" url="my-resits" Icon={GrDashboard}></Menu.Item>) }
            { aisRoles?.find((r:any) => ['resit::admin','resit::clerk','resit::assessor'].includes(r?.role)) &&  (<Menu.Item as={AISNavItem} title="Resit Session" url="resit-sessions" Icon={GrDashboard}></Menu.Item>) }
            { aisRoles?.find((r:any) => ['resit::admin','resit::clerk','resit::assessor'].includes(r?.role)) &&  (<Menu.Item as={AISNavItem} title="Resit Module" url="resits" Icon={GrDashboard}></Menu.Item>) }
            { aisRoles?.find((r:any) => ['graduation::admin','graduation::clerk','graduation::registry'].includes(r?.role)) &&  (<Menu.Item as={AISNavItem} title="Graduation Session" url="graduate-sessions" Icon={GrDashboard}></Menu.Item>) }
            { aisRoles?.find((r:any) => ['graduation::admin','graduation::clerk','graduation::registry'].includes(r?.role)) &&  (<Menu.Item as={AISNavItem} title="Graduation Module" url="graduates" Icon={GrDashboard}></Menu.Item>) }
            { aisRoles?.find((r:any) => ['graduation::admin','graduation::clerk','graduation::registry'].includes(r?.role)) &&  (<Menu.Item as={AISNavItem} title="Graduation Logs" url="graduate-logs" Icon={GrDashboard}></Menu.Item>) }
            { aisRoles?.find((r:any) => ['backlog::admin','backlog::clerk'].includes(r?.role)) &&  (<Menu.Item as={AISNavItem} title="Backlog Module" url="backlogs" Icon={GrDashboard}></Menu.Item>) }
            { aisRoles?.find((r:any) => ['transwift::admin','transwift::clerk'].includes(r?.role)) &&  (<Menu.Item as={AISNavItem} title="Transwift Module" url="transwifts" Icon={GrDashboard}></Menu.Item>) }
            { aisRoles?.find((r:any) => ['sletter::admin','sletter::clerk'].includes(r?.role)) &&  (<Menu.Item as={AISNavItem} title="Service Letter" url="letters" Icon={GrDashboard}></Menu.Item>) }
            { aisRoles?.find((r:any) => ['deferment::admin','deferment::clerk'].includes(r?.role)) &&  (<Menu.Item as={AISNavItem} title="Deferment Module" url="deferments" Icon={GrDashboard}></Menu.Item>) }
            { aisRoles?.find((r:any) => ['circular::admin','circular::clerk'].includes(r?.role)) &&  (<Menu.Item as={AISNavItem} title="Circular Module" url="notices" Icon={GrDashboard}></Menu.Item>) }
            { aisRoles?.find((r:any) => ['hrm::admin','hrm::clerk'].includes(r?.role)) &&  (<Menu.Item as={AISNavItem} title="Staff Module" url="staff" Icon={GrDashboard}></Menu.Item>) }
            { aisRoles?.find((r:any) => ['hrm::admin','hrm::clerk'].includes(r?.role)) &&  (<Menu.Item as={AISNavItem} title="Job Module" url="jobs" Icon={GrDashboard} ></Menu.Item>) }
            { aisRoles?.find((r:any) => ['hrm::admin','hrm::clerk'].includes(r?.role)) &&  (<Menu.Item as={AISNavItem} title=" Unit Module" url="units" Icon={GrDashboard}></Menu.Item>) }
            { aisRoles?.find((r:any) => ['hrm::admin'].includes(r?.role)) &&  (<Menu.Item as={AISNavItem} title=" User Roles" url="roles" Icon={GrDashboard}></Menu.Item>) }

          </div>
        </Menu.Items>
    </Menu>
  )
}

export default AISRoleNav 