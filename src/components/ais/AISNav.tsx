import React from 'react'
import { FaChartBar, FaProjectDiagram } from 'react-icons/fa'
import { GrDashboard, GrDocument } from 'react-icons/gr'
import AISNavItem from './AISNavItem'
import { BsPeople } from 'react-icons/bs'
import { HiMiniClipboardDocumentList } from 'react-icons/hi2'
import { HiOutlineAcademicCap } from 'react-icons/hi'

type Props = {
  user:any
}

function AISNav({ user }: Props) {
  const aisRoles = user?.roles?.filter((r:any) => r?.app?.toLowerCase() == 'ais');
  console.log(aisRoles);
  return (
    <div className="py-2 px-2 flex flex-col space-y-1 md:space-y-2 h-[75vh] overflow-y-scroll scrollbar-hide">
        <AISNavItem title="User Dashboard" url="dash" Icon={GrDashboard} /> 
        { aisRoles?.find((r:any) => ['acareport::admin'].includes(r?.role)) && (<AISNavItem title="System Reports" url="reports" Icon={FaChartBar} />) }
        { aisRoles?.find((r:any) => ['student::admin','student::clerk','student::registry','student::finance'].includes(r?.role)) && (<AISNavItem title="Student Module" url="students" Icon={BsPeople} />) }
        { aisRoles?.find((r:any) => ['course::admin','course::clerk'].includes(r?.role)) && (<AISNavItem title="Course Module" url="courses" Icon={HiMiniClipboardDocumentList} />) } 
        { aisRoles?.find((r:any) => ['program::admin','program::clerk','program::idcard'].includes(r?.role)) && (<AISNavItem title="Program Module" url="programs" Icon={FaProjectDiagram} />) } 
        { aisRoles?.find((r:any) => ['program::admin','program::clerk'].includes(r?.role)) && (<AISNavItem title="Department Module" url="departments" Icon={HiOutlineAcademicCap} />) } 
        { aisRoles?.find((r:any) => ['program::admin','program::clerk'].includes(r?.role)) && (<AISNavItem title="Faculty Module" url="faculties" Icon={GrDashboard} />) } 
        { aisRoles?.find((r:any) => ['curriculum::admin','curriculum::clerk'].includes(r?.role)) && (<AISNavItem title="Curriculum Module" url="curriculums" Icon={GrDashboard} />) } 
        { aisRoles?.find((r:any) => ['scheme::admin','scheme::clerk'].includes(r?.role)) && (<AISNavItem title="Scheme Module" url="schemes" Icon={GrDashboard} />) } 
        
        { aisRoles?.find((r:any) => ['calendar::admin','calendar::clerk'].includes(r?.role)) && (<AISNavItem title="Academic Calendar" url="calendars" Icon={GrDashboard} />) }
        { aisRoles?.find((r:any) => ['logs::admin','logs::clerk'].includes(r?.role)) && (<AISNavItem title="Progression Log" url="progression" Icon={GrDashboard} />) }
        { aisRoles?.find((r:any) => ['logs::admin','logs::clerk'].includes(r?.role)) && (<AISNavItem title="Registration Log" url="registrations" Icon={GrDashboard} />) }
        { aisRoles?.find((r:any) => ['logs::admin','logs::clerk'].includes(r?.role)) && (<AISNavItem title="Evaluation Log" url="evaluations" Icon={GrDashboard} />) }
        { aisRoles?.find((r:any) => ['evaluation::admin'].includes(r?.role)) && (<AISNavItem title="Evaluation Manager" url="evaluation-forms" Icon={GrDashboard} />) }
        { aisRoles?.find((r:any) => ['sheet::admin','sheet::dean','sheet::hod','sheet::head','sheet::pg-registry','sheet::ug-registry'].includes(r?.role)) && (<AISNavItem title="Assessment Sheet" url="sheets" Icon={GrDashboard} />) }
        { aisRoles?.find((r:any) => ['mysheet::assessor'].includes(r?.role)) && (<AISNavItem title="Assessor Sheet" url="mysheets" Icon={GrDashboard} />) } 
        { aisRoles?.find((r:any) => ['resit::admin','resit::assessor'].includes(r?.role)) && (<AISNavItem title="My Resits" url="my-resits" Icon={GrDashboard} />) }
        { aisRoles?.find((r:any) => ['resit::admin','resit::clerk','resit::assessor'].includes(r?.role)) && (<AISNavItem title="Resit Session" url="resit-sessions" Icon={GrDashboard} />) }
        { aisRoles?.find((r:any) => ['resit::admin','resit::clerk','resit::assessor'].includes(r?.role)) && (<AISNavItem title="Resit Module" url="resits" Icon={GrDashboard} />) }
        { aisRoles?.find((r:any) => ['graduation::admin','graduation::clerk','graduation::registry'].includes(r?.role)) && (<AISNavItem title="Graduation Session" url="graduate-sessions" Icon={GrDashboard} />) } {/* Graduation Session */}
        { aisRoles?.find((r:any) => ['graduation::admin','graduation::clerk','graduation::registry'].includes(r?.role)) && (<AISNavItem title="Graduation Module" url="graduates" Icon={GrDashboard} />) } {/* Graduation */}
        
        { aisRoles?.find((r:any) => ['backlog::admin','backlog::clerk'].includes(r?.role)) && (<AISNavItem title="Backlog Module" url="backlogs" Icon={GrDashboard} />) } 
        { aisRoles?.find((r:any) => ['transwift::admin','transwift::clerk'].includes(r?.role)) && (<AISNavItem title="Transwift Module" url="transwifts" Icon={GrDashboard} />) } 
        { aisRoles?.find((r:any) => ['sletter::admin','sletter::clerk'].includes(r?.role)) && (<AISNavItem title="Service Letter" url="letters" Icon={GrDashboard} />) } 
        
        {/* {['ais clerk','ais techlead','ais admin'].includes(aisRole?.appRole?.title?.toLowerCase()) && <AISNavItem title="Pixo System &reg;" url="pixo" Icon={GrDashboard} /> } */}
        
        
        { aisRoles?.find((r:any) => ['deferment::admin','deferment::clerk'].includes(r?.role)) && (<AISNavItem title="Deferment Module" url="deferments" Icon={GrDashboard} />) } 
        { aisRoles?.find((r:any) => ['circular::admin','circular::clerk'].includes(r?.role)) && (<AISNavItem title="Circular Module" url="notices" Icon={GrDashboard} />) } 
        
        { aisRoles?.find((r:any) => ['hrm::admin','hrm::clerk'].includes(r?.role)) && (<AISNavItem title="Staff Module" url="staff" Icon={GrDashboard} />) }
        { aisRoles?.find((r:any) => ['hrm::admin','hrm::clerk'].includes(r?.role)) && (<AISNavItem title="Job Module" url="jobs" Icon={GrDashboard} />) }
        { aisRoles?.find((r:any) => ['hrm::admin','hrm::clerk'].includes(r?.role)) && (<AISNavItem title=" Unit Module" url="units" Icon={GrDashboard} />) }
        { aisRoles?.find((r:any) => ['hrm::admin'].includes(r?.role)) && (<AISNavItem title=" User Roles" url="roles" Icon={GrDashboard} />) }
        {/* {['ais techlead','ais admin'].includes(aisRole?.appRole?.title?.toLowerCase()) && <AISNavItem title=" Utility Module" url="units" Icon={GrDashboard} /> } Religion,Region,Country,Disability, */}
        
    </div>
  )
}

export default AISNav