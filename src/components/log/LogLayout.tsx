import React from "react";
import { HiOutlineLockClosed, HiOutlineShieldCheck } from "react-icons/hi2";
import { Link, Outlet, useNavigation } from "react-router-dom";
import { useUserStore } from "../../utils/authService";
import Header from "../Header";

export const hasLogAccess = (user: any) => !!user?.roles?.some((r: any) => r?.role === "audit::admin");

function LogLayout() {
  const { user, logout } = useUserStore((state) => state);
  const navigation = useNavigation();
  const loading = navigation.state === "loading";

  return (
    <div className="w-full h-screen flex flex-col bg-[#f5f7fb] font-jakarta text-slate-800">
      <Header user={user} logout={logout} />
      {loading ? (
        <div className="fixed inset-x-0 top-0 z-[60] h-0.5 overflow-hidden bg-sky-100">
          <div className="aisp-progress h-full w-1/3 rounded-full bg-gradient-to-r from-sky-400 via-primary to-indigo-500" />
        </div>
      ) : null}
      <main className="flex-1 overflow-y-auto aisp-aurora">
        {hasLogAccess(user) ? (
          <Outlet />
        ) : (
          <div className="mx-auto max-w-md mt-24 px-6 text-center space-y-4">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center">
              <HiOutlineLockClosed className="h-7 w-7" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Log Module is restricted</h1>
            <p className="text-sm text-slate-500">
              Only users with the <span className="font-mono text-slate-700">audit::admin</span> role can view system logs.
            </p>
            <Link to="/dash" className="aisp-btn-soft inline-flex">
              <HiOutlineShieldCheck className="h-4 w-4" /> Back to dashboard
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default LogLayout;
