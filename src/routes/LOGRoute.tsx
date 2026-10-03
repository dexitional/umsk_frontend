import React from 'react';
import LogLayout from '../components/log/LogLayout';
import Error from '../pages/Error';

// Log Module (audit::admin) -- system-wide activity & audit trail.
const LOGRoute: any = {
   path: "logs",
   element: <LogLayout />,
   errorElement: <Error />,
   children: [
      {  index: true,
         lazy: () => import('../pages/log/PgLogs').then(m => ({ Component: m.default, loader: m.loader })),
      },
   ]
}

export default LOGRoute
