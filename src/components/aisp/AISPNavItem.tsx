import React from "react";
import { IconType } from "react-icons";
import { NavLink } from "react-router-dom";

type Props = {
  title: string;
  url?: string;
  Icon: IconType;
  isActive?: boolean;
  // Menu.Item (headlessui) injects onClick/role/tabIndex/etc. onto whatever
  // component is passed via `as` — these must reach the underlying NavLink
  // for headlessui's own click handler (which closes the mobile dropdown)
  // to ever fire, otherwise only react-router's navigation happens.
  [key: string]: any;
};

function AISPNavItem({ title, url = "/", Icon, ...rest }: Props) {
  return (
    <NavLink
      {...rest}
      to={url}
      className={({ isActive }) =>
        `mx-3 px-4 py-3 rounded-xl flex items-center space-x-3.5 transition-colors ${
          isActive ? `` : `hover:bg-slate-50`
        }`
      }
      children={({ isActive }) => {
        return (
          <>
            <Icon
              className={`h-5 w-5 shrink-0 ${
                isActive ? `text-primary` : `text-slate-400`
              }`}
            />
            <span
              className={`font-quicksand text-[0.95rem] ${
                isActive
                  ? `text-primary font-bold`
                  : `text-slate-400 font-medium`
              }`}
            >
              {title}
            </span>
          </>
        );
      }}
    />
  );
}

export default AISPNavItem;
