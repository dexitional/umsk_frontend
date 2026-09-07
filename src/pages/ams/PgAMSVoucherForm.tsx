import React from "react";
import {
  Form,
  redirect,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import SubPageTitle from "../../components/ams/SubPageTitle";
import Helper from "../../utils/aisService";
import Service from "../../utils/amsService";

type Props = {};

// Save Form
export async function action({ request, params }) {
  const formData = await request.formData();
  let data = Object.fromEntries(formData);
  data.quantity = Number(data.quantity);
  data.sellType = Number(data.sellType);
  let resp = await Service.postVoucher(data);

  if (resp) {
    // return redirect(`/ais/courses/${encodeURIComponent(resp.id)}/profile`)
    return redirect(`/ams/vouchers`);
  }
}
// Load Data of Single
export async function loader({ params }) {
  let data = { id: "" };
  const categories = await Helper.fetchCategories();
  const vendors = await Helper.fetchVendors();
  const id = params?.voucherId || 0;
  if (id != 0) data = await Service.fetchVoucher(id);
  return { data, categories, vendors };
}

function PgAMSVoucherForm({}: Props) {
  const navigate = useNavigate();
  const { data, categories, vendors }: any = useLoaderData();
  const navigation = useNavigation();
  const loading = navigation?.state;

  return (
    <main className="md:pl-10 p-2 md:p-6 space-y-4 md:space-y-10">
      <SubPageTitle
        title={`${data?.id ? "Edit" : "Generate"} Voucher`}
        page="Vouchers"
      />
      <div className="p-2 md:p-6 border bg-slate-50/50 rounded-xl space-y-6">
        <section className="flex md:space-x-6">
          <div className="flex-1 flex flex-col space-y-1 md:space-y-3">
            <h1 className="text-lg md:text-2xl tracking-wide font-semibold text-primary-accent/70">
              {data?.id ? "Edit" : "Generate"} Voucher
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
            {/* <h1 className="py-0.5 px-2 md:px-4 w-fit text-xs md:text-base font-semibold rounded-md bg-primary-accent/60 text-white tracking-widest uppercase -skew-x-6">General Information</h1> */}
            <div className="md:pl-6 space-y-4">
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Admission Category
                </span>
                <select
                  arial-label="categoryId"
                  name="categoryId"
                  defaultValue={data?.categoryId}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  {categories &&
                    categories?.map((row: any) => (
                      <option key={row.id} value={row.id}>
                        {row.title?.toUpperCase()}
                      </option>
                    ))}
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Voucher Vendor
                </span>
                <select
                  arial-label="vendorId"
                  name="vendorId"
                  defaultValue={data?.vendorId}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  {vendors &&
                    vendors?.map((row: any) => (
                      <option key={row.id} value={row.id}>
                        {row.name?.toUpperCase()}
                      </option>
                    ))}
                </select>
              </label>
            </div>
          </div>

          <div className="p-3 md:py-6 md:pb-10 md:px-6 w-full border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
            <div className="md:pl-6 space-y-4">
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Voucher Category
                </span>
                <select
                  arial-label="sellType"
                  name="sellType"
                  defaultValue={data?.sellType}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value={0}>GENERAL</option>
                  <option value={1}>MATURED</option>
                  <option value={2}>INTERNATIONAL</option>
                </select>
              </label>

              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Voucher Quantity
                </span>
                <input
                  arial-label="quantity"
                  name="quantity"
                  type="number"
                  defaultValue={data?.quantity}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>

              <div className="flex items-center">
                <button
                  disabled={loading === "submitting"}
                  className="mr-4 py-1 px-4 w-4/5 rounded-md bg-primary-accent/80 text-white font-semibold disabled:opacity-50 disabled:animate-pulse"
                  type="submit"
                >
                  {loading === "submitting" ? (
                    <span className="animate-pulse">SAVING ...</span>
                  ) : (
                    " SAVE"
                  )}
                </button>
                <button
                  disabled={loading === "submitting"}
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

export default PgAMSVoucherForm;
