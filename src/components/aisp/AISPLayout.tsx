import React, { useEffect, useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import { Outlet, useLocation, useNavigation } from "react-router-dom";
import { useUserStore } from "../../utils/authService";
import { AISPCrest } from "./AISPPhotoBlend";
import AISPSidebar from "./AISPSidebar";
import AISPTopbar from "./AISPTopbar";

type Props = {
  children?: React.ReactNode;
};

function AISPLayout({ children }: Props) {
  const navigation = useNavigation();
  const loading = navigation.state === "loading";
  const { logout, user, switchUser, tag } = useUserStore((state) => state);
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => setDrawerOpen(false), [pathname]);

  const signout = async () => {
    if (window.confirm("Log Out?")) {
      await logout();
      window.location.reload();
    }
  };

  // An admin viewing the portal as a student (tag holds their own account).
  const impersonating = !!tag && tag != user?.user?.tag;
  const switchBack = async (e: React.MouseEvent) => {
    try {
      e.preventDefault();
      await switchUser(tag);
      window.location.href = "/";
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen w-full flex bg-[#f5f7fb] font-jakarta text-slate-800 antialiased">
      {/* Route-loading bar */}
      {loading ? (
        <div className="fixed inset-x-0 top-0 z-[60] h-0.5 overflow-hidden bg-sky-100">
          <div className="aisp-progress h-full w-1/3 rounded-full bg-gradient-to-r from-sky-400 via-primary to-indigo-500" />
        </div>
      ) : null}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <AISPSidebar user={user} onSignout={signout} />
      </aside>

      {/* Mobile drawer */}
      <div className={`lg:hidden fixed inset-0 z-50 ${drawerOpen ? "" : "pointer-events-none"}`} aria-hidden={!drawerOpen}>
        <div
          onClick={() => setDrawerOpen(false)}
          className={`absolute inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity duration-300 ${drawerOpen ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`absolute inset-y-0 left-0 w-[19rem] max-w-[85vw] shadow-2xl transition-transform duration-300 ease-out ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <AISPSidebar user={user} onSignout={signout} onNavigate={() => setDrawerOpen(false)} />
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
            className="absolute top-7 right-4 h-9 w-9 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10"
          >
            <HiOutlineXMark className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        <main className="relative flex-1 overflow-y-auto aisp-aurora">
          <AISPCrest className="!fixed -bottom-24 -right-20 w-[30rem] opacity-[0.035] grayscale" />
          <AISPTopbar
            user={user}
            impersonating={impersonating}
            onMenu={() => setDrawerOpen(true)}
            onSignout={signout}
            onSwitchBack={switchBack}
          />
          {/* min-w-0 keeps wide page content scrolling within the page
              instead of stretching the whole layout. */}
          <div className={`relative mx-auto w-full max-w-7xl min-w-0 px-4 md:px-8 py-6 md:py-10 transition-opacity duration-200 ${loading ? "opacity-60" : ""}`}>
            <Outlet />
          </div>
          <footer className="relative mx-auto w-full max-w-7xl px-4 md:px-8 pb-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
            <span>&copy; {new Date().getFullYear()} AKATSICO · Student Portal</span>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>Terms of Use</span>
              <span>Security</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default AISPLayout;
