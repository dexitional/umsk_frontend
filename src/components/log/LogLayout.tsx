import React from "react";
import { HiOutlineLockClosed, HiOutlineShieldCheck } from "react-icons/hi2";
import { Link, Outlet, useNavigation } from "react-router-dom";
import { useUserStore } from "../../utils/authService";
import { secondaryButton } from "../management/ManagementUI";
import Header from "../Header";

export const hasLogAccess = (user: any) => !!user?.roles?.some((r: any) => r?.role === "audit::admin");

function LogLayout() {
  const { user, logout } = useUserStore((state) => state);
  const navigation = useNavigation();
  const loading = navigation.state === "loading";

  return (
    <div className="w-full h-screen flex flex-col bg-white text-slate-800">
      <Header user={user} logout={logout} />
      {loading ? (
        <div className="fixed inset-x-0 top-0 z-[60] h-0.5 overflow-hidden bg-sky-100">
          <div className="aisp-progress h-full w-1/3 rounded-full bg-gradient-to-r from-blue-400 via-primary to-secondary-accent" />
        </div>
      ) : null}
      <main className="flex-1 overflow-y-auto bg-gradient-to-b from-blue-50/40 via-white to-white">
        {hasLogAccess(user) ? (
          <Outlet />
        ) : (
          <div className="mx-auto max-w-md mt-24 px-6 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-200/60 bg-gradient-to-br from-white to-blue-100 text-primary">
              <HiOutlineLockClosed aria-hidden="true" className="h-7 w-7" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-primary">Log Module is restricted</h1>
            <p className="text-sm text-slate-500">
              Only users with the <span className="font-mono text-slate-700">audit::admin</span> role can view system logs.
            </p>
            <Link to="/dash" className={secondaryButton}>
              <HiOutlineShieldCheck className="h-4 w-4" /> Back to dashboard
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default LogLayout;
