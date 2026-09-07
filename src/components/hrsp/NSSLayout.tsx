import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../Footer";
import Header from "../Header";
import NSSLogoBox from "./NSSLogoBox";
import NSSNav from "./NSSNav";
import NSSRoleNav from "./NSSRoleNav";

type Props = {
  children: React.ReactNode;
};

function NSSLayout({ children }: Props) {
  return (
    <div className="w-full h-screen flex flex-col">
      <Header />
      <NSSRoleNav />
      <main className="w-full flex flex-col md:overflow-y-scroll">
        <section className="md:mx-auto w-full md:max-w-7xl flex">
          <div className="my-8 py-10 z-20 w-56 h-fit rounded-[2rem] bg-blue-950 hidden md:flex flex-col space-y-10">
            <NSSLogoBox />
            <NSSNav />
          </div>
          <div className="flex-1">
            <Outlet />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default NSSLayout;
