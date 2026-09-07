import React from "react";
import { useLoaderData } from "react-router-dom";
import AISSheetAccountCard from "../../components/ais/AISSheetAccountCard";
import Service from "../../utils/aisService";

type Props = {};

export async function loader({ params }) {
  const data = await Service.fetchSheet(params.sheetId);
  const isUser = await Service.checkUser(params.staffId);
  return { data, isUser };
}

function PgAISSheetAccount({}: Props) {
  const { data, isUser }: any = useLoaderData();
  return (
    <div className="flex w-full flex-1 flex-col space-y-8 md:space-y-8 ">
      <AISSheetAccountCard data={data} isUser={isUser} />
    </div>
  );
}

export default PgAISSheetAccount;
