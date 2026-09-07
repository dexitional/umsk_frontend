import BacklogShims from "./BacklogShims";
import CalendarShims from "./CalendarShims";
import CourseShims from "./CourseShims";
import CurriculumShims from "./CurriculumShims";
import GraduateSessionShims from "./GraduateSessionShims";
import GraduateShims from "./GraduateShims";
import MySheetShims from "./MySheetShims";
import ProgramShims from "./ProgramShims";
import ProgressionShims from "./ProgressionShims";
import RegistrationShims from "./RegistrationShims";
import ResitSessionShims from "./ResitSessionShims";
import ResitShims from "./ResitShims";
import SchemeShims from "./SchemeShims";
import SheetShims from "./SheetShims";
import StudentShims from "./StudentShims"
import React from 'react'
import TranswiftShims from "./TranswiftShims";
import LetterShims from "./LetterShims";
import DefermentShims from "./DefermentShims";
import CircularShims from "./CircularShims";
import JobShims from "./JobShims";
import StaffShims from "./StaffShims";
import UnitShims from "./UnitShims";
import DefaultShims from "./DefaultShims";
import HomeShims from "./HomeShims";


export const ShimRenderer: any = (pathname: string, children: React.ReactNode) => {
    switch(pathname){
      case '/ais/students': return <div>{children}</div>; break;
      case '/ais/courses': return <CourseShims />; break;
      case '/ais/programs': return <ProgramShims />; break;
      case '/ais/curriculums': return <CurriculumShims />; break;
      case '/ais/schemes': return <SchemeShims />; break;
      case '/ais/calendars': return <CalendarShims />; break;
      case '/ais/progression': return <ProgressionShims />; break;
      case '/ais/registrations': return <RegistrationShims />; break;
      case '/ais/sheets': return <SheetShims />; break;
      case '/ais/mysheets': return <MySheetShims />; break;
      case '/ais/resit-sessions': return <ResitSessionShims />; break;
      case '/ais/resits': return <ResitShims />; break;
      case '/ais/graduate-sessions': return <GraduateSessionShims />; break;
      case '/ais/graduates': return <GraduateShims />; break;
      case '/ais/backlogs': return <BacklogShims />; break;
      case '/ais/transwifts': return <TranswiftShims />; break;
      case '/ais/letters': return <LetterShims />; break;
      case '/ais/deferments': return <DefermentShims />; break;
      case '/ais/notices': return <CircularShims />; break;
      case '/ais/jobs': return <JobShims />; break;
      case '/ais/units': return <UnitShims />; break;
      case '/ais/staff': return <StaffShims />; break;
      case '/dash': return <HomeShims />; break;
      
      default: return <DefaultShims>{children}</DefaultShims>; break;
    }
}