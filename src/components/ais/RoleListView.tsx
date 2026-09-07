import React from "react";
import RoleListItem from "./RoleListItem";

type Props = {
  data: any;
};

function RoleListView({ data }: Props) {
  return (
    <div className="py-2 grid grid-cols-1 border bg-white rounded-xl overflow-hidden">
      <div className="px-6 py-3 hidden md:grid grid-cols-6 gap-x-2 border-b border-slate-200 bg-primary/5 text-xs text-primary-dark/70 font-roboto font-semibold uppercase tracking-widest">
        <div className="col-span-2">User</div>
        <div>Permission</div>
        <div>Context</div>
        <div>Assigned Date</div>
        <div>Action</div>
      </div>
      <div className="grid grid-cols-1">
        {data?.length
          ? data.map((row: any) => <RoleListItem key={row.id} data={row} />)
          : (
            <h1 className="py-10 w-full text-center text-gray-400 text-[0.65rem] font-semibold tracking-widest uppercase">
              No Records ...
            </h1>
          )}
      </div>
    </div>
  );
}

export default RoleListView;
