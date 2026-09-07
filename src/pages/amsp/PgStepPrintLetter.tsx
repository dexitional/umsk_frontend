import React from "react";
import { useLoaderData } from "react-router-dom";
import LetterTemplate from "../../components/ams/LetterTemplate";
import Service from "../../utils/amsService";

type Props = {};

// Loader for Single Project
export async function loader({ params }) {
  const data = await Service.fetchMyMatriculant();
  return { data };
}

function PgStepPrintLetter({}: Props) {
  const { data }: any = useLoaderData();
  return (
    <main className="p-2">
      <div className="p-3 border bg-slate-50/50 rounded-xl space-y-4">
        <section>
          <div className="p-2 w-fit md:w-full md:py-4 md:px-6 flex flex-col space-y-3 md:space-y-6 border rounded-md md:rounded-xl bg-white overflow-x-scroll">
            &nbsp;&nbsp;
            <LetterTemplate data={data} />
          </div>
        </section>
      </div>
    </main>
  );
}

export default PgStepPrintLetter;
