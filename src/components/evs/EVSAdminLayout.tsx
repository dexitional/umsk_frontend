import React from "react";
import { Outlet, useNavigation } from "react-router-dom";
import { useUserStore } from "../../utils/authService";
import Loader from "../Loader";
import EVSLogoBox from "./EVSLogoBox";
import EVSNav from "./EVSNav";
import EVSRoleNav from "./EVSRoleNav";

type Props = {
  children?: React.ReactNode;
};

function EVSAdminLayout({ children }: Props) {
  const navigation = useNavigation();
  const loading = navigation.state === "loading";
  const { logout, user } = useUserStore((state) => state);

  return (
    <div className="w-full h-screen flex flex-col justify-between">
      <EVSRoleNav user={user} />
      <main className="w-full flex-1 flex flex-col md:overflow-y-scroll">
        <section className="md:mx-auto w-full md:max-w-7xl flex">
          <div className="z-20 w-56 h-full bg-gradient-to-r from-white to-primary/5 bg-opacity-5 hidden md:flex flex-col space-y-1">
            <EVSLogoBox />
            <EVSNav user={user} />
          </div>
          <div className={`${loading && "overflow-hidden"} flex-1`}>
            {loading && <Loader />}
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
}

export default EVSAdminLayout;
