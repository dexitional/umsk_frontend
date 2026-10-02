import React from "react";
import { HiOutlineDocumentText, HiOutlineInformationCircle } from "react-icons/hi2";
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
    <div className="space-y-6 md:space-y-8">
      <AISPPageHeader photo="gate"
        eyebrow="Services"
        title="Service Requests"
        subtitle="Track transcripts, certificates and other document requests."
        Icon={HiOutlineDocumentText}
      />
      <div className="aisp-rise p-4 md:p-5 rounded-2xl bg-sky-50/70 ring-1 ring-inset ring-sky-100 flex items-start gap-3">
        <HiOutlineInformationCircle className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm text-slate-600">
            Document requests are created automatically after payment at the
            bank or via USSD. Please update the request with the recipient
            information.
          </p>
          <p className="text-sm font-semibold text-slate-800">
            Completed requests are available for pickup or mailed
            electronically to the provided recipient email address.
          </p>
        </div>
      </div>
      <ServiceListView data={data} />
    </div>
  );
}

export default PgAISPServices;
