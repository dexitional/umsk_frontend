import React from "react";
import { LuLoaderCircle } from "react-icons/lu";
import Logo from "../assets/img/logo.webp";

type Props = {
  // children: React.ReactNode
};

function Loader({}: Props) {
  // const navigation = useNavigation();
  // const pathname:any = navigation.location?.pathname;
  // return ShimRenderer(pathname, children);
  return (
    <div className="z-20 fixed top-0 left-0 h-screen w-full bg-primary/50 backdrop-blur-[1px] bg-opacity-5 flex items-start justify-center">
      {/* <div className="z-20 fixed top-0 left-0 h-screen w-full bg-white opacity-50 flex items-start justify-center"> */}
      {/* Default Spinner */}
      {/* <BiLoaderCircle className="p-1 mt-[35vh] h-12 w-12 bg-white shadow shadow-primary-accent/40 rounded-full text-primary-accent/60 animate-spin" /> */}
      {/* Custom Spinner */}
      <div className="absolute w-fit top-48 -translate-x-[1/2] left-1/2 flex items-center justify-center animate-spin bg-white  bg-opacity-90 backdrop-blur-sm rounded-full">
        <LuLoaderCircle className="h-20 w-20  text-primary-dark animate-pulse" />
        <LuLoaderCircle className="absolute h-12 w-12 -rotate-180 text-primary animate-pulse" />
        <div className="absolute h-9 w-9 overflow-hidden rounded-full flex items-center justify-center">
          <img src={Logo} className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}

export default Loader;
