import moment from "moment";
import React from "react";
import {
  Form,
  Link,
  redirect,
  useFetcher,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import Asterix from "../../components/aisp/Asterix";
import Helper from "../../utils/aisService";
import Service from "../../utils/amsService";
import { useUserStore } from "../../utils/authService";
import { CgSpinner } from "react-icons/cg";

type Props = {};

// Save Form
export async function action({ request, params }) {
  const { user, stepUrl } = useUserStore.getState() ?? null;
  const serial = user?.user?.tag;
  const formData = await request.formData();
  let data = Object.fromEntries(formData);
  data.serial = serial;
  data.dob = moment(data.dob);
  if (!data.disabilityId) delete data.disabilityId;
  console.log(data);
  let resp = await Service.saveStepProfile(data);
  if (resp) {
    return redirect(stepUrl.nextUrl);
  }
  return null;
}

// Load Data of Single
export async function loader({ params }) {
  const { user, stepUrl } = useUserStore.getState() ?? null;
  const serial = user?.user?.tag;
  const regions = await Helper.fetchRegions();
  const countries = await Helper.fetchCountries();
  const religions = await Helper.fetchReligions();
  const disabilities = await Helper.fetchDisabilities();
  const titles = await Helper.fetchTitles();
  const marital = await Helper.fetchMarital();
  const data = await Service.fetchStepProfile(serial);
  return {
    data,
    regions,
    countries,
    religions,
    disabilities,
    titles,
    marital,
    stepUrl,
  };
}

function PgStepProfile({}: Props) {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const {
    data,
    regions,
    countries,
    religions,
    disabilities,
    titles,
    marital,
    stepUrl,
  }: any = useLoaderData();

  return (
    <main className="p-2">
      <div className="p-3 border bg-slate-50/50 rounded-xl space-y-4">
        <section className="px-3 py-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex-1 flex flex-col space-y-6">
            <h1 className="px-3 py-1 rounded-md border md:border-0 text-base md:text-xl tracking-wide font-semibold text-primary/80 uppercase">
              Profile Information{" "}
            </h1>
          </div>
        </section>

        <fetcher.Form
          method="post"
          encType="multipart/form-data"
          className="w-full grid grid-cols-1 gap-y-2"
        >
          {/* Record */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-y-2 md:gap-y-0 md:gap-x-2">
            <div className="p-3 md:py-6 md:px-6 border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Preferred Session <Asterix />
                </span>
                <select
                  arial-label="studyMode"
                  name="studyMode"
                  defaultValue={data?.studyMode}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value={`M`}>MORNING</option>
                  <option value={`E`}>EVENING</option>
                  <option value={`W`}>WEEKEND</option>
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Preferred Residential Status <Asterix />
                </span>
                <select
                  arial-label="residentialStatus"
                  name="residentialStatus"
                  defaultValue={data?.residentialStatus}
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value={`RESIDENTIAL`}>RESIDENTIAL</option>
                  <option value={`NON_RESIDENTIAL`}>NON RESIDENTIAL</option>
                </select>
              </label>
              <hr className="outline-none border-b rounded-full border-primary/50" />
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Title
                </span>
                <select
                  arial-label="titleId"
                  name="titleId"
                  defaultValue={data?.titleId}
                  required
                  className="capitalize focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  {titles &&
                    titles?.map((row: any) => (
                      <option key={row.id} value={row.id}>
                        {row.label?.toUpperCase()}
                      </option>
                    ))}
                </select>
              </label>
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
                  defaultValue={moment(data?.dob).format("YYYY-MM-DD")}
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
                  Religion
                </span>
                <select
                  arial-label="religionId"
                  name="religionId"
                  defaultValue={data?.religionId}
                  required
                  className="capitalize focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  {religions &&
                    religions?.map((row: any) => (
                      <option key={row.id} value={row.id}>
                        {row.title?.toUpperCase()}
                      </option>
                    ))}
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Marital Status
                </span>
                <select
                  arial-label="maritalId"
                  name="maritalId"
                  defaultValue={data?.maritalId}
                  required
                  className="capitalize focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  {marital &&
                    marital?.map((row: any) => (
                      <option key={row.id} value={row.id}>
                        {row.title?.toUpperCase()}
                      </option>
                    ))}
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  If with <b>Disability</b>, Please select category or{" "}
                  <b>No disability</b> ?
                </span>
                <select
                  arial-label="disabilityId"
                  name="disabilityId"
                  defaultValue={data?.disabilityId}
                  className="capitalize focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  {/* <option selected value="">NO DISABILITY</option> */}
                  {disabilities &&
                    disabilities?.map((row: any) => (
                      <option key={row.id} value={row.id}>
                        {row.title?.toUpperCase()}
                      </option>
                    ))}
                </select>
              </label>
            </div>

            <div className="p-3 md:py-6 md:pb-10 md:px-6 border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-66">
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
                  Home Region
                </span>
                <select
                  arial-label="regionId"
                  name="regionId"
                  defaultValue={data?.regionId}
                  required
                  className="capitalize focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  {regions &&
                    regions?.map((row: any) => (
                      <option key={row.id} value={row.id}>
                        {row.title?.toLowerCase()}
                      </option>
                    ))}
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Country of Citizenship
                </span>
                <select
                  arial-label="nationalityId"
                  name="nationalityId"
                  defaultValue={data?.nationalityId}
                  required
                  className="capitalize focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  {countries &&
                    countries?.map((row: any) => (
                      <option key={row.id} value={row.id}>
                        {row.longName?.toLowerCase()}
                      </option>
                    ))}
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Country of Residence
                </span>
                <select
                  arial-label="countryId"
                  name="countryId"
                  defaultValue={data?.countryId}
                  required
                  className="capitalize focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  {countries &&
                    countries?.map((row: any) => (
                      <option key={row.id} value={row.id}>
                        {row.longName?.toLowerCase()}
                      </option>
                    ))}
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Phone Number <Asterix />
                </span>
                <input
                  arial-label="phone"
                  name="phone"
                  defaultValue={data?.phone}
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
                  Residential Address <Asterix />
                </span>
                <textarea
                  arial-label="residentAddress"
                  name="residentAddress"
                  defaultValue={data?.residentAddress}
                  required
                  className="uppercase focus:ring-0 border focus:border-slate-300 border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                ></textarea>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Postal Address <Asterix />
                </span>
                <textarea
                  arial-label="postalAddress"
                  name="postalAddress"
                  defaultValue={data?.postalAddress}
                  className="uppercase focus:ring-0 border focus:border-slate-300 border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                ></textarea>
              </label>

              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Occupation <Asterix />
                </span>
                <input
                  arial-label="occupation"
                  name="occupation"
                  defaultValue={data?.occupation}
                  className="uppercase focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>

              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Place of Work <Asterix />
                </span>
                <input
                  arial-label="workPlace"
                  name="workPlace"
                  defaultValue={data?.workPlace}
                  className="uppercase focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  If <b>bonded</b>, Please state the organisation
                </span>
                <input
                  arial-label="ghcard_no"
                  name="bondInstitute"
                  defaultValue={data?.bondInstitute}
                  className="uppercase focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
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

              {/* <hr className="md:hidden border-dashed" />
                  <div className="md:hidden flex items-center space-x-4">
                    <Link to={stepUrl?.prevUrl} className="py-1 px-4 rounded-md  bg-slate-50 border text-sm text-gray-600">PREVIOUS</Link>
                    <button className="py-1 px-4 md:w-96 rounded-md bg-primary/70 text-white font-semibold" type="submit">NEXT</button>
                    <button onClick={() => { if(confirm('Cancel')) navigate('/login') }} className="py-1 px-4 rounded-md  bg-slate-50 border text-sm text-gray-600" type="button">EXIT</button>
                  </div> */}
            </div>
          </div>
          <div className="p-3 md:py-6 md:px-6 border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-66">
            <div className="flex items-center space-x-4">
              <Link
                to={stepUrl?.prevUrl}
                className="py-1 px-4 rounded-md  bg-slate-50 border text-sm text-gray-600"
              >
                PREVIOUS
              </Link>
              <button
                  className="py-1 px-4 md:w-96 rounded-md bg-primary/70 disabled:bg-primary/40 text-white font-semibold flex items-center justify-center space-x-2"
                  type="submit"
                  disabled={fetcher.state !== "idle"}
                >
                  { fetcher.state !== "idle" ? 
                    <div className="flex items-center justify-center space-x-2">
                      <CgSpinner className="my-1 h-5 w-5 animate-spin" />
                      <span className="text-sm text-white font-semibold">SAVING ...</span>
                    </div> : 
                    'NEXT'
                  }
                </button>
              <button
                onClick={() => {
                  if (confirm("Cancel")) navigate("/login");
                }}
                className="py-1 px-4 rounded-md  bg-slate-50 border text-sm text-gray-600"
                type="button"
              >
                EXIT
              </button>
            </div>
          </div>
        </fetcher.Form>
      </div>
    </main>
  );
}

export default PgStepProfile;
