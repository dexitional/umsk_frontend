import React from "react";
import { IconType } from "react-icons";
import { NavLink } from "react-router-dom";

type Props = {
  title: string;
  url?: string;
  Icon: IconType;
  [key: string]: any;
};

// Rendered on the dark sidebar/drawer surface.
function AISPNavItem({ title, url = "/", Icon, ...rest }: Props) {
  return (
    <NavLink
      {...rest}
      to={url}
      className={({ isActive }) =>
        `group relative h-11 px-4 rounded-2xl flex items-center gap-3.5 text-sm transition-all ${
          isActive
            ? "bg-white/[0.09] text-white font-semibold ring-1 ring-inset ring-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
            : "text-white/60 font-medium hover:text-white hover:bg-white/[0.05]"
        }`
      }
      children={({ isActive }) => (
        <>
          <span
            className={`absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-sky-400 shadow-[0_0_12px_2px_rgba(56,189,248,0.55)] transition-opacity ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          />
          <Icon
            className={`h-5 w-5 shrink-0 transition-colors ${
              isActive ? "text-sky-300" : "text-white/[0.45] group-hover:text-white/80"
            }`}
          />
          <span className="truncate">{title}</span>
        </>
      )}
    />
  );
}

export default AISPNavItem;
