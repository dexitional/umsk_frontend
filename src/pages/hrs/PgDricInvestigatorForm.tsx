import React from "react";
import { Form, redirect, useLoaderData, useNavigate } from "react-router-dom";
import SubPageTitle from "../../components/hrs/SubPageTitle";
import Service from "../../utils/aisService";

type Props = {};

// Save Form
export async function action({ request, params }) {
  const id = params?.investigatorId || 0;
  const formData = await request.formData();
  let data = Object.fromEntries(formData);
  data.staffNo = parseInt(data.staffNo);
  let resp;
  if (id != 0) resp = await Service.updateInvestigator(id, data);
  else resp = await Service.postInvestigator(data);

  if (resp) {
    return redirect(`/dric/investigators/${resp.id}`);
  }
}

// Load Data of Single
export async function loader({ params }) {
  let data = { id: 0 };
  const id = params?.investigatorId || 0;
  if (id != 0) data = await Service.fetchInvestigator(id);
  return { data };
}

function PgDricInvestigatorForm({}: Props) {
  const navigate = useNavigate();
  const { data }: any = useLoaderData();

  return (
    <main className="md:pl-10 p-2 md:p-6 space-y-4 md:space-y-10">
      <SubPageTitle
        title={`${data?.id ? "Edit" : "Create"} Investigator`}
        page="Investigators"
      />
      <div className="p-2 md:p-6 border bg-slate-50/50 rounded-xl space-y-6">
        <section className="flex md:space-x-6">
          <div className="flex-1 flex flex-col space-y-1 md:space-y-3">
            <h1 className="text-lg md:text-2xl tracking-wide font-semibold text-blue-950/70">
              {data?.id ? "Edit" : "Create"} Investigator
            </h1>
            <div className="flex items-center space-x-2 text-zinc-400 text-base">
              <span className="text-xs md:tracking-wider">
                Please provide neccessary information
              </span>
            </div>
          </div>
        </section>

        <Form
          method="post"
          className="grid md:grid-cols-2 gap-y-2 md:gap-y-0 md:gap-x-4"
        >
          {/* Record */}
          <div className="p-3 md:py-6 md:pb-10 md:px-6 border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
            <h1 className="py-0.5 px-2 md:px-4 w-fit text-xs md:text-base font-semibold rounded-md bg-blue-950/60 text-white tracking-widest uppercase -skew-x-6">
              General
            </h1>
            <div className="md:pl-6 space-y-4">
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Title
                </span>
                <select
                  name="title"
                  defaultValue={data?.title}
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value="Prof.(Emerit.)">Prof.(Emerit.)</option>
                  <option value="Prof.">Prof.</option>
                  <option value="Dr.">Dr.</option>
                  <option value="Dr.(Mrs.)">Dr.(Mrs.)</option>
                  <option value="Rev.(Dr.)">Rev.(Dr.)</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Ms.">Ms.</option>
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  First Name
                </span>
                <input
                  arial-label="fname"
                  name="fname"
                  defaultValue={data?.fname}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Middle Name(s)
                </span>
                <input
                  arial-label="mname"
                  name="mname"
                  defaultValue={data?.mname}
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Last Name
                </span>
                <input
                  arial-label="lname"
                  name="lname"
                  defaultValue={data?.lname}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Location
                </span>
                <input
                  arial-label="location"
                  name="location"
                  defaultValue={data?.location}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Phone Number
                </span>
                <input
                  arial-label="phone"
                  name="phone"
                  defaultValue={data?.phone}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Email Address
                </span>
                <input
                  arial-label="email"
                  name="email"
                  defaultValue={data?.address}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
            </div>
          </div>

          <div className="p-3 md:py-6 md:pb-10 md:px-6 border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
            <h1 className="py-0.5 px-2 md:px-4 w-fit text-xs md:text-base font-semibold rounded-md bg-blue-950/60 text-white tracking-widest uppercase -skew-x-6">
              FINANCIAL & EMPLOYER INFO
            </h1>
            <div className="md:pl-6 space-y-4">
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Staff Number
                </span>
                <input
                  arial-label="logo"
                  type="number"
                  name="staffNo"
                  defaultValue={data?.staffNo}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Department
                </span>
                <input
                  arial-label="department"
                  name="department"
                  defaultValue={data?.department}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Address
                </span>
                <textarea
                  arial-label="address"
                  name="address"
                  defaultValue={data?.address}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                ></textarea>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Ghana Card Number
                </span>
                <input
                  arial-label="ghCardNo"
                  name="ghCardNo"
                  defaultValue={data?.ghCardNo}
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Bank Name
                </span>
                <input
                  arial-label="bankName"
                  name="bankName"
                  defaultValue={data?.bankName}
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Bank Account Number
                </span>
                <input
                  arial-label="bankAccount"
                  name="bankAccount"
                  defaultValue={data?.bankAccount}
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Bank Branch
                </span>
                <input
                  arial-label="bankBranch"
                  name="bankBranch"
                  defaultValue={data?.bankBranch}
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <div className="flex items-center space-x-6">
                <input type="hidden" name="id" defaultValue={data?.id} />
                <button
                  className="py-1 px-4 rounded-md bg-blue-950/70 text-white font-semibold"
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

export default PgDricInvestigatorForm;
