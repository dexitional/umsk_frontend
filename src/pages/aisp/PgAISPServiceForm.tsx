import React from "react";
import { HiOutlineTruck } from "react-icons/hi2";
import AISPPageHeader from "../../components/aisp/AISPPageHeader";
import { Form, redirect, useLoaderData, useNavigate } from "react-router-dom";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";

type Props = {};

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
    <div className="space-y-6 md:space-y-8">
      <AISPPageHeader photo="lab"
        eyebrow="Services"
        title={`${data?.id ? "Update" : "Create"} Service Request`}
        subtitle="Tell us where and how to deliver your document."
        Icon={HiOutlineTruck}
      />

      <Form method="post">
        <div className="aisp-rise aisp-card p-6 md:p-8 space-y-5 max-w-xl">
          <label className="flex flex-col gap-2">
            <span className="aisp-label">
              Recipient's Postal address or Email address
            </span>
            <textarea
              arial-label="receipient"
              name="receipient"
              defaultValue={data?.receipient}
              required
              rows={4}
              className="aisp-input"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="aisp-label">Mode of Delivery</span>
            <select
              arial-label="mode"
              name="mode"
              defaultValue={data?.mode}
              required
              className="aisp-input"
            >
              <option selected disabled>
                -- Choose --
              </option>
              <option value="PICKUP">PICKUP</option>
              <option value="INLAND">INLAND MAIL</option>
              <option value="FOREIGN">FOREIGN MAIL</option>
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span className="aisp-label">Document Type</span>
            <select
              arial-label="version"
              name="version"
              defaultValue={data?.version}
              required
              className="aisp-input"
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
              className="aisp-btn-primary flex-1"
              type="submit"
            >
              Save
            </button>
            <button
              onClick={() => {
                if (confirm("Cancel")) navigate(-1);
              }}
              className="aisp-btn-soft"
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
