import React from "react";
import { useLoaderData } from "react-router-dom";
import FeeListView from "../../components/aisp/FeeListView";
import PageTitle from "../../components/las/PageTitle";
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
  console.log(data);

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title="Fees & Charges"
        createtext=""
        createlink=""
        setView={() => null}
        view={""}
      />
      <div className="">
        <FeeListView data={data} />
      </div>
    </div>
  );
}

export default PgAISPFees;
