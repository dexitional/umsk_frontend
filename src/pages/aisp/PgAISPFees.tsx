import React from "react";
import { useLoaderData } from "react-router-dom";
import AISPPageHeader from "../../components/aisp/AISPPageHeader";
import FeeListView from "../../components/aisp/FeeListView";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";

type Props = {};

export async function loader() {
  const user = useUserStore.getState().user;
  const data = await Service.fetchStudentFinance(user?.user?.tag);
  return { data };
}

function PgAISPFees({}: Props) {
  const { data }: any = useLoaderData();
  return (
    <div className="p-4 md:p-0 space-y-6 md:space-y-8">
      <AISPPageHeader title="Fees & Charges" subtitle="Your financial statement" />
      <FeeListView data={data} />
    </div>
  );
}

export default PgAISPFees;
