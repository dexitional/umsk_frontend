import React from "react";
import { Outlet, useNavigation } from "react-router-dom";
import { useUserStore } from "../../utils/authService";
import Footer from "../Footer";
import Header from "../Header";
import Loader from "../Loader";
import AISPLogoBox from "./AISPLogoBox";
import AISPNav from "./AISPNav";
import AISPRoleNav from "./AISPRoleNav";

type Props = {
  children?: React.ReactNode;
};

function AISPLayout({ children }: Props) {
  const navigation = useNavigation();
  const loading = navigation.state === "loading";
  const { logout, user } = useUserStore((state) => state);

  return (
    <div className="w-full h-screen flex flex-col justify-between bg-slate-50">
      <Header user={user} logout={logout} />
      <AISPRoleNav user={user} />
      <main className="w-full flex-1 flex flex-col md:overflow-y-scroll">
        <section className="md:mx-auto w-full md:max-w-7xl flex md:py-8 md:gap-6">
          <div className="md:sticky md:top-8 z-20 md:w-64 h-fit hidden md:flex flex-col gap-4">
            <AISPLogoBox />
            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm py-3">
              <AISPNav user={user} />
            </div>
          </div>
          {/* min-w-0 alongside flex-1: flex-1 sets flex-basis:0%, but this
              item's default min-width:auto still floors it at its content's
              width, so a page that renders anything wider than the viewport
              stretches this whole layout instead of clipping/scrolling
              within its own page. */}
          <div className={`${loading ? "overflow-hidden" : ""} flex-1 min-w-0`}>
            {loading && <Loader />}
            <Outlet />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default AISPLayout;
