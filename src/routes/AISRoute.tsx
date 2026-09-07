import React from 'react';

import AISLayout from '../components/ais/AISLayout';
import Error from '../pages/Error';
import { useUserStore } from '../utils/authService';

const user = useUserStore.getState().user
const aisRole = user?.roles?.find(r => r?.app_tag?.toLowerCase() == 'ais')

const AISRoute:any =  {
   path: "ais",
   element: <AISLayout />,
   errorElement: <Error />,
   // action: chosenAction,
   children: [
      {  path:'dash',
         lazy: () => import('../pages/ais/PgAISDash').then(m => ({ Component: m.default, loader: m.loader })),
         index: true,
         hydrateFallbackElement: <div>testing hydration</div>
      },
      {  path:'roles',
         lazy: () => import('../pages/ais/PgAISRoles').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {  path:'roles/:roleId/destroy',
         lazy: () => import('../pages/ais/PgAISRoles').then(m => ({ action: m.action })),
      },
      {  path:'reports',
         lazy: () => import('../pages/ais/PgAISReport').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },

      /* Password Change */
      {  path:'changepwd',
         lazy: () => import('../pages/ais/PgAISPasswordForm').then(m => ({ Component: m.default, action: m.action })),
      },

      /* Evaluations */
      {
         path:'evaluations',
         lazy: () => import('../pages/ais/PgAISEvaluations').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'evaluations/:evaluationId',
         lazy: () => import('../pages/ais/PgAISEvaluations').then(m => ({ Component: m.default })),
         // loader: aisEvaluationLoader,
      },

      /* Student Module */
      {
         path:'students',
         lazy: () => import('../pages/ais/PgAISStudents').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'students/create',
         // element: ['ais techlead','ais admin'].includes(aisRole?.appRole?.title?.toLowerCase()) ? <PgAISStudentForm /> :<Navigate to={{ pathname: '/dash' }} replace />,
         lazy: () => import('../pages/ais/PgAISStudentForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      {
         path:'students/:studentId',
         lazy: () => import('../pages/ais/PgAISStudent').then(m => ({ Component: m.default, loader: m.loader })),
         children: [
            {
               path:'profile',
               lazy: () => import('../pages/ais/PgAISStudentProfile').then(async m => ({ Component: m.default, loader: (await import('../pages/ais/PgAISStudent')).loader })),
               index: true
            },
            {
               path:'finance',
               lazy: () => import('../pages/ais/PgAISStudentFinance').then(m => ({ Component: m.default, loader: m.loader })),
            },
            {
               path:'transcript',
               lazy: () => import('../pages/ais/PgAISStudentTranscript').then(m => ({ Component: m.default, loader: m.loader })),
            },
            {
               path:'account',
               lazy: () => import('../pages/ais/PgAISStudentAccount').then(m => ({ Component: m.default, loader: m.loader })),
            },
            {
               path:'activity',
               lazy: () => import('../pages/ais/PgAISStudentActivity').then(async m => ({ Component: m.default, loader: (await import('../pages/ais/PgAISStudent')).loader })),
            },
            {
               path:'idcard',
               lazy: () => import('../pages/ais/PgAISStudentIDCard').then(m => ({ Component: m.default, loader: m.loader })),
            }
         ]
      },
      {
         path:'students/:studentId/destroy',
         // action: nssMainDestroy,
      },
      {
         path:'students/:studentId/edit',
         // element: ['ais techlead','ais admin'].includes(aisRole?.appRole?.title?.toLowerCase()) ? <PgAISStudentForm /> :<Navigate to={{ pathname: '/dash' }} replace />,
         lazy: () => import('../pages/ais/PgAISStudentForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },

      /* Course Module */
      {
         path:'courses',
         lazy: () => import('../pages/ais/PgAISCourses').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'courses/create',
         lazy: () => import('../pages/ais/PgAISCourseForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      {
         path:'courses/:courseId/destroy',
         lazy: () => import('../pages/ais/PgAISCourses').then(m => ({ action: m.action })),
      },
      {
         path:'courses/:courseId/edit',
         lazy: () => import('../pages/ais/PgAISCourseForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },

      /* Program Module */
      {
         path:'programs',
         lazy: () => import('../pages/ais/PgAISPrograms').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'programs/create',
         lazy: () => import('../pages/ais/PgAISProgramForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      {
         path:'programs/:programId',
         lazy: () => import('../pages/ais/PgAISProgram').then(m => ({ Component: m.default, loader: m.loader })),
         children: [
            {
               index: true,
               path:'curriculum',
               lazy: () => import('../pages/ais/PgAISProgramStructure').then(m => ({ Component: m.default, loader: m.loader })),
            },
            {
               path:'students',
               lazy: () => import('../pages/ais/PgAISProgramStudent').then(m => ({ Component: m.default, loader: m.loader })),
            },
            {
               path:'change',
               lazy: () => import('../pages/ais/PgAISProgramChange').then(m => ({ Component: m.default, loader: m.loader })),
            },
            {
               path:'statistics',
               lazy: () => import('../pages/ais/PgAISProgramStatistics').then(async m => ({ Component: m.default, loader: (await import('../pages/ais/PgAISProgramStudent')).loader })),
            },
            ,
            {
               path:'idcards',
               lazy: () => import('../pages/ais/PgAISProgramIDCard').then(async m => ({ Component: m.default, loader: (await import('../pages/ais/PgAISProgramStatistics')).loader })),
            }
         ]
      },
      {
         path:'programs/:programId/destroy',
         lazy: () => import('../pages/ais/PgAISPrograms').then(m => ({ action: m.action })),
      },
      {
         path:'programs/:programId/edit',
         lazy: () => import('../pages/ais/PgAISProgramForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },

       /* Faculty Module */
       {
         path:'faculties',
         lazy: () => import('../pages/ais/PgAISFaculties').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'departments/create',
         lazy: () => import('../pages/ais/PgAISCourseForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      {
         path:'departments/:departmentId/destroy',
         lazy: () => import('../pages/ais/PgAISCourses').then(m => ({ action: m.action })),
      },
      {
         path:'departments/:departmentId/edit',
         lazy: () => import('../pages/ais/PgAISCourseForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },

      /* Department Module */
      {
         path:'departments',
         lazy: () => import('../pages/ais/PgAISDepartments').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'departments/create',
         lazy: () => import('../pages/ais/PgAISCourseForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      {
         path:'departments/:departmentId/destroy',
         lazy: () => import('../pages/ais/PgAISCourses').then(m => ({ action: m.action })),
      },
      {
         path:'departments/:departmentId/edit',
         lazy: () => import('../pages/ais/PgAISCourseForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },

      /* Curriculum & Structure Module */
      {
         path:'curriculums',
         lazy: () => import('../pages/ais/PgAISStructures').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'curriculums/create',
         lazy: () => import('../pages/ais/PgAISStructureForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      {
         path:'curriculums/:curriculumId/destroy',
         lazy: () => import('../pages/ais/PgAISStructures').then(m => ({ action: m.action })),
      },
      {
         path:'curriculums/:curriculumId/edit',
         lazy: () => import('../pages/ais/PgAISStructureForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },

      /* Calendars */
      {
         path:'calendars',
         lazy: () => import('../pages/ais/PgAISCalendars').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'calendars/create',
         lazy: () => import('../pages/ais/PgAISCalendarForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      {
         path:'calendars/:calendarId',
         lazy: () => import('../pages/ais/PgAISCalendar').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'calendars/:calendarId/destroy',
         lazy: () => import('../pages/ais/PgAISCalendars').then(m => ({ action: m.action })),
      },
      {
         path:'calendars/:calendarId/edit',
         lazy: () => import('../pages/ais/PgAISCalendarForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },

      /* Scheme Module */
      {
         path:'schemes',
         lazy: () => import('../pages/ais/PgAISSchemes').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'schemes/create',
         lazy: () => import('../pages/ais/PgAISSchemeForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      {
         path:'schemes/:schemeId',
         lazy: () => import('../pages/ais/PgAISScheme').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'schemes/:schemeId/destroy',
         lazy: () => import('../pages/ais/PgAISSchemes').then(m => ({ action: m.action })),
      },
      {
         path:'schemes/:schemeId/edit',
         lazy: () => import('../pages/ais/PgAISSchemeForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },


      /* Progression Module */
      {
         path:'progression',
         lazy: () => import('../pages/ais/PgAISProgressions').then(m => ({ Component: m.default, loader: m.loader })),
      },


      /* Registrations Module */
      {
         path:'registrations',
         lazy: () => import('../pages/ais/PgAISRegistrations').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'registrations/create',
         lazy: () => import('../pages/ais/PgAISSchemeForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      {
         path:'registrations/:registrationId',
         lazy: () => import('../pages/ais/PgAISRegsitration').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'registrations/:registrationId/destroy',
         lazy: () => import('../pages/ais/PgAISRegistrations').then(m => ({ action: m.action })),
      },
      {
         path:'registrations/:registrationId/edit',
         lazy: () => import('../pages/ais/PgAISSchemeForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },

      /* Deferment Module */
      {
         path:'deferments',
         lazy: () => import('../pages/ais/PgAISDeferments').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'deferments/create',
         lazy: () => import('../pages/ais/PgAISDefermentForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      {
         path:'deferments/:defermentId',
         lazy: () => import('../pages/ais/PgAISDeferment').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'deferments/:defermentId/destroy',
         lazy: () => import('../pages/ais/PgAISDeferments').then(m => ({ action: m.action })),
      },
      {
         path:'deferments/:defermentId/edit',
         lazy: () => import('../pages/ais/PgAISDefermentForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },


       /* Service Letters Module */
       {
         path:'letters',
         lazy: () => import('../pages/ais/PgAISLetters').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'letters/create',
         lazy: () => import('../pages/ais/PgAISLetterForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      {
         path:'letters/:letterId',
         lazy: () => import('../pages/ais/PgAISLetter').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'letters/:letterId/destroy',
         lazy: () => import('../pages/ais/PgAISLetters').then(m => ({ action: m.action })),
      },
      {
         path:'letters/:letterId/edit',
         lazy: () => import('../pages/ais/PgAISLetterForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },

      /* Sheet Module */
      {
         path:'sheets',
         lazy: () => import('../pages/ais/PgAISSheets').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'sheets/create',
         lazy: () => import('../pages/ais/PgAISSheetForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      {
         path:'sheets/:sheetId',
         lazy: () => import('../pages/ais/PgAISSheet').then(m => ({ Component: m.default, loader: m.loader })),
         children: [
            {
               // index and path are mutually exclusive in react-router v6 —
               // a route combining both silently fails to match the bare
               // parent URL (e.g. .../mysheets/:sheetId with no sub-path),
               // leaving the Outlet empty. Two entries: a true index route
               // for the bare URL, plus the explicit path so the STUDENTS
               // tab link (SubNavLink url="students") still works when
               // navigated to from another tab.
               index: true,
               lazy: () => import('../pages/ais/PgAISSheetStudent').then(m => ({ Component: m.default, loader: m.loader })),
            },
            {
               path:'students',
               lazy: () => import('../pages/ais/PgAISSheetStudent').then(m => ({ Component: m.default, loader: m.loader })),
            },
            {
               path:'scores',
               lazy: () => import('../pages/ais/PgAISSheetScore').then(m => ({ Component: m.default, loader: m.loader })),
            },
            {
               path:'capture',
               lazy: () => import('../pages/ais/PgAISSheetCapture').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
            },
            {
               path:'account',
               lazy: () => import('../pages/ais/PgAISSheetAccount').then(m => ({ Component: m.default, loader: m.loader })),
            },
            {
               path:'activity',
               lazy: () => import('../pages/ais/PgAISSheetActivity').then(m => ({ Component: m.default, loader: m.loader })),
            }
         ]
      },
      {
         path:'sheets/:sheetId/destroy',
         // action: nssMainDestroy,
      },
      {
         path:'sheets/:sheetId/edit',
         lazy: () => import('../pages/ais/PgAISSheetForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },


      /* MySheet Module */
      {
         path:'mysheets',
         lazy: () => import('../pages/ais/PgAISMySheets').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'mysheets/create',
         lazy: () => import('../pages/ais/PgAISSheetForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      {
         path:'mysheets/:sheetId',
         lazy: () => import('../pages/ais/PgAISMySheet').then(async m => ({ Component: m.default, loader: (await import('../pages/ais/PgAISSheet')).loader })),
         children: [
            {
               // index and path are mutually exclusive in react-router v6 —
               // a route combining both silently fails to match the bare
               // parent URL (e.g. .../mysheets/:sheetId with no sub-path),
               // leaving the Outlet empty. Two entries: a true index route
               // for the bare URL, plus the explicit path so the STUDENTS
               // tab link (SubNavLink url="students") still works when
               // navigated to from another tab.
               index: true,
               lazy: () => import('../pages/ais/PgAISSheetStudent').then(m => ({ Component: m.default, loader: m.loader })),
            },
            {
               path:'students',
               lazy: () => import('../pages/ais/PgAISSheetStudent').then(m => ({ Component: m.default, loader: m.loader })),
            },
            {
               path:'scores',
               lazy: () => import('../pages/ais/PgAISSheetScore').then(m => ({ Component: m.default, loader: m.loader })),
            },
            {
               path:'capture',
               lazy: () => import('../pages/ais/PgAISSheetCapture').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
            },
            {
               path:'account',
               lazy: () => import('../pages/ais/PgAISSheetAccount').then(m => ({ Component: m.default, loader: m.loader })),
            },
            {
               path:'activity',
               lazy: () => import('../pages/ais/PgAISSheetActivity').then(m => ({ Component: m.default, loader: m.loader })),
            }
         ]
      },
      {
         path:'mysheets/:sheetId/destroy',
         // action: nssMainDestroy,
      },
      {
         path:'mysheets/:sheetId/edit',
         lazy: () => import('../pages/ais/PgAISSheetForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },


       /* Backlog Module */
       {
         path:'backlogs',
         lazy: () => import('../pages/ais/PgAISBacklogs').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'backlogs/sample',
         lazy: () => import('../pages/ais/PgAISBacklogSample').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      {
         path:'backlogs/create',
         lazy: () => import('../pages/ais/PgAISBacklogForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      {
         path:'backlogs/:backlogId',
         lazy: () => import('../pages/ais/PgAISBacklog').then(m => ({ Component: m.default, loader: m.loader })),
         children: [
            {
               path:'records',
               lazy: () => import('../pages/ais/PgAISBacklogRecord').then(m => ({ Component: m.default, loader: m.loader })),
               index: true
            },
            {
               path:'manager',
               lazy: () => import('../pages/ais/PgAISBacklogManager').then(m => ({ Component: m.default, loader: m.loader })),
            }
         ]
      },
      {
         path:'backlogs/:backlog/destroy',
         // action: nssMainDestroy,
      },
      {
         path:'backlogs/:backlogId/edit',
         lazy: () => import('../pages/ais/PgAISBacklogForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },


      /* Resit Session Module */
      {
         path:'resit-sessions',
         lazy: () => import('../pages/ais/PgAISResitSessions').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'resit-sessions/create',
         lazy: () => import('../pages/ais/PgAISResitSessionForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      {
         path:'resit-sessions/:sessionId',
         lazy: () => import('../pages/ais/PgAISResitSession').then(m => ({ Component: m.default, loader: m.loader })),
         children: [
            {
               path:'students',
               lazy: () => import('../pages/ais/PgAISResitSessionStudent').then(m => ({ Component: m.default, loader: m.loader })),
               index: true
            },
            {
               path:'scores',
               lazy: () => import('../pages/ais/PgAISResitSessionScore').then(m => ({ Component: m.default, loader: m.loader })),
            },
            {
               path:'capture',
               lazy: () => import('../pages/ais/PgAISResitSessionCapture').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
            },
            {
               path:'action',
               lazy: () => import('../pages/ais/PgAISResitSessionAction').then(m => ({ Component: m.default, loader: m.loader })),
            }
         ]
      },
      {
         path:'resit-sessions/:sessionId/destroy',
         lazy: () => import('../pages/ais/PgAISResitSession').then(m => ({ action: m.action })),
      },
      {
         path:'resit-sessions/:sessionId/edit',
         lazy: () => import('../pages/ais/PgAISResitSessionForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },

      /* My Resits Module — resit::assessor (HOD) scoped score entry.
         One card per COURSE registered for resit in the active resit
         session (no session picker — "My Resits" always means the active
         one), each linking straight to that course's students/scores/
         capture. Backed by fetchMyResitCourses/fetchMyResitCourseList,
         which reuse fetchResitSessionList's department-scoped grouping
         logic resolved against the active session server-side. */
      {
         path:'my-resits',
         lazy: () => import('../pages/ais/PgAISMyResitCourses').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'my-resits/:courseId',
         lazy: () => import('../pages/ais/PgAISMyResitCourse').then(m => ({ Component: m.default })),
         children: [
            {
               path:'students',
               lazy: () => import('../pages/ais/PgAISMyResitCourseStudent').then(m => ({ Component: m.default, loader: m.loader })),
               index: true
            },
            {
               path:'scores',
               lazy: () => import('../pages/ais/PgAISMyResitCourseScore').then(m => ({ Component: m.default, loader: m.loader })),
            },
            {
               path:'capture',
               lazy: () => import('../pages/ais/PgAISMyResitCourseCapture').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
            },
         ]
      },


       /* Resit Module */
       {
         path:'resits',
         lazy: () => import('../pages/ais/PgAISResits').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'resits/create',
         lazy: () => import('../pages/ais/PgAISResitForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      // {
      //    path:'resits/:resitId',
      //    element: <PgAISResit />,
      //    loader: resitLoader,
      // },
      {
         path:'resits/:resit/destroy',
         // action: nssMainDestroy,
      },
      {
         path:'resits/:resitId/edit',
         lazy: () => import('../pages/ais/PgAISResitForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },


      /* Graduation Logs */
      {
         path:'graduate-logs',
         lazy: () => import('../pages/ais/PgAISGraduateLogs').then(m => ({ Component: m.default, loader: m.loader })),
      },

      /* Graduation Session Module */
      {
         path:'graduate-sessions',
         lazy: () => import('../pages/ais/PgAISGraduateSessions').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'graduate-sessions/create',
         lazy: () => import('../pages/ais/PgAISGraduateSessionForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      {
         path:'graduate-sessions/:sessionId',
         lazy: () => import('../pages/ais/PgAISGraduateSession').then(m => ({ Component: m.default, loader: m.loader })),
         children: [
            {
               path:'graduants',
               lazy: () => import('../pages/ais/PgAISGraduateSessionStudent').then(m => ({ Component: m.default, loader: m.loader })),
               index: true
            },
            {
               path:'issues',
               lazy: () => import('../pages/ais/PgAISGraduateSessionStudentIssue').then(async m => ({ Component: m.default, loader: (await import('../pages/ais/PgAISGraduateSessionStudent')).loader })),
            },
            {
               path:'verified',
               lazy: () => import('../pages/ais/PgAISGraduateSessionStudentClean').then(async m => ({ Component: m.default, loader: (await import('../pages/ais/PgAISGraduateSessionStudent')).loader })),
            },
            {
               path:'action',
               lazy: () => import('../pages/ais/PgAISGraduateSessionAction').then(m => ({ Component: m.default, loader: m.loader })),
            },
            {
               path:'print',
               lazy: () => import('../components/print/PrintBroadsheet').then(m => ({ Component: () => <div className="max-h-screen overflow-scroll"><m.default /></div> })),
            },
            {
               path:'certs',
               lazy: () => import('../components/print/PrintCertificates').then(m => ({ Component: () => <div className="max-h-screen overflow-scroll"><m.default /></div>, loader: m.loader })),
            },
         ]
      },
      {
         path:'graduate-sessions/:sessionId/destroy',
         lazy: () => import('../pages/ais/PgAISGraduateSession').then(m => ({ action: m.action })),
      },
      {
         path:'graduate-sessions/:sessionId/edit',
         lazy: () => import('../pages/ais/PgAISGraduateSessionForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },


       /* Graduation Module */
       {
         path:'graduates',
         lazy: () => import('../pages/ais/PgAISGraduates').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'graduates/create',
         lazy: () => import('../pages/ais/PgAISGraduateForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      {
         path:'graduates/:graduate/destroy',
         // action: nssMainDestroy,
      },
      {
         path:'graduates/:graduateId/edit',
         lazy: () => import('../pages/ais/PgAISGraduateForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },


       /* Transwift Module */
       {
         path:'transwifts',
         lazy: () => import('../pages/ais/PgAISTranswifts').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'transwifts/create',
         lazy: () => import('../pages/ais/PgAISTranswiftForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      {
         path:'transwifts/:transwiftId',
         lazy: () => import('../pages/ais/PgAISTranswift').then(m => ({ Component: m.default, loader: m.loader })),
         children: [
            {
               path:'transcript',
               lazy: () => import('../components/print/PaperTranscriptView').then(m => ({ Component: m.default, loader: m.loader })),
               index: true
            },
            {
               path:'document',
               lazy: () => import('../pages/ais/PgDocument').then(m => ({ Component: m.default, loader: m.loader })),
            }
         ]
      },
      {
         path:'transwifts/:transwiftId/destroy',
         lazy: () => import('../pages/ais/PgAISTranswift').then(m => ({ action: m.action })),
      },
      {
         path:'transwifts/:transwiftId/edit',
         lazy: () => import('../pages/ais/PgAISTranswiftForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },

       /* Circular Module */
       {
         path:'notices',
         lazy: () => import('../pages/ais/PgAISCirculars').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      {
         path:'notices/create',
         lazy: () => import('../pages/ais/PgAISCircularForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      {
         path:'notices/:noticeId/send',
         lazy: () => import('../pages/ais/PgAISCirculars').then(m => ({ action: m.action })),
      },
      {
         path:'notices/:noticeId/destroy',
         lazy: () => import('../pages/ais/PgAISCirculars').then(m => ({ action: m.action })),
      },
      {
         path:'notices/:noticeId/edit',
         lazy: () => import('../pages/ais/PgAISCircularForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },


      /* Staff Module */
      {
         path:'staff',
         lazy: () => import('../pages/ais/PgAISStaffs').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'staff/create',
         lazy: () => import('../pages/ais/PgAISStaffForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      {
         path:'staff/:staffId',
         lazy: () => import('../pages/ais/PgAISStaff').then(m => ({ Component: m.default, loader: m.loader })),
         children: [
            {
               path:'profile',
               lazy: () => import('../pages/ais/PgAISStaffProfile').then(async m => ({ Component: m.default, loader: (await import('../pages/ais/PgAISStaff')).loader })),
               index: true
            },
            {
               path:'roles',
               lazy: () => import('../pages/ais/PgAISStaffRole').then(m => ({ Component: m.default, loader: m.loader })),
            },
            {
               path:'roles/create',
               lazy: () => import('../pages/ais/PgAISStaffRoleForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
            },
            {
               path:'roles/:roleId/destroy',
               lazy: () => import('../pages/ais/PgAISStaffRole').then(m => ({ action: m.action })),
            },
            {
               path:'account',
               lazy: () => import('../pages/ais/PgAISStaffAccount').then(m => ({ Component: m.default, loader: m.loader })),
            },
            {
               path:'idcard',
               lazy: () => import('../pages/ais/PgAISStaffIDCard').then(async m => ({ Component: m.default, loader: (await import('../pages/ais/PgAISStudentIDCard')).loader })),
            }
         ]
      },
      {
         path:'staff/:staffId/destroy',
         lazy: () => import('../pages/ais/PgAISStaffs').then(m => ({ action: m.action })),
      },
      {
         path:'staff/:staffId/edit',
         lazy: () => import('../pages/ais/PgAISStaffForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },

       /* Job Designation Module */
       {
         path:'jobs',
         lazy: () => import('../pages/ais/PgAISJobs').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'jobs/create',
         lazy: () => import('../pages/ais/PgAISJobForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      {
         path:'jobs/:jobId',
         lazy: () => import('../pages/ais/PgAISJob').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'jobs/:jobId/destroy',
         lazy: () => import('../pages/ais/PgAISJobs').then(m => ({ action: m.action })),
      },
      {
         path:'jobs/:jobId/edit',
         lazy: () => import('../pages/ais/PgAISJobForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },


      /* Units Module */
      {
         path:'units',
         lazy: () => import('../pages/ais/PgAISUnits').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'units/create',
         lazy: () => import('../pages/ais/PgAISUnitForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      {
         path:'units/:unitId',
         lazy: () => import('../pages/ais/PgAISUnit').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'units/:unitId/destroy',
         lazy: () => import('../pages/ais/PgAISUnits').then(m => ({ action: m.action })),
      },
      {
         path:'units/:unitId/edit',
         lazy: () => import('../pages/ais/PgAISUnitForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },

   ]
}

export default AISRoute