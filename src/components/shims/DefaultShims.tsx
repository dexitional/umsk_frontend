import React from "react";
import { LuLoaderCircle } from "react-icons/lu";
import { useNavigation } from "react-router-dom";
import Logo from "../../assets/img/logo/aucc/spin.png";
type Props = {
  children: React.ReactNode;
};

function DefaultShims({ children }: Props) {
  const navigation = useNavigation();
  const loading = navigation.state === "loading";
  return (
    <div className="relative h-full w-full">
      <div className="h-full w-full">{children}</div>
      {loading && (
        <div className="absolute w-fit top-48 -translate-x-[1/2] left-1/2 flex items-center justify-center animate-spin bg-white  bg-opacity-5 backdrop-blur-sm rounded-full">
          <LuLoaderCircle className="h-20 w-20  text-primary-dark animate-pulse" />
          <LuLoaderCircle className="absolute h-12 w-12 -rotate-180 text-primary animate-pulse" />
          <div className="absolute h-9 w-9 overflow-hidden rounded-full flex items-center justify-center">
            <img src={Logo} className="h-8 w-8" />
          </div>
        </div>
      )}
    </div>
  );
}

export default DefaultShims;
