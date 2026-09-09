import React from 'react';

import PrintLayout from '../components/print/PrintLayout';
import Error from '../pages/Error';
import { useUserStore } from '../utils/authService';

const user = useUserStore.getState().user
const isAuthenticated = useUserStore.getState().isAuthenticated

const evsRole = user?.roles?.find(r => r?.app_tag?.toLowerCase() == 'evs')

const PublicRoute:any =   {
   path: "print",
   element: <PrintLayout />,
   errorElement: <Error />,
   children: [
      // Registration Slip
      {  path:'registration',
         lazy: () => import('../components/print/PrintRegisterSlip').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {  path:'registration/:registrationId',
         lazy: () => import('../components/print/PrintRegisterSlip').then(m => ({ Component: m.default, loader: m.loader })),
      },

      // Transwift
      {  path:'transwift/:studentId/statement',
         lazy: () => import('../components/print/PrintTranscript').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {  path:'transwift/:studentId/proficiency',
         lazy: () => import('../components/print/PrintAdmissionSlip').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {  path:'transwift/:studentId/attestation',
         lazy: () => import('../components/print/PrintAdmissionSlip').then(m => ({ Component: m.default, loader: m.loader })),
      },
      // Evaluation
      {  path:'evaluation/:studentId',
         lazy: () => import('../components/print/PrintEvaluation').then(m => ({ Component: m.default, loader: m.loader })),
      },

   ]
}


export default PublicRoute