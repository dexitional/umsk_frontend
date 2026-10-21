import { requestError } from "../../utils/requestError";
import React from "react";
import {
  Form,
  redirect,
  useLoaderData,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import SubPageTitle from "../../components/ais/SubPageTitle";
import YearGroupCodeField from "../../components/fms/YearGroupCodeField";
import Helper from "../../utils/aisService";
import Service from "../../utils/fmsService";

type Props = {};

// Save Form
export async function action({ request, params }) {
  const id = params?.billId || 0;
  const formData = await request.formData();
  let data = Object.fromEntries(formData);
  data.amount = Number(data.amount);
  data.discount = data.discount === "" ? 0 : Number(data.discount);
  data.quota = data.quota === "" ? null : Number(data.quota);

  try {
    const resp = id != 0 ? await Service.updateBill(id, data) : await Service.postBill(data);
    if (resp) return redirect(`/fms/bills`);
    return { error: 'The bill was not saved. Please try again.' };
  } catch (error) {
    return { error: requestError(error, 'The bill could not be saved.') };
  }
}
// Load Data of Single
export async function loader({ params }) {
  let data = { id: 0 };
  //const countries = await Service.fetchCountries()
  const programs = await Helper.fetchProgramList();
  const sessions = await Helper.fetchSessionList();
  const banks = await Service.fetchBankaccList();

  const id = params?.billId || 0;
  if (id != 0) data = await Service.fetchBill(id);

  console.log(data);
  return { data, programs, sessions, banks };
}

function PgFMSVcostForm({}: Props) {
  const navigate = useNavigate();
  const { data, programs, sessions, banks }: any = useLoaderData();
  const navigation = useNavigation();
  const result: any = useActionData();
  const loading = navigation?.state;

  return (
    <main className="md:pl-10 p-2 md:p-6 space-y-4 md:space-y-10">
      <SubPageTitle
        title={`${data?.id ? "Edit" : "Create"} Bill`}
        page="Bill"
      />
      <div className="p-2 md:p-6 border bg-slate-50/50 rounded-xl space-y-6">
        <section className="flex md:space-x-6">
          <div className="flex-1 flex flex-col space-y-1 md:space-y-3">
            <h1 className="text-lg md:text-2xl tracking-wide font-semibold text-primary/70">
              {data?.id ? "Edit" : "Create"} Bill
            </h1>
            <div className="flex items-center space-x-2 text-zinc-400 text-base">
              <span className="text-xs md:text-base tracking-wider">
                Please provide neccessary information
              </span>
            </div>
          </div>
        </section>

        {result?.error ? <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">{result.error}</p> : null}
        <Form
          method="post"
          className="grid md:grid-cols-2 gap-y-2 md:gap-y-0 md:gap-x-4"
        >
          {/* Record */}
          <div className="p-3 md:py-6 md:pb-10 md:px-6 border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
            <h1 className="py-0.5 px-2 md:px-4 w-fit text-xs md:text-base font-semibold rounded-md bg-primary-dark/60 text-white tracking-widest uppercase -skew-x-6">
              General Information
            </h1>
            <div className="md:pl-6 space-y-4">
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Bill Title
                </span>
                <input
                  arial-label="fname"
                  name="narrative"
                  defaultValue={data?.narrative}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Bill Amount
                </span>
                <input
                  arial-label="mname"
                  name="amount"
                  type="number" min="0.01" step="0.01"
                  defaultValue={data?.amount}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Bill Discount Amount
                </span>
                <input
                  arial-label="lname"
                  name="discount"
                  type="number" min="0" step="0.01"
                  defaultValue={data?.discount}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Bill Student Category
                </span>
                <select
                  arial-label="type"
                  name="type"
                  required
                  defaultValue={data?.type}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value="GH">GHANAIAN STUDENT</option>
                  <option value="INT">INTERNATIONAL STUDENT</option>
                </select>
              </label>

              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Payment Quota Allowed in Percentage (%)
                </span>
                <input
                  arial-label="quota"
                  name="quota"
                  min="0" max="100" step="0.01"
                  type="number"
                  defaultValue={data?.quota}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
            </div>
          </div>

          <div className="p-3 md:py-6 md:pb-10 md:px-6 w-full border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
            {/* <h1 className="py-0.5 px-4 w-fit text-base font-semibold rounded-md bg-blue-950/60 text-white tracking-widest uppercase -skew-x-6">SECURE PORTAL</h1> */}
            <h1 className="py-0.5 px-2 md:px-4 w-fit text-xs md:text-base font-semibold rounded-md bg-primary-dark/60 text-white tracking-widest uppercase -skew-x-6">
              Target Group Information
            </h1>
            <div className="md:pl-6 space-y-4">
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Target Program
                </span>
                <select
                  arial-label="programId"
                  name="programId"
                  defaultValue={data?.programId}
                  required
                  className="focus:ring-0 border focus:border-slate-300 border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  {programs &&
                    programs?.map((row: any) => (
                      <option key={row?.id} value={row?.id}>
                        {row?.shortName}
                      </option>
                    ))}
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Target Academic Session
                </span>
                <select
                  arial-label="sessionId"
                  name="sessionId"
                  defaultValue={data?.sessionId}
                  required
                  className="focus:ring-0 border focus:border-slate-300 border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  {sessions &&
                    sessions?.map((row: any) => (
                      <option key={row?.id} value={row?.id}>
                        {row?.title}
                      </option>
                    ))}
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Payment Account Info
                </span>
                <select
                  arial-label="bankaccId"
                  name="bankaccId"
                  defaultValue={data?.bankaccId}
                  required
                  className="focus:ring-0 border focus:border-slate-300 border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  {banks &&
                    banks?.map((row: any) => (
                      <option key={row?.id} value={row?.id}>
                        {row?.tag}
                      </option>
                    ))}
                </select>
              </label>
              <YearGroupCodeField
                name="mainGroupCode"
                label="Main Target Group"
                defaultValue={data?.mainGroupCode}
                required
                hint="The selected current year groups will be billed (both semesters in each year)."
              />
              <YearGroupCodeField
                name="discountGroupCode"
                label="Discount Target Group"
                defaultValue={data?.discountGroupCode}
                hint="The years that get the discount. Leave all unticked for no discount group."
              />

              <div className="flex items-center">
                {/* <input type="hidden" name="studentId" defaultValue={data?.id} /> */}
                <button
                  disabled={loading === "submitting"}
                  className="mr-4 py-1 px-4 w-4/5 rounded-md bg-primary/70 text-white font-semibold disabled:opacity-50 disabled:animate-pulse"
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

export default PgFMSVcostForm;
