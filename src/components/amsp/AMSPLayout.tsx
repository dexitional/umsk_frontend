import React from "react";
import { Outlet, useNavigation } from "react-router-dom";
import { useUserStore } from "../../utils/authService";
import Footer from "../Footer";
import Header from "../Header";
import Loader from "../Loader";
import AMSPRoleNav from "./AMSPRoleNav";

type Props = {
  children?: React.ReactNode;
};

function AMSPLayout({ children }: Props) {
  const navigation = useNavigation();
  const loading = navigation.state === "loading";
  const { logout, user } = useUserStore((state) => state);

  return (
    <div className="w-full h-screen flex flex-col justify-between bg-slate-100">
      <Header user={user} logout={logout} />
      <AMSPRoleNav user={user} />
      <main className="w-full flex-1 flex flex-col md:overflow-y-scroll">
        <section className="md:mx-auto w-full md:max-w-7xl flex">
          {/* <div className="my-8 py-10 z-20 w-56 h-fit rounded-[2rem] bg-primary/80 hidden md:flex flex-col space-y-3">
              <AMSPLogoBox />
              <AMSPNav user={user} />
            </div> */}
          <div className={`${loading && "overflow-hidden"} flex-1`}>
            {loading && <Loader />}
            <Outlet />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default AMSPLayout;
