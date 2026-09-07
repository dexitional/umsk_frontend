import React from "react";
import { useLoaderData } from "react-router-dom";
import FormTemplate from "../../components/ams/FormTemplate";
import Service from "../../utils/amsService";

type Props = {};

// Loader for Single Project
export async function loader({ params }) {
  const applicant = await Service.fetchMyApplicant();
  const data = await Service.fetchMyApplicantPreview();
  return { data, applicant };
}

function PgStepPrintForm({}: Props) {
  const { data, applicant }: any = useLoaderData();
  return (
    <main className="p-2">
      <div className="p-3 border bg-slate-50/50 rounded-xl space-y-4">
        <section>
          <div className="p-2 w-fit md:w-full md:pt-12 md:pb-6 md:px-6 flex flex-col space-y-3 md:space-y-6 border rounded-md md:rounded-xl bg-white overflow-x-scroll">
            <FormTemplate data={{ applicant, data }} />
          </div>
        </section>
      </div>
    </main>
  );
}

export default PgStepPrintForm;
