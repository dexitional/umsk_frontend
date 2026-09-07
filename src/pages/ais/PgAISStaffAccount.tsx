import React from "react";
import { useLoaderData } from "react-router-dom";
import AISStaffAccountCard from "../../components/ais/AISStaffAccountCard";
import Service from "../../utils/aisService";

type Props = {};

export async function loader({ params }) {
  const data = await Service.fetchStaff(params.staffId);
  const isUser = await Service.checkUser(params.staffId);
  return { data, isUser };
}

function PgAISStaffAccount({}: Props) {
  const { data, isUser }: any = useLoaderData();
  
  return (
    <div className="flex w-full flex-1 flex-col space-y-8 md:space-y-8 ">
      <AISStaffAccountCard data={data} isUser={isUser} />
    </div>
  );
}

export default PgAISStaffAccount;
