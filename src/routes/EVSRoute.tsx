import React from 'react';
// import EVSPage, { loader as pageLoader } from '../pages/evs/EVSPage';
import EVSPage from '../pages/evs/EVSPage';
import Error from '../pages/Error';
// import PgRegister, { loader as registerLoader } from '../components/evs/PgRegister';
import EVSAdminLayout from '../components/evs/EVSAdminLayout';
import EVSLayout from '../components/evs/EVSLayout';
// import PgEVSElection, { loader as adminElectionLoader } from '../pages/evs/PgEVSElection';

const EVSRoute:any =  {
   path: "evs",
   element: <EVSLayout />,
   errorElement: <Error />,
   //action: chosenAction,
   children: [
      // Dashboard
      {  path:'dash',
         lazy: () => import('../pages/evs/EVSDashPage').then(m => ({ Component: m.default, loader: m.loader })),
         index:true
      },

      // Election Portal
      {  path:':electionId',
         element: <EVSPage />,
         children: [
            {
               path:'vip',
               lazy: () => import('../components/evs/PgStrongroom').then(m => ({ Component: m.default })),
            },
            {
               path:'public',
               lazy: () => import('../components/evs/PgPublic').then(m => ({ Component: m.default })),
            },
            {
               // Real navigation targets this by explicit path (see
               // PgElectionCard.tsx's link to `/evs/:electionId/register`),
               // so it can't also be a pathless index route — react-router
               // ignores `path` on an index route and warns at runtime.
               path:'register',
               lazy: () => import('../components/evs/PgRegister').then(m => ({ Component: m.default })),
            },
            {
               path:'candidate',
               lazy: () => import('../components/evs/PgCandidate').then(m => ({ Component: m.default })),
            },
            {
               path:'control',
               lazy: () => import('../components/evs/PgControl').then(m => ({ Component: m.default })),
            },
            {
               path:'result',
               lazy: () => import('../components/evs/PgResult').then(m => ({ Component: m.default })),
            },

            // Voting Simulation
            {  path:'voting',
               lazy: () => import('../components/evs/PgVoting').then(m => ({ Component: m.default })),
            },
         ]
      },

      // Election Admin
      {  path:'admin',
         element: <EVSAdminLayout />,
         children: [
            {
               path:'elections',
               lazy: () => import('../pages/evs/PgEVSElections').then(m => ({ Component: m.default, loader: m.loader })),
            },
            {
               path:'elections/create',
               lazy: () => import('../pages/evs/PgEVSElectionForm').then(m => ({ Component: m.default })),
            },
            {
               path:'elections/:electionId',
               lazy: () => import('../pages/evs/PgEVSElection').then(m => ({ Component: m.default })),
               children: [
                  {
                     path:'portfolios',
                     children: [
                        // Portfolios
                        {
                           lazy: () => import('../pages/evs/PgEVSPortfolios').then(m => ({ Component: m.default })),
                           index: true
                        },
                        {
                           path:':portfolioId/edit',
                           lazy: () => import('../pages/evs/PgEVSPortfolioForm').then(m => ({ Component: m.default })),
                        },
                        {
                           path:'create',
                           lazy: () => import('../pages/evs/PgEVSPortfolioForm').then(m => ({ Component: m.default })),
                        }
                     ]
                  },
                  {
                     path:'candidates',
                     children: [
                        {
                           lazy: () => import('../pages/evs/PgEVSCandidates').then(m => ({ Component: m.default })),
                           index: true
                        },
                        {
                           path:'create',
                           lazy: () => import('../pages/evs/PgEVSCandidateForm').then(m => ({ Component: m.default })),
                        },
                        {
                           path:':candidateId/edit',
                           lazy: () => import('../pages/evs/PgEVSCandidateForm').then(m => ({ Component: m.default })),
                        }
                     ]
                  },
                  {
                     path:'voters',
                     lazy: () => import('../components/evs/PgRegister').then(m => ({ Component: m.default })),
                  },
                  {
                     path:'controls',
                     lazy: () => import('../components/evs/PgAdminControl').then(m => ({ Component: m.default })),
                  },
                  {
                     path:'stage',
                     lazy: () => import('../components/evs/PgCandidate').then(m => ({ Component: m.default })),
                  },

                  {
                     path:'results',
                     lazy: () => import('../components/evs/PgResult').then(m => ({ Component: m.default })),
                  },

               ]
            },
            {
               path:'elections/:electionId/edit',
               lazy: () => import('../pages/evs/PgEVSElectionForm').then(m => ({ Component: m.default })),
            }

         ]
      },
   ]
}

export default EVSRoute