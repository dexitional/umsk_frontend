import React, { lazy, memo, Suspense, useMemo } from 'react';
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom";
const Login = lazy(() => import('./pages/Login'));
const Home = lazy(() => import('./pages/Home2'));
const Guide = lazy(() => import('./pages/Guide'));
const MobileLanding = lazy(() => import('./pages/mobile/MobileLanding'));
const PrivacyPolicy = lazy(() => import('./pages/mobile/PrivacyPolicy'));

import { Toaster } from 'react-hot-toast';
import Loader from './components/Loader';
import AISPRoute from './routes/AISPRoute';
import AISRoute from './routes/AISRoute';
import EVSRoute from './routes/EVSRoute';
import FMSRoute from './routes/FMSRoute';
import PrintRoute from './routes/PrintRoute';
import { useUserStore } from './utils/authService';
import { ErrorBoundary } from './pages/ErrorRoot';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchInterval: 30000, // Global poll every 30 seconds
      retry: 3, // Retry failed fetches 3 times before showing error
    },
  },
});

const App = memo(() => {
   const { isAuthenticated, user } = useUserStore(state => state);
   const router = useMemo(() => createBrowserRouter([
         
    // Public Routes
    // { path: "/", element: <Navigate to={{ pathname: isAuthenticated() ? '/dash' : '/login' }} replace />,  },
    { path: "/", element: <Navigate to={{ pathname: '/dash' }} replace />,  },
    { path: "/mobile", element: <Suspense fallback={<Loader/>}><MobileLanding /></Suspense> },
    { path: "/mobile/privacy", element: <Suspense fallback={<Loader/>}><PrivacyPolicy /></Suspense> },
    // { path: "/login", element: isAuthenticated() ? user?.user?.group_id == 1 ? <Navigate to={{ pathname:'/evs/dash'}} replace /> : user?.user?.group_id == 3 ? <Navigate to={{ pathname:'/amsp/dash' }} replace /> : <Navigate to={{ pathname:'/dash'}} replace /> : <Login /> },

    /*
    //  Maintenance Mode
    { path: "/login", element: isAuthenticated() ? user?.user?.group_id == 1 ? <Navigate to={{ pathname:'/aisp/profile'}} replace /> : user?.user?.group_id == 3 ? <Navigate to={{ pathname:'/amsp/dash' }} replace /> : <Navigate to={{ pathname:'/dash'}} replace /> : <Maintenance /> },
    { path: "/admin", element: isAuthenticated() ? user?.user?.group_id == 1 ? <Navigate to={{ pathname:'/aisp/profile'}} replace /> : user?.user?.group_id == 3 ? <Navigate to={{ pathname:'/amsp/dash' }} replace /> : <Navigate to={{ pathname:'/dash'}} replace /> : <Login /> },
    */

    // Live Mode
    { path: "/login", element: isAuthenticated() ? user?.user?.group_id == 1 ? <Navigate to={{ pathname:'/aisp/dash'}} replace /> : <Navigate to={{ pathname:'/dash'}} replace /> : <Login /> },
    // Protected Routes
    { 
      element: isAuthenticated() ? <Outlet/> : <Navigate to={{ pathname:'/login'}} replace />,
      errorElement: ErrorBoundary,
      children:[
        //  { path: "dash", element: user?.user?.group_id == 1 ? <Navigate to={{ pathname:'/evs/dash'}} replace /> : user?.user?.group_id == 3 ? <Navigate to={{ pathname:'/amsp/dash' }} replace /> : <Suspense fallback={<Loader/>}><Home /></Suspense> },
         { path: "dash", element: user?.user?.group_id == 1 ? <Navigate to={{ pathname:'/aisp/dash'}} replace /> : <Suspense fallback={<Loader/>}><Home /></Suspense> },
         /* OPERATIONAL GUIDE — any authenticated user (staff, student, or applicant) */
         { path: "guide", element: <Suspense fallback={<Loader/>}><Guide /></Suspense> },
         /* STUDENT PORTAL ROUTE */
         {...AISPRoute },
         /* ACADEMIC SYSTEM ROUTE */
         {...AISRoute },
         /* FINANCE SYSTEM ROUTE */
         {...FMSRoute },
         /* ELECTA SYSTEM ROUTE */
         {...EVSRoute },
         /* PRINT LAYOUT & ROUTE */
         {...PrintRoute },
      ]
    },
    { path: "*", element: isAuthenticated() ? <Navigate to={{ pathname:'/dash'}} replace /> : <Navigate to={{ pathname:'/login'}} replace /> },
  ],
  {
    future: {
      v7_startTransition: true,
    },
  }
  ), [isAuthenticated, user]);

  return (
     <QueryClientProvider client={queryClient}>
        <Toaster />
        <RouterProvider router={router} />
     </QueryClientProvider>
   );
});

export default App;
