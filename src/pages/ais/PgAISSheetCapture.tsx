import React from "react";
import { BsActivity } from "react-icons/bs";
import { redirect, useLoaderData } from "react-router-dom";
import AISSheetCaptureCard from "../../components/ais/AISSheetCaptureCard";
import Service from "../../utils/aisService";

type Props = {};

export async function action({ request, params }) {
  const id = params?.sheetId || 0;
  const formData = await request.formData();
  let data = Object.fromEntries(formData);
  let mdata: any = {};
  mdata.count = Number(data.count);
  mdata.sheetId = id;
  mdata.data = data;
  delete mdata?.data?.count;

  let resp = await Service.saveSheet(mdata);
  if (resp) return redirect(".");
  //if(resp) return redirect(`../scores`)
}

export async function loader({ params }) {
  const data = await Service.loadSheet(params.sheetId);
  return { data };
}

function PgAISSheetCapture({}: Props) {
  const { data }: any = useLoaderData();

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center space-y-8 md:space-y-8 ">
      <div className="flex w-full flex-1 flex-col space-y-8 md:space-y-10 ">
        {data?.length ? (
          <AISSheetCaptureCard title={`Course Assessment`} data={data} />
        ) : null}
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

export default PgAISSheetCapture;
