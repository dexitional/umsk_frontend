import React from "react";
import { Form, redirect, useLoaderData, useNavigate } from "react-router-dom";
import SubPageTitle from "../../components/ais/SubPageTitle";
import Service from "../../utils/aisService";

type Props = {};

// Save Form
export async function action({ request, params }) {
  const id = params?.roleId || 0;
  const formData = await request.formData();
  let data = Object.fromEntries(formData);

  let resp;
  if (id != 0) resp = await Service.updateRole(id, data);
  else resp = await Service.postRole(data);

  if (resp) {
    return redirect(`/ais/roles`);
  }
}
// Load Data of Single
export async function loader({ params }) {
  let data = { id: 0 };
  const id = params?.roleId || 0;
  if (id != 0) data = await Service.fetchRole(id);
  return { data };
}

function PgDricRoleForm({}: Props) {
  const navigate = useNavigate();
  const { data }: any = useLoaderData();
  console.log(data);

  return (
    <main className="md:pl-10 p-2 md:p-6 space-y-4 md:space-y-10">
      <SubPageTitle
        title={`${data?.id ? "Edit" : "Create"} Role`}
        page="Roles"
      />
      <div className="p-2 md:p-6 border bg-slate-50/50 rounded-xl space-y-6">
        <section className="flex md:space-x-6">
          <div className="flex-1 flex flex-col space-y-1 md:space-y-3">
            <h1 className="text-lg md:text-2xl tracking-wide font-semibold text-blue-950/70">
              {data?.id ? "Edit" : "Create"} Role
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
              Single-Sign-On Info
            </h1>
            <div className="md:pl-6 space-y-4">
              <label className="flex flex-col space-y-2">
                <div className="text-sm md:text-base text-gray-500 font-medium flex items-center justify-between">
                  <span>SSO Identity Number</span>
                  <span className="text-[0.65rem] text-gray-400 italic">
                    Staff Number or NSS Number
                  </span>
                </div>
                <input
                  arial-label="identity"
                  name="identity"
                  defaultValue={data?.tag}
                  disabled={data?.id}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base disabled:text-gray-400 text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  SSO Category
                </span>
                <select
                  arial-label="ssoType"
                  name="group_id"
                  defaultValue={data?.group_id}
                  disabled={data?.id}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base  text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose category --
                  </option>
                  <option value={2}>University Staff</option>
                  <option value={3}>NSS Personel</option>
                </select>
              </label>
            </div>
          </div>

          <div className="p-3 md:py-6 md:pb-10 md:px-6 border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
            <h1 className="py-0.5 px-2 md:px-4 w-fit text-xs md:text-base font-semibold rounded-md bg-blue-950/60 text-white tracking-widest uppercase -skew-x-6">
              Access & Privilege
            </h1>
            <div className="md:pl-6 space-y-4">
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  SSO Role
                </span>
                <select
                  arial-label="role"
                  name="arole_id"
                  defaultValue={data?.arole_id}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value="18">AIS Admin</option>
                  <option value="20">AIS Dean</option>
                  <option value="20">AIS HOD</option>
                  <option value="20">AIS Accountant</option>
                  <option value="19">AIS Registrar</option>
                  <option value="19">AIS Clerk</option>
                  <option value="20">AIS Assessor</option>
                  <option value="19">AIS Sales</option>
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  SSO Status
                </span>
                <select
                  arial-label="status"
                  name="status"
                  defaultValue={data?.status}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value="0">Disabled</option>
                  <option value="1">Enabled</option>
                </select>
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

export default PgDricRoleForm;
