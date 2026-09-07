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

function NSSNavItem({ title, url = "/", Icon, ...rest }: Props) {
  return (
    <NavLink
      {...rest}
      to={url}
      className={({ isActive, isPending }) =>
        isActive
          ? `md:ml-6 px-10 md:px-4 py-3 flex items-center space-x-2 bg-white rounded-l-3xl  `
          : `ml-6 px-4 py-3 flex items-center space-x-2`
      }
      children={({ isActive }) => {
        return (
          <>
            <Icon
              className={
                isActive
                  ? `h-5 w-5 rounded text-blue-950/80 `
                  : `h-5 w-5 text-red-100 `
              }
            />
            <span
              className={
                isActive
                  ? `text-blue-950/80 font-semibold`
                  : `text-gray-300 font-light`
              }
            >
              {title}
            </span>
          </>
        );
      }}
    />
  );
}

export default NSSNavItem;
