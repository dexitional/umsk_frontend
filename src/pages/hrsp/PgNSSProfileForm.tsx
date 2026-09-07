import React from "react";
import { Form, redirect, useLoaderData, useNavigate } from "react-router-dom";
import SubPageTitle from "../../components/dric/SubPageTitle";
import Asterix from "../../components/nss/Asterix";
import Service from "../../utils/hrsService";

type Props = {};

// Save Form
export async function action({ request, params }) {
  const id = params?.pin || 0;
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  let resp;
  if (id != 0) resp = await Service.updateNSS(data.id, data);
  else resp = await Service.postNSS(data);
  if (resp) {
    return redirect(`/nss/profile?${data.id}`);
  }
}

// Load Data of Single
export async function loader({ params }) {
  let data = { id: 0 };
  const id = params?.pin || 0;
  if (id != 0) data = await Service.fetchNSSByPin(id);
  return { data };
}

function PgNSSProfileForm({}: Props) {
  const navigate = useNavigate();
  const { data }: any = useLoaderData();

  return (
    <main className="p-2 md:pr-4 md:col-span-2 space-y-4">
      <SubPageTitle
        title={`${data?.id ? "Edit" : "Create"} NSS Profile`}
        page="NSS Profile"
      />
      <div className="p-2 border bg-slate-50/50 rounded-xl space-y-4">
        <section className="px-4 flex md:space-x-6">
          <div className="flex-1 flex flex-col space-y-1">
            <h1 className="text-lg md:text-lg tracking-wide font-semibold text-blue-950/70">
              {data?.id ? "Edit" : "Create"} NSS Profile
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
          className="md:grid md:grid-cols-2 gap-y-2 md:gap-y-0 md:gap-x-2"
        >
          {/* Record */}
          <div className="p-3 md:py-6 md:pb-6 md:px-2 border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
            <div className="md:px-2 space-y-4">
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Phone Number <Asterix />
                </span>
                <input
                  arial-label="mobile"
                  name="mobile"
                  defaultValue={data?.mobile}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Email Address <Asterix />
                </span>
                <input
                  arial-label="email"
                  name="email"
                  defaultValue={data?.email}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Ghana Card (NIA) Number
                </span>
                <input
                  arial-label="ghcard_no"
                  name="ghcard_no"
                  defaultValue={data?.ghcard_no}
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Ezwich Number <Asterix />
                </span>
                <input
                  arial-label="phone"
                  name="ezwich_no"
                  defaultValue={data?.ezwich_no}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
            </div>
          </div>

          <div className="p-3 md:py-6 md:pb-10 md:px-2 border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-66">
            {/* <h1 className="py-0.5 px-2 md:px-4 w-fit text-xs md:text-base font-semibold rounded-md bg-blue-950/60 text-white tracking-widest uppercase -skew-x-6">SECURE PORTAL</h1> */}
            <div className="md:px-2 space-y-4">
              <div className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  NSS Appointment Form <Asterix />
                </span>
                <input
                  arial-label="repassword"
                  type="file"
                  name="nss_form"
                  defaultValue={data?.nss_form}
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-red-500/5 text-sm md:text-base text-gray-500 rounded-md file:bg-blue-950/80 file:border-0 file:m-2 file:px-3 file:font-medium file:rounded-md file:text-white file:text-sm"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Passport Photo &nbsp;
                  <sub>
                    <em>
                      [ 500px <b>X</b> 500px ]
                    </em>
                  </sub>{" "}
                  <Asterix />
                </span>
                <input
                  arial-label="photo"
                  type="file"
                  name="photo"
                  defaultValue={data?.photo}
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-red-500/5 text-sm md:text-base text-gray-500 rounded-md file:bg-blue-950/80 file:border-0 file:m-2 file:px-3 file:font-medium file:rounded-md file:text-white file:text-sm"
                />
              </div>
              <hr className="border-dashed" />
              <div className="flex items-center space-x-2">
                <input type="hidden" name="id" defaultValue={data?.id} />
                <button
                  className="py-1 px-2 md:w-5/6 rounded-md bg-blue-950/70 text-white font-semibold"
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

export default PgNSSProfileForm;
