import moment from "moment";
import React from "react";
import {
  Form,
  redirect,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import Asterix from "../../components/hrsp/Asterix";
import Service from "../../utils/hrsService";

type Props = {};

// Save Form
export async function action({ request, params }) {
  const id = params?.nssId || 0;
  const formData = await request.formData();
  //  const data = Object.fromEntries(formData)
  let data: any = Array.from(formData, ([name, value]) => ({
    name,
    value: value.toString().toUpperCase(),
  }));
  data = Object.fromEntries(data.map((t) => [t.name, t.value]));
  data.nss_form = formData.get("nss_form");
  data.photo = formData.get("photo");

  let resp;
  if (id != 0) resp = await Service.updateNSS(id, data);
  else resp = await Service.postNSS(data);

  if (resp) {
    return redirect(id ? `/hrs/nss/${id}` : `/hrs/nss`);
  }
}

// Load Data of Single
export async function loader({ params }) {
  let data = { id: 0 };
  const units = await Service.fetchUnits();
  const id = params?.nssId || 0;
  if (id != 0) data = await Service.fetchNSS(id);
  return { data, units };
}

function PgHRSNSSForm({}: Props) {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const { data, units }: any = useLoaderData();

  return (
    <main className="p-2 md:pr-4 md:col-span-2 space-y-4">
      <div className="p-4 border bg-slate-50/50 rounded-xl space-y-4">
        <section className="px-6 py-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex-1 flex flex-col space-y-6">
            <h1 className="text-lg md:text-3xl tracking-wide font-semibold text-blue-950/70">
              NSS FORM
            </h1>
            <div className="flex flex-col space-y-1 text-zinc-500 text-base">
              <span className="text-sm md:tracking-wider">
                1. Please complete required information for successful
                enrolment.
              </span>
              <span className="text-sm md:tracking-wider">
                2. You are required to upload a <b>scanned</b> or{" "}
                <b>electronic copy</b> of <b>NSS Posting Letter</b>.
              </span>
            </div>
          </div>
        </section>

        <Form
          method="post"
          encType="multipart/form-data"
          className="font-roboto tracking-wider grid grid-cols-1 md:grid-cols-2 gap-y-2 md:gap-y-0 md:gap-x-2"
        >
          {/* Record */}
          <div className="p-3 md:py-6 md:pb-6 md:px-6 border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
            <div className="px-2 space-y-4">
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  First Name <Asterix />
                </span>
                <input
                  arial-label="fname"
                  name="fname"
                  defaultValue={data?.fname}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/10 text-sm md:text-base text-gray-500 rounded-md"
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
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/10 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Last Name <Asterix />
                </span>
                <input
                  arial-label="lname"
                  name="lname"
                  defaultValue={data?.lname}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/10 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Date of Birth <Asterix />
                </span>
                <input
                  arial-label="dob"
                  type="date"
                  name="dob"
                  defaultValue={
                    data?.dob && moment(data?.dob).format("YYYY-MM-DD")
                  }
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/10 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Gender <Asterix />
                </span>
                <select
                  arial-label="gender"
                  name="gender"
                  defaultValue={data?.gender}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/10 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value={`M`}>Male</option>
                  <option value={`F`}>Female</option>
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Hometown <Asterix />
                </span>
                <input
                  arial-label="hometown"
                  name="hometown"
                  defaultValue={data?.hometown}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/10 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Phone Number <Asterix />
                </span>
                <input
                  arial-label="mobile"
                  name="mobile"
                  defaultValue={data?.mobile}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/10 text-sm md:text-base text-gray-500 rounded-md"
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
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/10 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Address <Asterix />
                </span>
                <textarea
                  arial-label="address"
                  name="address"
                  defaultValue={data?.address}
                  required
                  className="focus:ring-0 border focus:border-slate-300 border-slate-200 bg-blue-500/10 text-sm md:text-base text-gray-500 rounded-md"
                ></textarea>
              </label>
              <hr className="hidden md:block border-dashed" />
              <div className="hidden md:flex items-center space-x-4">
                <input type="hidden" name="id" defaultValue={data?.id} />
                <button
                  className="py-1 px-4 md:w-96 rounded-md bg-blue-950/70 text-white font-semibold"
                  type="submit"
                >
                  SAVE
                </button>
                <button
                  onClick={() => {
                    if (confirm("Cancel")) navigate("/login");
                  }}
                  className="py-1 px-4 rounded-md  bg-slate-50 border text-sm text-gray-600"
                  type="button"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>

          <div className="p-3 md:py-6 md:pb-10 md:px-6 border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
            {/* <h1 className="py-0.5 px-2 md:px-4 w-fit text-xs md:text-base font-semibold rounded-md bg-blue-950/60 text-white tracking-widest uppercase -skew-x-6">SECURE PORTAL</h1> */}
            <div className="px-2 space-y-4">
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Emergency Contact Information <Asterix />
                </span>
                <textarea
                  arial-label="emergency_contact"
                  name="emergency_contact"
                  defaultValue={data?.emergency_contact}
                  required
                  className="focus:ring-0 border focus:border-slate-300 border-slate-200 bg-blue-500/10 text-sm md:text-base text-gray-500 rounded-md"
                ></textarea>
              </label>
              {/* <label className="flex flex-col space-y-2">
                    <span className="text-sm md:text-base text-gray-500 font-medium">Assigned UCC Office Unit <Asterix /></span>
                    <input arial-label="unit_assigned" name="unit_assigned" defaultValue={data?.unit_assigned} required className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md" />
                </label> */}
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  HR Assigned Unit
                </span>
                <select
                  arial-label="unit_id"
                  name="unit_id"
                  defaultValue={data?.unit_id}
                  required
                  className="capitalize focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/10  text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  {units &&
                    units?.map((row: any) => (
                      <option key={row.id} value={row.id}>
                        {row.long_name?.toLowerCase()}
                      </option>
                    ))}
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  NSS Number <Asterix />
                </span>
                <input
                  arial-label="nss_no"
                  name="nss_no"
                  defaultValue={data?.nss_no}
                  required
                  className="uppercase focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/10 text-sm md:text-base text-gray-500 rounded-md"
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
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/10 text-sm md:text-base text-gray-500 rounded-md"
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
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/10 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>

              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  NSS Start Period
                </span>
                <input
                  arial-label="start_date"
                  type="date"
                  name="start_date"
                  defaultValue={
                    data?.start_date &&
                    moment(data?.start_date).format("YYYY-MM-DD")
                  }
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/10 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  NSS End Period
                </span>
                <input
                  arial-label="end_date"
                  type="date"
                  name="end_date"
                  defaultValue={
                    data?.end_date &&
                    moment(data?.end_date).format("YYYY-MM-DD")
                  }
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/10 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>

              <hr className="border-dashed" />
              <div className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  NSS Appointment Form
                </span>
                <input
                  arial-label="nss_form"
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
                </span>
                <input
                  arial-label="photo"
                  type="file"
                  name="photo"
                  defaultValue={data?.photo}
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-red-500/5 text-sm md:text-base text-gray-500 rounded-md file:bg-blue-950/80 file:border-0 file:m-2 file:px-3 file:font-medium file:rounded-md file:text-white file:text-sm"
                />
              </div>

              <hr className="md:hidden border-dashed" />
              <div className="md:hidden flex md:items-center space-x-2 md:space-x-4">
                <input type="hidden" name="id" defaultValue={data?.id} />
                <button
                  className="py-1 px-4 w-4/5 md:w-96 rounded-md bg-blue-950/70 text-white font-semibold"
                  type="submit"
                >
                  SAVE
                </button>
                <button
                  onClick={() => {
                    if (confirm("Cancel")) navigate("/login");
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

export default PgHRSNSSForm;
