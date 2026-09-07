import React from "react";
import { NavLink } from "react-router-dom";

type Props = {
  url: string;
  title: string;
};

function SubNavLink({ url, title }: Props) {
  return (
    <NavLink
      to={url}
      className={({ isActive, isPending }) =>
        isActive
          ? `px-4 py-1 min-w-48 shadow-md rounded-md bg-primary-accent font-bold text-white`
          : `px-4 py-1 min-w-48 border border-primary/10 rounded-md bg-primary/10`
      }
      children={({ isActive }) => {
        return <>{title}</>;
      }}
    />
  );
}

export default SubNavLink;
