import React from "react";
import DepartmentCardItem from "./DepartmentCardItem";

type Props = {
  data: any;
};

// Department module: a grid of department cards.
function DepartmentListView({ data }: Props) {
  if (!data?.length) {
    return (
      <p className="rounded-2xl border border-dashed border-primary/20 bg-white px-4 py-12 text-center text-xs font-semibold uppercase tracking-widest text-primary/40">
        No departments yet
      </p>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 md:gap-6">
      {data.map((row: any) => (
        <DepartmentCardItem key={row.id} data={row} />
      ))}
    </div>
  );
}

export default DepartmentListView;
