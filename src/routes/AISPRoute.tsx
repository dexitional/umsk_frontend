import React from 'react';
import AISPLayout from '../components/aisp/AISPLayout';
import AISPPager, { loader as aispPagerLoader } from '../components/aisp/AISPPager';
import Error from '../pages/Error';

import { useUserStore } from '../utils/authService';

const user = useUserStore.getState().user

const AISRoute:any =  {
   path: "aisp",
   element: <AISPLayout />,
   errorElement: <Error />,
   //action: chosenAction,
   children: [
      {  element: <AISPPager />,
         loader: aispPagerLoader,
         children: [
            {
               path:'dash',
               // loader was missing here even though PgAISPDash exports one —
               // useLoaderData() always returned undefined, crashing the page.
               lazy: () => import('../pages/aisp/PgAISPDash').then(m => ({ Component: m.default, loader: m.loader })),
            }
         ]
      },

      // Profile
      {  path:'profile',
         lazy: () => import('../pages/aisp/PgAISPProfile').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'profile/:profileId/edit',
         lazy: () => import('../pages/aisp/PgAISPProfileForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },

      // Notices
      {  path:'notices',
         lazy: () => import('../pages/aisp/PgAISPNotices').then(m => ({ Component: m.default, loader: m.loader })),
      },

      // Fees & Charges
      {  path:'fees',
         lazy: () => import('../pages/aisp/PgAISPFees').then(m => ({ Component: m.default, loader: m.loader })),
      },

      // Results
      {  path:'results',
         lazy: () => import('../pages/aisp/PgAISPResults').then(m => ({ Component: m.default, loader: m.loader })),
      },

       // Registrations
      {  path:'registration',
         lazy: () => import('../pages/aisp/PgAISPRegistrations').then(m => ({ Component: m.default, loader: m.loader })),
      },

      // Registrations
      {  path:'evaluation',
         lazy: () => import('../pages/eva/PgCourseEvaluation').then(m => ({ Component: m.default, loader: m.loader })),
      },


      // Services
      {  path:'services',
         lazy: () => import('../pages/aisp/PgAISPServices').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'services/:transwiftId',
         lazy: () => import('../pages/aisp/PgAISPService').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'services/create',
         lazy: () => import('../pages/aisp/PgAISPServiceForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      {
         path:'services/:transwiftId/edit/',
         lazy: () => import('../pages/aisp/PgAISPServiceForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      {
         path:'services/:transwiftId/destroy',
         //action: lasRolesDestroy,
      },

      // Password Change
      {  path:'changepwd',
         lazy: () => import('../pages/aisp/PgAISPPasswordForm').then(m => ({ Component: m.default, action: m.action })),
      },


   ]
}

export default AISRoute