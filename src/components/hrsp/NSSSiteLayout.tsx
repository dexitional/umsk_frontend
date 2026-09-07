import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../Footer";
import HeaderLogin from "../HeaderLogin";

type Props = {
  children: React.ReactNode;
};

function NSSSiteLayout({ children }: Props) {
  return (
    <div className="w-full h-screen flex flex-col">
      <HeaderLogin />

      <main className="w-full flex flex-col overflow-y-scroll">
        <section className="md:mx-auto w-full md:max-w-5xl">
          <div className="flex-1 md:min-h-fit">
            <Outlet />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default NSSSiteLayout;
