import React from "react";
import { Form, redirect, useLoaderData, useNavigate } from "react-router-dom";
import Asterix from "../../components/aisp/Asterix";
import SubPageTitle from "../../components/aisp/SubPageTitle";
import { useUserStore } from "../../utils/authService";
import Service from "../../utils/hrsService";

type Props = {};

// Save Form
export async function action({ request, params }) {
  const id = params?.serviceId || 0;
  const formData = await request.formData();
  let data = Object.fromEntries(formData);
  let resp;
  if (id != 0) resp = await Service.updateService(id, data);
  else resp = await Service.postService(data);

  if (resp) {
    return redirect(`/nss/services`);
  }
}
// Load Data of Single
export async function loader({ params }) {
  let data = { id: 0 };
  const id = params?.roleId || 0;
  if (id != 0) data = await Service.fetchService(id);
  return { data };
}

function PgAISPServiceForm({}: Props) {
  const navigate = useNavigate();
  const { data }: any = useLoaderData();
  const user = useUserStore((state) => state.user);
  const lasRole = user?.roles?.find((r) => r?.app_tag?.toLowerCase() == "las");

  return (
    <main className="md:pl-10 p-2 md:p-6 space-y-4 md:space-y-10">
      <SubPageTitle
        title={`${data?.id ? "Edit" : "Create"} Request`}
        page="Service Request"
      />
      <div className="p-2 md:p-6 border bg-slate-50/50 rounded-xl space-y-6">
        <section className="flex md:space-x-6">
          <div className="flex-1 flex flex-col space-y-1 md:space-y-3">
            <h1 className="text-lg md:text-2xl tracking-wide font-semibold text-blue-950/70">
              {data?.id ? "Edit" : "Create"} Request
            </h1>
            <div className="flex items-center space-x-2 text-zinc-400 text-base">
              <span className="text-xs md:tracking-wider">
                Please provide neccessary information
              </span>
            </div>
          </div>
        </section>

        <Form method="post" className="grid">
          {/* Record */}
          <div className="p-3 md:py-6 md:pb-10 md:px-6 border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
            <div className="md:p-6 space-y-4">
              <label className="flex flex-col space-y-2">
                <div className="text-sm md:text-base text-gray-500 font-medium flex items-center justify-between">
                  <span>Subject of Request</span>
                </div>
                <input
                  arial-label="title"
                  name="title"
                  defaultValue={data?.title}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base disabled:text-gray-400 text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Content of Request <Asterix />
                </span>
                <textarea
                  arial-label="content"
                  name="content"
                  defaultValue={data?.content}
                  required
                  className="h-24 focus:ring-0 border focus:border-slate-300 border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                ></textarea>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Gender <Asterix />
                </span>
                <select
                  arial-label="type"
                  name="type"
                  defaultValue={data?.type}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value={`RELEASE`}>Release of Personel</option>
                  <option value={`INTRODUCTION`}>
                    Introduction of Personel
                  </option>
                  <option value={`CERTIFICATE`}>
                    Certificate of Completion
                  </option>
                </select>
              </label>
              <div className="flex items-center justify-between space-x-2">
                <input type="hidden" name="id" defaultValue={data?.id} />
                <input
                  type="hidden"
                  name="nss_no"
                  defaultValue={user?.user?.tag}
                />
                <input
                  type="hidden"
                  name="status"
                  defaultValue={data?.id ? data?.status : "PENDED"}
                />
                <button
                  className="py-1 px-4 w-4/5 rounded-md bg-blue-950/70 text-white font-semibold"
                  type="submit"
                >
                  SAVE
                </button>
                <button
                  onClick={() => {
                    if (confirm("Cancel")) navigate(-1);
                  }}
                  className="py-1 px-4 rounded-md  bg-slate-50 border text-sm text-gray-600"
                  type="button"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </main>
  );
}

export default PgAISPServiceForm;
