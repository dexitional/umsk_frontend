import React from "react";
import { useLoaderData } from "react-router-dom";
import FMSActionCard from "../../components/fms/FMSActionCard";
import Service from "../../utils/fmsService";

type Props = {};

export async function loader({ params }) {
  const data = await Service.fetchBill(params.billId);
  return { data };
}

function PgFMSBillAccount({}: Props) {
  const { data }: any = useLoaderData();

  return (
    <div className="flex w-full flex-1 flex-col space-y-8 md:space-y-8 ">
      <FMSActionCard data={data} />
    </div>
  );
}

export default PgFMSBillAccount;
