import React from "react";
import { useLoaderData } from "react-router-dom";
import Service from "../../utils/aisService";

type Props = {};

export async function loader({ params }) {
  const data = await Service.fetchStudent(params.studentId);
  return { data };
}

function PgAISStaffIDCard({}: Props) {
  const { data }: any = useLoaderData();

  return (
    <div className="flex w-full flex-1 flex-col space-y-8 md:space-y-8 ">
      <span className="font-semibold tracking-widest">
        No ID Card Template Installed
      </span>
    </div>
  );
}

export default PgAISStaffIDCard;
