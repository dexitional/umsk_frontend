import React from "react";
import { IconType } from "react-icons";
import { HiOutlineInbox } from "react-icons/hi2";

type Props = {
  title: string;
  message?: string;
  Icon?: IconType;
};

function AISPEmpty({ title, message, Icon = HiOutlineInbox }: Props) {
  return (
    <div className="py-14 px-6 flex flex-col items-center text-center">
      <div className="relative mb-4">
        <div className="absolute inset-0 rounded-3xl bg-sky-200/50 blur-xl" />
        <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-white to-sky-50 ring-1 ring-sky-100 text-sky-500 flex items-center justify-center shadow-sm">
          <Icon className="h-7 w-7" />
        </div>
      </div>
      <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      {message ? <p className="mt-1 max-w-sm text-xs text-slate-400">{message}</p> : null}
    </div>
  );
}

export default AISPEmpty;
