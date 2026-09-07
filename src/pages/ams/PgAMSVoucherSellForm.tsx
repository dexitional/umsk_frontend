import React from "react";
import { Form, redirect, useLoaderData, useNavigate } from "react-router-dom";
import SubPageTitle from "../../components/ais/SubPageTitle";
import Service from "../../utils/amsService";

type Props = {};

// Save Form
export async function action({ request, params }) {
  const id = params?.voucherId || 0;
  const formData = await request.formData();
  let data = Object.fromEntries(formData);
  data.id = id;
  let resp;
  if (data.action == "sell") resp = await Service.sellVoucher(id, data);
  else resp = await Service.updateVoucher(id, data);

  if (resp) {
    // return redirect(`/ais/courses/${encodeURIComponent(resp.id)}/profile`)
    return redirect(`/ams/vouchers`);
  }
}
// Load Data of Single
export async function loader({ request, params }) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  let data = { action: "" };
  if (pathname.endsWith("sell")) {
    data.action = "sell";
  } else {
    data.action = "edit";
  }
  const id = params?.voucherId;
  if (id) {
    const dt = await Service.fetchVoucher(id);
    return { data: { ...data, ...dt } };
  } else {
    return { data };
  }
}

function PgAMSVoucherSellForm({}: Props) {
  const navigate = useNavigate();
  const { data }: any = useLoaderData();
  return (
    <main className="md:pl-10 p-2 md:p-6 space-y-4 md:space-y-10">
      <SubPageTitle
        title={`${data?.id ? "Edit" : "Sell"} Voucher`}
        page="Vouchers"
      />
      <div className="p-2 md:p-6 border bg-slate-50/50 rounded-xl space-y-6">
        <section className="flex md:space-x-6">
          <div className="flex-1 flex flex-col space-y-1 md:space-y-3">
            <h1 className="text-lg md:text-2xl tracking-wide font-semibold text-primary-accent/70">
              {data?.id ? "Edit" : "Sell"} Voucher
            </h1>
            <div className="flex items-center space-x-2 text-zinc-400 text-base">
              <span className="text-xs md:text-base tracking-wider">
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
            {/* <h1 className="py-0.5 px-2 md:px-4 w-fit text-xs md:text-base font-semibold rounded-md bg-primary-dark/60 text-white tracking-widest uppercase -skew-x-6">General Information</h1> */}
            <div className="md:pl-6 space-y-4">
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Buyer Name
                </span>
                <input
                  arial-label="applicantName"
                  name="applicantName"
                  defaultValue={data?.applicantName}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
            </div>
          </div>

          <div className="p-3 md:py-6 md:pb-10 md:px-6 w-full border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
            <div className="md:pl-6 space-y-4">
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Buyer Phone
                </span>
                <input
                  arial-label="applicantPhone"
                  name="applicantPhone"
                  type="tel"
                  maxLength={10}
                  defaultValue={data?.applicantPhone}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>

              <div className="flex items-center">
                <input
                  type="hidden"
                  name="action"
                  defaultValue={data?.action}
                />
                <button
                  className="mr-4 py-1 px-4 w-4/5 rounded-md bg-primary-accent/70 text-white font-semibold"
                  type="submit"
                >
                  ISSUE VOUCHER
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

export default PgAMSVoucherSellForm;
