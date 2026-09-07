import React from "react";
import { useLoaderData } from "react-router-dom";
import AISGraduateActionCard from "../../components/ais/AISGraduateActionCard";
import Service from "../../utils/aisService";

type Props = {};

export async function loader({ params }) {
  const data = await Service.fetchSheet(params.sheetId);
  const isUser = await Service.checkUser(params.staffId);
  return { data, isUser };
}

function PgAISGraduateSessionAction({}: Props) {
  const { data, isUser }: any = useLoaderData();
  console.log(isUser);
  return (
    <div className="flex w-full flex-1 flex-col space-y-8 md:space-y-8 ">
      <AISGraduateActionCard data={data} isUser={isUser} />
    </div>
  );
}

export default PgAISGraduateSessionAction;
