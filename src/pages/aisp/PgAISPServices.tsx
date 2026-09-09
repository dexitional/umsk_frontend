import React from "react";
import { redirect, useLoaderData } from "react-router-dom";
import AISPPageHeader from "../../components/aisp/AISPPageHeader";
import ServiceListView from "../../components/aisp/ServiceListView";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";

type Props = {};
export async function action({ params }) {
  await Service.deleteTranswift(params.transwiftId);
  return redirect("/aisp/services");
}

export async function loader() {
  const user = useUserStore.getState().user;
  const data = await Service.fetchTranswiftByStudent(user?.user?.tag);
  return { data };
}

function PgAISPServices({}: Props) {
  const { data }: any = useLoaderData();

  return (
    <div className="p-4 md:p-0 space-y-6 md:space-y-8">
      <AISPPageHeader title="Service Requests" subtitle="Document and certificate requests" />
      <div className="p-4 rounded-2xl bg-secondary-accent/5 border border-secondary-accent/10 space-y-1.5">
        <p className="text-sm text-primary/80">
          Document requests are created automatically after payment at the
          bank or via USSD. Please update the request with the recipient
          information.
        </p>
        <p className="text-sm font-medium text-primary italic">
          Completed requests are available for pickup or mailed
          electronically to the provided recipient email address.
        </p>
      </div>
      <ServiceListView data={data} />
    </div>
  );
}

export default PgAISPServices;
