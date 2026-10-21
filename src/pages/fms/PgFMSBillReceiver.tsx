import { requestError } from "../../utils/requestError";
import React from "react";
import { BsActivity } from "react-icons/bs";
import { useLoaderData, useRevalidator } from "react-router-dom";
import AISStudentCard from "../../components/ais/AISStudentCard";
import Service from "../../utils/fmsService";

type Props = {};

export async function loader({ params }) {
  try {
    const data = await Service.billReceivers(params.billId);
    return { data, error: null };
  } catch (error) {
    return { data: [], error: requestError(error, 'Bill receivers could not be loaded.') };
  }
}

function PgFMSBillReceiver({}: Props) {
  const { data, error }: any = useLoaderData();
  const revalidator = useRevalidator();
  if (error) return <div role="alert" className="p-6 rounded-xl border border-red-200 space-y-3">
    <p>{error}</p>
    <button type="button" disabled={revalidator.state !== 'idle'} onClick={() => revalidator.revalidate()} className="px-4 py-2 rounded border">Retry</button>
  </div>;

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center space-y-8 md:space-y-8 ">
      <div className="flex w-full flex-1 flex-col space-y-8 md:space-y-10 ">
        {data?.length > 0 && (
          <AISStudentCard
            key={``}
            title={`BILL RECEIVERS`}
            data={data.map((r: any) => r.student).filter(Boolean)}
          />
        )}
        {!data?.length ? (
          <div className="p-10 border border-primary/10 rounded-xl flex flex-col items-center justify-center space-y-3">
            <BsActivity className="h-14 w-14 text-primary/30 border rounded-md" />
            <span className="text-xs text-primary/40 font-medium">
              No Receivers
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default PgFMSBillReceiver;
