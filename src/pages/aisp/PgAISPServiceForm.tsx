import React from "react";
import { Form, redirect, useLoaderData, useNavigate } from "react-router-dom";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";

type Props = {};

const inputClass =
  "w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-secondary-accent/20 focus:border-secondary-accent/40 transition-colors";
const labelClass = "text-xs font-semibold text-slate-500 uppercase tracking-wider";

// Save Form
export async function action({ request, params }) {
  const id = params?.transwiftId || 0;
  const formData = await request.formData();
  let data = Object.fromEntries(formData);
  let resp;
  if (id != 0) resp = await Service.updateTranswift(id, data);
  else resp = await Service.postTranswift(data);

  if (resp) {
    return redirect(`/aisp/services`);
  }
}
// Load Data of Single
export async function loader({ params }) {
  let data = { id: 0 };
  const id = params?.transwiftId || 0;
  if (id != 0) data = await Service.fetchTranswift(id);
  return { data };
}

function PgAISPServiceForm({}: Props) {
  const navigate = useNavigate();
  const { data }: any = useLoaderData();
  const user = useUserStore((state) => state.user);

  return (
    <div className="p-4 md:p-0 space-y-6 md:space-y-8">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-primary">
          {data?.id ? "Update" : "Create"} Service Request
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Please provide necessary information
        </p>
      </div>

      <Form method="post">
        <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4 max-w-lg">
          <label className="flex flex-col space-y-1.5">
            <span className={labelClass}>
              Recipient's Postal address or Email address
            </span>
            <textarea
              arial-label="receipient"
              name="receipient"
              defaultValue={data?.receipient}
              required
              rows={4}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col space-y-1.5">
            <span className={labelClass}>Mode of Delivery</span>
            <select
              arial-label="mode"
              name="mode"
              defaultValue={data?.mode}
              required
              className={inputClass}
            >
              <option selected disabled>
                -- Choose --
              </option>
              <option value="PICKUP">PICKUP</option>
              <option value="INLAND">INLAND MAIL</option>
              <option value="FOREIGN">FOREIGN MAIL</option>
            </select>
          </label>
          <label className="flex flex-col space-y-1.5">
            <span className={labelClass}>Document Type</span>
            <select
              arial-label="version"
              name="version"
              defaultValue={data?.version}
              required
              className={inputClass}
            >
              <option selected disabled>
                -- Choose --
              </option>
              <option value="SOFTCOPY">SOFTCOPY</option>
              <option value="HARDCOPY">HARDCOPY</option>
            </select>
          </label>

          <div className="flex items-center gap-3 pt-2">
            <button
              className="flex-1 py-2.5 px-4 rounded-lg bg-secondary-accent text-white font-semibold text-sm hover:bg-secondary-accent/90 transition-colors"
              type="submit"
            >
              Save
            </button>
            <button
              onClick={() => {
                if (confirm("Cancel")) navigate(-1);
              }}
              className="py-2.5 px-4 rounded-lg bg-slate-100 text-sm font-semibold text-slate-500 hover:bg-slate-200 transition-colors"
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default PgAISPServiceForm;
