import React from "react";
import { BsActivity } from "react-icons/bs";
import { redirect, useLoaderData } from "react-router-dom";
import AISResitCaptureCard from "../../components/ais/AISResitCaptureCard";
import Service from "../../utils/aisService";

type Props = {};

export async function action({ request, params }) {
  const id = params?.sessionId || 0;
  const formData = await request.formData();
  let data = Object.fromEntries(formData);
  let mdata: any = {};
  mdata.count = Number(data.count);
  mdata.data = data;
  delete mdata?.data?.count;

  let resp = await Service.saveResitSheet(mdata);
  if (resp) return redirect(".");
  //if(resp) return redirect(`../scores`)
}

export async function loader({ params }) {
  const data = await Service.fetchResitSessionList(params.sessionId);
  return { data };
}

function PgAISResitSessionCapture({}: Props) {
  const { data }: any = useLoaderData();

  if (data?.message)
    return (
      <div className="p-10 border border-primary/10 rounded-xl flex flex-col items-center justify-center space-y-3">
        <BsActivity className="h-20 w-20 text-primary/30 border rounded-md" />
        <span className="text-primary/40 font-medium capitalize">
          {data?.message}
        </span>
      </div>
    );

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center space-y-8 md:space-y-8 ">
      <div className="flex w-full flex-1 flex-col space-y-8 md:space-y-10 ">
        {data?.map((resitData: any, i: number) => (
          <AISResitCaptureCard title={resitData[0]} data={resitData[1]} />
        ))}
        {!data?.length ? (
          <div className="p-10 border border-primary/10 rounded-xl flex flex-col items-center justify-center space-y-3">
            <BsActivity className="h-20 w-20 text-primary/30 border rounded-md" />
            <span className="text-primary/40 font-medium">No Records ...</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default PgAISResitSessionCapture;
