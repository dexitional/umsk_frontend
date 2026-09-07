import React from "react";
import AMSPLayout from "../components/amsp/AMSPLayout";
import AMSPSwitcher, {
  loader as switchLoader,
} from "../components/amsp/AMSPSwitcher";
import Error from "../pages/Error";
import { useUserStore } from "../utils/authService";

const user = useUserStore.getState().user;
// const dricRole = user?.roles?.find(r => r?.app_tag?.toLowerCase() == 'dric')

const AMSPRoute: any = {
  path: "amsp",
  errorElement: <Error />,
  element: <AMSPLayout />,
  children: [
    {
      element: <AMSPSwitcher />,
      loader: switchLoader,
      children: [
        {
          path: "dash",
          lazy: () => import("../pages/amsp/PgStepConfigure").then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
          children: [
            {
              element: <div></div>,
              index: true,
            },
            {
              path: "form",
              lazy: async () => {
                const [form, review] = await Promise.all([
                  import("../pages/amsp/PgStepPrintForm"),
                  import("../pages/amsp/PgStepReview"),
                ]);
                return { Component: form.default, loader: review.loader };
              },
            },
            {
              path: "letter",
              lazy: () => import("../pages/amsp/PgStepPrintLetter").then(m => ({ Component: m.default, loader: m.loader })),
            },
          ],
        },
        {
          path: "profile",
          lazy: () => import("../pages/amsp/PgStepProfile").then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
        },
        {
          path: "guardian",
          lazy: () => import("../pages/amsp/PgStepGuardian").then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
        },
        {
          path: "education",
          lazy: () => import("../pages/amsp/PgStepEducation").then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
        },
        {
          path: "result",
          lazy: () => import("../pages/amsp/PgStepResult").then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
        },
        {
          path: "document",
          lazy: () => import("../pages/amsp/PgStepDocument").then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
        },
        {
          path: "choice",
          lazy: () => import("../pages/amsp/PgStepChoice").then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
        },
        {
          path: "employment",
          lazy: () => import("../pages/amsp/PgStepEmployment").then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
        },
        {
          path: "referee",
          lazy: () => import("../pages/amsp/PgStepReferee").then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
        },
        {
          path: "review",
          lazy: () => import("../pages/amsp/PgStepReview").then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
        },
      ],
    },
  ],
};

export default AMSPRoute;
