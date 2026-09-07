import React from "react";
import AMSLayout from "../components/ams/AMSLayout";
import Error from "../pages/Error";
import { useUserStore } from "../utils/authService";

const user = useUserStore.getState().user;
const amsRole = user?.roles?.find((r) => r?.app_tag?.toLowerCase() == "ams");

const AMSRoute: any = {
  path: "ams",
  element: <AMSLayout />,
  errorElement: <Error />,
  // action: chosenAction,
  children: [
    {
      path: "dash",
      lazy: () => import("../pages/ams/PgAMSDash").then(m => ({ Component: m.default, loader: m.loader })),
      index: true,
    },
    {
      path: "tools",
      lazy: () => import("../pages/ams/PgAMSTools").then(m => ({ Component: m.default })),
    },
    {
      path: "reports",
      lazy: () => import("../pages/ams/PgAMSReport").then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
    },
    /* Admission Session Module */
    {
      path: "sessions",
      lazy: () => import("../pages/ams/PgAMSSessions").then(m => ({ Component: m.default, loader: m.loader })),
    },
    {
      path: "sessions/create",
      lazy: () => import("../pages/ams/PgAMSSessionForm").then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
    },
    {
      path: "sessions/:sessionId/destroy",
      lazy: () => import("../pages/ams/PgAMSSessions").then(m => ({ action: m.action })),
    },
    {
      path: "sessions/:sessionId/edit",
      lazy: () => import("../pages/ams/PgAMSSessionForm").then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
    },

    /* Admission Letter Module */
    {
      path: "letters",
      lazy: () => import("../pages/ams/PgAMSLetters").then(m => ({ Component: m.default, loader: m.loader })),
    },
    {
      path: "letters/create",
      lazy: () => import("../pages/ams/PgAMSLetterForm").then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
    },
    {
      path: "letters/:letterId",
      lazy: () => import("../pages/ams/PgAMSLetter").then(m => ({ Component: m.default, loader: m.loader })),
    },
    {
      path: "letters/:letterId/destroy",
      lazy: () => import("../pages/ams/PgAMSLetters").then(m => ({ action: m.action })),
    },
    {
      path: "letters/:letterId/edit",
      lazy: () => import("../pages/ams/PgAMSLetterForm").then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
    },

    /* Vouchers Module */
    {
      path: "vouchers",
      lazy: () => import("../pages/ams/PgAMSVouchers").then(m => ({ Component: m.default, loader: m.loader })),
    },
    {
      path: "vouchers/create",
      lazy: () => import("../pages/ams/PgAMSVoucherForm").then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
    },
    {
      path: "vouchers/:voucherId/sell",
      lazy: () => import("../pages/ams/PgAMSVoucherSellForm").then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
    },
    {
      path: "vouchers/:voucherId/recover",
      lazy: () => import("../pages/ams/PgAMSVouchers").then(m => ({ action: m.action })),
    },
    {
      path: "vouchers/:voucherId/reset",
      lazy: () => import("../pages/ams/PgAMSVouchers").then(m => ({ action: m.action })),
    },

    /* Applicant Module */
    {
      path: "applicants",
      lazy: () => import("../pages/ams/PgAMSApplicants").then(m => ({ Component: m.default })),
    },
    {
      path: "applicants/create",
      lazy: () => import("../pages/ams/PgAMSApplicantForm").then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
    },
    {
      path: "applicants/:applicantId",
      lazy: () => import("../pages/ams/PgAMSApplicant").then(m => ({ Component: m.default, loader: m.loader })),
    },
    {
      path: "applicants/:applicantId/shortlist",
      lazy: () => import("../pages/ams/PgAMSApplicant").then(m => ({ action: m.action })),
    },
    {
      path: "applicants/:applicantId/edit",
      lazy: () => import("../pages/ams/PgAMSApplicantForm").then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
    },

    /* Shortlist Module */
    {
      path: "shortlists",
      lazy: () => import("../pages/ams/PgAMSShortlists").then(m => ({ Component: m.default })),
    },
    {
      path: "shortlists/create",
      lazy: () => import("../pages/ams/PgAMSShortlistForm").then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
    },
    {
      path: "shortlists/:shortlistId",
      lazy: () => import("../pages/ams/PgAMSShortlist").then(m => ({ Component: m.default, loader: m.loader })),
    },
    {
      path: "shortlists/:shortlistId/destroy",
      lazy: () => import("../pages/ams/PgAMSShortlists").then(m => ({ action: m.action })),
    },
    {
      path: "shortlists/:shortlistId/reverse",
      lazy: () => import("../pages/ams/PgAMSMatriculants").then(m => ({ action: m.action })),
    },
    {
      path: "shortlists/:shortlistId/process",
      lazy: () => import("../pages/ams/PgAMSShortlistForm").then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
    },

    /* Matriculants Module */
    {
      path: "matriculants",
      lazy: () => import("../pages/ams/PgAMSMatriculants").then(m => ({ Component: m.default })),
    },
    {
      path: "matriculants/:matriculantId",
      lazy: () => import("../pages/ams/PgAMSMatriculant").then(m => ({ Component: m.default, loader: m.loader })),
    },
    {
      path: "matriculants/:matriculantId/edit",
      lazy: () => import("../pages/ams/PgAMSCorrectForm").then(m => ({ Component: m.default, loader: m.loader, action: m.action })),
    },
    {
      path: "matriculants/:matriculantId/destroy",
      lazy: () => import("../pages/ams/PgAMSMatriculants").then(m => ({ action: m.action })),
    },
  ],
};

export default AMSRoute;
