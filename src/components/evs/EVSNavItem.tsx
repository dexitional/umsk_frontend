import React from "react";
import { IconType } from "react-icons";
import { NavLink } from "react-router-dom";

type Props = {
  title: string;
  url?: string;
  Icon?: IconType;
  isActive?: boolean;
};

function EVSNavItem({ title, url = "/", Icon }: Props) {
  return (
    <NavLink
      to={url}
      className={({ isActive, isPending }) =>
        isActive
          ? `bg-primary-accent/30 text-primary block py-2 px-3.5 w-full rounded focus:ring-0 focus:outline-none font-bold text-sm text-left font-noto`
          : `bg-primary/80 text-white block py-2 px-3.5 w-full rounded focus:ring-0 focus:outline-none font-bold text-sm text-left font-noto`
      }
      children={({ isActive }) => {
        return <span>{title}</span>;
      }}
    />
  );
}

export default EVSNavItem;
