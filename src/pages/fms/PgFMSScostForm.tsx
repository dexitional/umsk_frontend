import React from "react";
import {
  Form,
  redirect,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import SubPageTitle from "../../components/fms/SubPageTitle";
import Service from "../../utils/fmsService";

type Props = {};

// Save Form
export async function action({ request, params }) {
  const id = params?.serviceId || 0;
  const formData = await request.formData();
  let data = Object.fromEntries(formData);
  data.amountInGhc = parseFloat(data.amountInGhc);
  data.amountInUsd = parseFloat(data.amountInUsd);

  let resp;
  if (id != 0) resp = await Service.updateService(id, data);
  else resp = await Service.postService(data);

  if (resp) {
    return redirect(`/fms/services`);
  }
}
// Load Data of Single
export async function loader({ params }) {
  let data = { id: 0 };
  const services = await Service.fetchServiceList();
  const id = params?.serviceId || 0;
  if (id != 0) data = await Service.fetchService(id);

  return { data, services };
}

function PgFMSScostForm({}: Props) {
  const navigate = useNavigate();
  const { data, services }: any = useLoaderData();
  const navigation = useNavigation();
  const loading = navigation?.state;

  return (
    <main className="md:pl-10 p-2 md:p-6 space-y-4 md:space-y-10">
      <SubPageTitle
        title={`${data?.id ? "Edit" : "Create"} Service Charge`}
        page="Service Charge"
      />
      <div className="p-2 md:p-6 border bg-slate-50/50 rounded-xl space-y-6">
        <section className="flex md:space-x-6">
          <div className="flex-1 flex flex-col space-y-1 md:space-y-3">
            <h1 className="text-lg md:text-2xl tracking-wide font-semibold text-primary/70">
              {data?.id ? "Edit" : "Create"} Service Charge
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
            <h1 className="py-0.5 px-2 md:px-4 w-fit text-xs md:text-base font-semibold rounded-md bg-primary-dark/60 text-white tracking-widest uppercase -skew-x-6">
              General Information
            </h1>
            <div className="md:pl-6 space-y-4">
              {/* <label className="flex flex-col space-y-2">
                    <span className="text-sm md:text-base text-gray-500 font-medium">Services</span>
                    <select arial-label="transtypeId" name="transtypeId" defaultValue={data?.transtypeId} className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md">
                      <option selected disabled>-- Choose --</option>
                      { services && services?.map((row:any) =>(
                        <option key={row.id} value={row.id}>{row.title}</option>
                      ))}
                    </select>
                  </label> */}
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Service Charge in GHC
                </span>
                <input
                  arial-label="amountInGhc"
                  name="amountInGhc"
                  defaultValue={data?.amountInGhc}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
            </div>
          </div>

          <div className="p-3 md:py-6 md:pb-10 md:px-6 w-full border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
            {/* <h1 className="py-0.5 px-4 w-fit text-base font-semibold rounded-md bg-blue-950/60 text-white tracking-widest uppercase -skew-x-6">SECURE PORTAL</h1> */}
            <div className="md:pl-6 space-y-4">
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Service Charge in USD
                </span>
                <input
                  arial-label="amountInUsd"
                  name="amountInUsd"
                  defaultValue={data?.amountInUsd}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
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

export default PgFMSScostForm;
