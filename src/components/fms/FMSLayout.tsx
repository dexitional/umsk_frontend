import React from "react";
import { Outlet, useNavigation } from "react-router-dom";
import { useUserStore } from "../../utils/authService";
import Footer from "../Footer";
import Header from "../Header";
import Loader from "../Loader";
import FMSLogoBox from "./FMSLogoBox";
import FMSNav from "./FMSNav";
import FMSRoleNav from "./FMSRoleNav";

type Props = {
  children?: React.ReactNode;
};

function FMSLayout({ children }: Props) {
  const navigation = useNavigation();
  const loading = navigation.state === "loading";
  const { logout, user } = useUserStore((state) => state);

  return (
    <div className="w-full h-screen flex flex-col justify-between">
      <Header user={user} logout={logout} />
      <FMSRoleNav user={user} />
      <main className="w-full flex-1 flex flex-col md:overflow-y-scroll">
        <section className="md:mx-auto w-full md:max-w-7xl flex">
          <div className="z-20 w-56 h-full bg-gradient-to-r from-white to-primary/5 bg-opacity-5 hidden md:flex flex-col space-y-1">
            <FMSLogoBox />
            <FMSNav user={user} />
          </div>
          {/* min-w-0 alongside flex-1: flex-1 sets flex-basis:0%, but this
              item's default min-width:auto still floors it at its content's
              width, so a page that renders anything wider than the viewport
              (e.g. a horizontally-scrollable chart) stretches this whole
              layout instead of clipping/scrolling within its own page. */}
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

export default FMSLayout;
