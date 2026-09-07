import React from "react";
// @ts-ignore
import moment from "moment";
import { Form, Link, redirect, useFetcher, useLoaderData } from "react-router-dom";
import FormTemplate from "../../components/ams/FormTemplate";
import Service from "../../utils/amsService";
import { useUserStore } from "../../utils/authService";
import { CgSpinner } from "react-icons/cg";

type Props = {};

// Delete Action for Phase
export async function action({ request }) {
  const { user } = useUserStore.getState() ?? null;
  const serial = user?.user?.tag;
  const formData = await request.formData();
  let data: any = {};
  data.submitted = true;
  data.submittedAt = moment();
  data.serial = serial;
  data.choiceId = formData.get("choiceId");
  let resp = await Service.saveStepReview(data);
  if (resp) {
    return redirect("/amsp/dash");
  }
  return null;
}

// Loader for Single Project
export async function loader({ params }) {
  const applicant = await Service.fetchMyApplicant();
  const data = await Service.fetchMyApplicantPreview();
  return { data, applicant };
}

function PgStepReview({}: Props) {
  const { data, applicant }: any = useLoaderData();
  const fetcher = useFetcher();
  
  return (
    <main className="p-2">
      <div className="p-3 border bg-slate-50/50 rounded-xl space-y-4">
        <section className="relative flex space-x-2 md:space-x-6">
          <div className="relative p-2 w-full md:py-4 md:px-6 flex md:flex-row flex-col md:space-x-6 space-y-3 md:space-y-0 md:justify-between border rounded-md md:rounded-xl bg-slate-50">
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
              <Link
                to="/amsp/profile"
                className="px-4 py-2 bg-primary rounded-md text-white font-semibold"
              >
                Edit Application Form
              </Link>
              <Link
                to="/amsp/dash"
                className="px-4 py-2 bg-primary-accent/90 rounded-md text-white font-semibold"
              >
                Save & Exit
              </Link>
            </div>
            <fetcher.Form
              method="post"
              encType="multipart/form-data"
              className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4"
            >
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 disabled:bg-gray-400 rounded-md text-white font-semibold animate-pulse flex items-center justify-center space-x-2"
                disabled={fetcher.state !== "idle"}
              >
                { fetcher.state !== "idle" ? 
                    <div className="flex items-center justify-center space-x-2">
                      <CgSpinner className="my-1 h-5 w-5 animate-spin" />
                      <span className="text-sm text-white font-semibold">Finalizing Application Process ...</span>
                    </div> : 
                    'Finalize Application to Complete'
                }
              </button>
              <input
                type="hidden"
                name="choiceId"
                value={data?.choice[0]?.id}
              />
            </fetcher.Form>
          </div>
        </section>
        <section>
          <div className=" p-2 w-full md:w-full md:py-4 md:px-6 flex flex-col space-y-3 md:space-y-6 border rounded-md md:rounded-xl bg-white overflow-x-scroll">
            <FormTemplate data={{ applicant, data }} />
          </div>
        </section>
      </div>
    </main>
  );
}

export default PgStepReview;
