import React from 'react';
import FMSLayout from '../components/fms/FMSLayout';
import Error from '../pages/Error';
import { useUserStore } from '../utils/authService';

const user = useUserStore.getState().user
const fmsRole = user?.roles?.find(r => r?.app_tag?.toLowerCase() == 'fms')

const FMSRoute:any =  {
   path: "fms",
   element: <FMSLayout />,
   errorElement: <Error />,
   // action: chosenAction,
   children: [
      {  path:'dash',
         lazy: () => import('../pages/fms/PgFMSDash').then(m => ({ Component: m.default, loader: m.loader })),
         index: true
      },
      {  path:'reports',
         lazy: () => import('../pages/fms/PgFMSReport').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      /* Student Bills Module */
      {
         path:'bills',
         lazy: () => import('../pages/fms/PgFMSBills').then(m => ({ Component: m.default, loader: m.loader })),
         //index: true
      },
      {
         path:'bills/:billId',
         id:'billId',
         lazy: () => import('../pages/fms/PgFMSBill').then(m => ({ Component: m.default, loader: m.loader })),
         children: [
            {
               path:'actions',
               lazy: () => import('../pages/fms/PgFMSBillAccount').then(m => ({ Component: m.default, loader: m.loader })),
               index: true
            },
            {
               path:'receivers',
               lazy: () => import('../pages/fms/PgFMSBillReceiver').then(m => ({ Component: m.default, loader: m.loader })),
            },
            {
               path:'activity',
               lazy: () => import('../pages/fms/PgFMSBillActivity').then(m => ({ Component: m.default, loader: m.loader })),
            }
         ]
      },
      {
         path:'bills/create',
         lazy: () => import('../pages/fms/PgFMSBillForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      {
         path:'bills/:billId/destroy',
         lazy: () => import('../pages/fms/PgFMSBills').then(m => ({ action: m.action })),
      },
      {
         path:'bills/:billId/edit',
         lazy: () => import('../pages/fms/PgFMSBillForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },


      /* Student Charges Module */
      {
         path:'charges',
         lazy: () => import('../pages/fms/PgFMSCharges').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'charges/create',
         lazy: () => import('../pages/fms/PgFMSChargeForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      {
         path:'charges/:chargeId/destroy',
         lazy: () => import('../pages/fms/PgFMSCharges').then(m => ({ action: m.action })),
      },
      {
         path:'charges/:chargeId/edit',
         lazy: () => import('../pages/fms/PgFMSChargeForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },

      /* Student Accounts Module */
      {
         path:'accounts',
         lazy: () => import('../pages/fms/PgFMSAccounts').then(m => ({ Component: m.default, loader: m.loader })),
         index: true
      },
      {
         path:'accounts/:accountId',
         id:'accountSid',
         lazy: () => import('../pages/fms/PgFMSStudentFinance').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'accounts/:accountId/retire',
         lazy: () => import('../pages/ams/PgAMSVouchers').then(m => ({ action: m.action })),
      },
      {
         path:'accounts/:accountId/fine',
         lazy: () => import('../pages/fms/PgFMSStudentFinance').then(m => ({ action: m.action })),
      },

      /* Student Debtors Module */
      {
         path:'debtors',
         lazy: () => import('../pages/fms/PgFMSDebts').then(m => ({ Component: m.default, loader: m.loader })),
      },

      /* Fees Payments Module */
      {
         path:'payments',
         lazy: () => import('../pages/fms/PgFMSPayments').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'payments/create',
         lazy: () => import('../pages/fms/PgFMSPaymentForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      {
         path:'payments/:paymentId',
         lazy: () => import('../pages/fms/PgFMSPayment').then(m => ({ Component: m.default, loader: m.loader })),
      },
      // { 
      //    path:'payments/:paymentId/destroy', 
      //    action: amsShortlistDestroy,
      // },
      // { 
      //    path:'payments/:paymentId/process', 
      //    element: <PgAMSShortlistForm />, 
      //    loader: amsShortlistFormLoader,
      //    action: amsShortlistFormAction
      // },

       /* Other Payments Module */
       {
         path:'transacts',
         lazy: () => import('../pages/fms/PgFMSTransacts').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'transacts/create',
         lazy: () => import('../pages/fms/PgFMSTransactForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      // {
      //    path:'transacts/:transactId',
      //    element: <PgAMSMatriculant />,
      //    loader: amsMatriculantLoader,
      // },
      // {
      //    path:'transacts/:transactId/destroy',
      //    action: amsMatriculantDestroy,
      // },

      /* Voucher Payments/Sales Module */
      {
         path:'vsales',
         lazy: () => import('../pages/fms/PgFMSVouchers').then(m => ({ Component: m.default, loader: m.loader })),
      },

      /* Service Costs Module */
      {
         path:'services',
         lazy: () => import('../pages/fms/PgFMSScosts').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'services/create',
         lazy: () => import('../pages/fms/PgFMSScostForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      {
         path:'services/:serviceId/destroy',
         lazy: () => import('../pages/fms/PgFMSScosts').then(m => ({ action: m.action })),
      },
      {
         path:'services/:serviceId/edit',
         lazy: () => import('../pages/fms/PgFMSScostForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },

      /* Voucher Costs Module */
      {
         path:'vcosts',
         lazy: () => import('../pages/fms/PgFMSVcosts').then(m => ({ Component: m.default, loader: m.loader })),
      },
      {
         path:'vcosts/create',
         lazy: () => import('../pages/fms/PgFMSVcostForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      {
         path:'vcosts/:costId/edit',
         lazy: () => import('../pages/fms/PgFMSVcostForm').then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      {
         path:'vcosts/:costId/destroy',
         lazy: () => import('../pages/fms/PgFMSVcosts').then(m => ({ action: m.action })),
      }


   ]
}

export default FMSRoute