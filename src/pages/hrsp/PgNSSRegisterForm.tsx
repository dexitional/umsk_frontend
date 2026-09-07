import React from "react";
import { Form, redirect, useLoaderData, useNavigate } from "react-router-dom";
import NSSLogo from "../../assets/img/nss.jpg";
import Asterix from "../../components/nss/Asterix";
import Service from "../../utils/hrsService";

type Props = {};

// Save Form
export async function action({ request, params }) {
  const formData = await request.formData();
  //  let data = Object.fromEntries(formData)
  let data: any = Array.from(formData, ([name, value]) => ({
    name,
    value: value.toString().toUpperCase(),
  }));
  data = Object.fromEntries(data.map((t) => [t.name, t.value]));
  data.password = formData.get("password");
  data.repassword = formData.get("repassword");
  data.nss_form = formData.get("nss_form");
  data.photo = formData.get("photo");

  let resp = await Service.postNSSRegister(data);
  if (resp) {
    return redirect(`/register/nss/${data.nss_no}`);
  }
  return null;
}

// Load Data of Single
export async function loader({ params }) {
  const units = await Service.fetchUnits();
  return { data: null, units };
}

function PgNSSRegisterForm({}: Props) {
  const navigate = useNavigate();
  const { data, units }: any = useLoaderData();

  return (
    <main className="md:col-span-2 p-2 space-y-4 md:space-y-4">
      <div className="p-3 border bg-slate-50/50 rounded-xl space-y-4">
        <section className="px-3 py-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex-1 flex flex-col space-y-6">
            <h1 className="px-3 py-1 rounded-md border md:border-0 text-xl md:text-3xl tracking-wide font-semibold text-blue-950/70 uppercase">
              Online NSS Registration{" "}
            </h1>
            <div className="flex flex-col space-y-3 md:space-y-1 text-zinc-500 text-base">
              <span className="text-sm md:tracking-wider">
                1. Please complete required information for successful
                enrolment.
              </span>
              <span className="text-sm md:tracking-wider">
                2. You are required to upload a <b>scanned</b> or{" "}
                <b>electronic copy</b> of <b>NSS Posting Letter</b>.
              </span>
              <span className="text-sm md:tracking-wider">
                3. Your Information is enrolled once but updated later from your{" "}
                <b>UCC NSS Portal</b>.
              </span>
              <span className="text-sm md:tracking-wider">
                4. After successful enrolment, You will be able to log into the
                portal using <b>Sign In with SSO Credentials</b>.
              </span>
            </div>
          </div>
          <div className="relative h-28 w-28 rounded-2xl overflow-hidden">
            <img src={NSSLogo} className="object-cover object-center" />
          </div>
        </section>

        <Form
          method="post"
          encType="multipart/form-data"
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-y-2 md:gap-y-0 md:gap-x-2"
        >
          {/* Record */}
          <div className="p-3 md:py-6 md:px-6 border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
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
                  className="uppercase focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
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
                  className="uppercase focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
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
                  className="uppercase focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
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
                  defaultValue={data?.dob}
                  required
                  className="uppercase focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
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
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value={`M`}>MALE</option>
                  <option value={`F`}>FEMALE</option>
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
                  className="uppercase focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
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
                  className="uppercase focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
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
                  className="uppercase focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
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
                  className="uppercase focus:ring-0 border focus:border-slate-300 border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                ></textarea>
              </label>
              <hr className="hidden md:block border-dashed" />
              <div className="hidden md:flex items-center space-x-4">
                <input type="hidden" name="id" defaultValue={data?.id} />
                <button
                  className="py-1 px-4 md:w-96 rounded-md bg-blue-950/70 text-white font-semibold"
                  type="submit"
                >
                  REGISTER
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

          <div className="p-3 md:py-6 md:pb-10 md:px-6 border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-66">
            {/* <h1 className="py-0.5 px-2 md:px-4 w-fit text-xs md:text-base font-semibold rounded-md bg-blue-950/60 text-white tracking-widest uppercase -skew-x-6">SECURE PORTAL</h1> */}
            <div className="px-2 space-y-4">
              {/* <label className="flex flex-col space-y-2">
                      <span className="text-sm md:text-base text-gray-500 font-medium">Official Unit</span>
                      <select arial-label="country" name="countryId" defaultValue={data?.countryId} required className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md">
                        <option selected disabled>-- Choose --</option>
                        { countries && countries?.map((row:any) =>(
                          <option key={row.id} value={row.id}>{row.longName}</option>
                        ))}
                       </select>
                  </label> */}
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Emergency Contact Information <Asterix />
                </span>
                <textarea
                  arial-label="emergency_contact"
                  name="emergency_contact"
                  defaultValue={data?.emergency_contact}
                  required
                  className="uppercase focus:ring-0 border focus:border-slate-300 border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                ></textarea>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Assigned UCC Office Unit
                </span>
                <select
                  arial-label="unit_id"
                  name="unit_id"
                  defaultValue={data?.unit_id}
                  required
                  className="capitalize focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
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
                  className="uppercase focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
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
                  className="uppercase focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
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
                  className="uppercase focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>

              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Create UCC SSO Password <Asterix />
                </span>
                <input
                  arial-label="password"
                  type="password"
                  name="password"
                  defaultValue={data?.password}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Re-peat UCC SSO Password <Asterix />
                </span>
                <input
                  arial-label="repassword"
                  type="password"
                  name="repassword"
                  defaultValue={data?.repassword}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              {/* <hr className="border-dashed" />
                  <div className="flex flex-col space-y-2">
                      <span className="text-sm md:text-base text-gray-500 font-medium">NSS Appointment Form</span>
                      <input arial-label="repassword" type="file" name="nss_form" defaultValue={data?.nss_form} className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-red-500/5 text-sm md:text-base text-gray-500 rounded-md file:bg-blue-950/80 file:border-0 file:m-2 file:px-3 file:font-medium file:rounded-md file:text-white file:text-sm" />
                  </div>
                  <div className="flex flex-col space-y-2">
                      <span className="text-sm md:text-base text-gray-500 font-medium">Passport Photo &nbsp;<sub><em>[ 500px <b>X</b> 500px ]</em></sub> </span>
                      <input arial-label="photo" type="file" name="photo" defaultValue={data?.photo} className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-red-500/5 text-sm md:text-base text-gray-500 rounded-md file:bg-blue-950/80 file:border-0 file:m-2 file:px-3 file:font-medium file:rounded-md file:text-white file:text-sm" />
                  </div>
                   */}
              <hr className="md:hidden border-dashed" />
              <div className="md:hidden flex items-center space-x-4">
                <input type="hidden" name="id" defaultValue={data?.id} />
                <button
                  className="py-1 px-4 md:w-96 rounded-md bg-blue-950/70 text-white font-semibold"
                  type="submit"
                >
                  REGISTER
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

export default PgNSSRegisterForm;
