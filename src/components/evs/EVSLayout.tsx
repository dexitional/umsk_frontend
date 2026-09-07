import React from "react";
import { Outlet, useNavigation } from "react-router-dom";
import { useUserStore } from "../../utils/authService";
import Footer from "../Footer";
import Header from "../Header";
import Loader from "../Loader";

type Props = {
  children?: React.ReactNode;
};

function EVSLayout({ children }: Props) {
  const navigation = useNavigation();
  const loading = navigation.state === "loading";
  const { logout, user } = useUserStore((state) => state);

  return (
    <div className="w-full h-screen flex flex-col">
      <Header user={user} logout={logout} />
      <main className="w-full flex flex-col overflow-y-scroll">
        <section>
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

export default EVSLayout;
