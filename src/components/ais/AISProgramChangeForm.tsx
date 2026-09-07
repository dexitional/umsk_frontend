import moment from "moment";
import React, { useState } from "react";
import {
  Form,
  redirect,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import SubPageTitle from "./SubPageTitle";
import Service from "../../utils/aisService";

type Props = {};

// Save Form
export async function action({ request, params }) {
  const id = params?.studentId || 0;
  const formData = await request.formData();
  let data = Object.fromEntries(formData);
  data.dob = moment(data.dob);
  data.entryDate = moment(data.entryDate);
  data.semesterNum = Number(data.semesterNum);
  data.completeStatus = data.completeStatus == 1;
  data.deferStatus = data.deferStatus == 1;
  data.graduateStatus = data.graduateStatus == 1;
  console.log(data);

  let resp;
  if (id != 0) resp = await Service.updateStudent(id, data);
  else resp = await Service.postStudent(data);

  if (resp) {
    return redirect(`/ais/students/${encodeURIComponent(resp.id)}/profile`);
  }
}
// Load Data of Single
export async function loader({ params }) {
  let data = { id: 0 };
  const countries = await Service.fetchCountries();
  const regions = await Service.fetchRegions();
  const religions = await Service.fetchReligions();
  const disabilities = await Service.fetchDisabilities();
  const titles = await Service.fetchTitles();
  const programs = await Service.fetchProgramList();
  const majors = await Service.fetchMajorList();

  const id = params?.studentId || 0;
  if (id != 0) data = await Service.fetchStudent(id);
  return {
    data,
    countries,
    regions,
    religions,
    disabilities,
    titles,
    programs,
    majors,
  };
}

function AISProgramChangeForm({}: Props) {
  const navigate = useNavigate();
  const {
    data,
    countries,
    regions,
    religions,
    disabilities,
    titles,
    programs,
    majors,
  }: any = useLoaderData();
  const [programId, setprogramId] = useState(data.programId);
  const navigation = useNavigation();
  const loading = navigation?.state;

  return (
    <main className="md:pl-10 p-2 md:p-6 space-y-4 md:space-y-10">
      <SubPageTitle
        title={`${data?.id ? "Edit" : "Create"} Student`}
        page="Student Profile"
      />
      <div className="p-2 md:p-6 border bg-slate-50/50 rounded-xl space-y-6">
        <section className="flex md:space-x-6">
          <div className="flex-1 flex flex-col space-y-1 md:space-y-3">
            <h1 className="text-lg md:text-2xl tracking-wide font-semibold text-primary/70">
              {data?.id ? "Edit" : "Create"} Student
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
              Personal Information
            </h1>
            <div className="md:pl-6 space-y-4">
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Title
                </span>
                <select
                  arial-label="titleId"
                  name="titleId"
                  defaultValue={data?.titleId}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  {titles &&
                    titles?.map((row: any) => (
                      <option key={row.id} value={row.id}>
                        {row.label}
                      </option>
                    ))}
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  First Name
                </span>
                <input
                  arial-label="fname"
                  name="fname"
                  defaultValue={data?.fname}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
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
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Last Name
                </span>
                <input
                  arial-label="lname"
                  name="lname"
                  defaultValue={data?.lname}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Date of Birth
                </span>
                <input
                  arial-label="dob"
                  name="dob"
                  type="date"
                  defaultValue={
                    data?.dob && moment(data?.dob).format("YYYY-MM-DD")
                  }
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Gender
                </span>
                <select
                  arial-label="gender"
                  name="gender"
                  defaultValue={data?.gender}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value="M">MALE</option>
                  <option value="F">FEMALE</option>
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Phone Number
                </span>
                <input
                  arial-label="phone"
                  name="phone"
                  type="tel"
                  minLength={10}
                  maxLength={10}
                  defaultValue={data?.phone}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Email Address
                </span>
                <input
                  arial-label="email"
                  name="email"
                  type="email"
                  defaultValue={data?.email}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Hometown
                </span>
                <input
                  arial-label="hometown"
                  name="hometown"
                  defaultValue={data?.hometown}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Residential Address
                </span>
                <textarea
                  arial-label="address"
                  name="address"
                  defaultValue={data?.address}
                  rows={5}
                  className="focus:ring-0 border focus:border-slate-300 border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                ></textarea>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Disability
                </span>
                <select
                  arial-label="disabilityId"
                  name="disabilityId"
                  defaultValue={data?.disabilityId}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- NO DISABILITY --
                  </option>
                  {disabilities &&
                    disabilities?.map((row: any) => (
                      <option key={row.id} value={row.id}>
                        {row.title}
                      </option>
                    ))}
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
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  {religions &&
                    religions?.map((row: any) => (
                      <option key={row.id} value={row.id}>
                        {row.title}
                      </option>
                    ))}
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Region
                </span>
                <select
                  arial-label="regionId"
                  name="regionId"
                  defaultValue={data?.regionId}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  {regions &&
                    regions?.map((row: any) => (
                      <option key={row.id} value={row.id}>
                        {row.title}
                      </option>
                    ))}
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Country of Citizenship
                </span>
                <select
                  arial-label="countryId"
                  name="countryId"
                  defaultValue={data?.countryId}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  {countries &&
                    countries?.map((row: any) => (
                      <option key={row.id} value={row.id}>
                        {row.longName}
                      </option>
                    ))}
                </select>
              </label>

              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Date of Admission
                </span>
                <input
                  arial-label="entryDate"
                  name="entryDate"
                  type="date"
                  defaultValue={
                    data?.entryDate &&
                    moment(data?.entryDate).format("YYYY-MM-DD")
                  }
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>

            </div>
          </div>

          <div className="p-3 md:py-6 md:pb-10 md:px-6 w-full border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
            <h1 className="py-0.5 px-2 md:px-4 w-fit text-xs md:text-base font-semibold rounded-md bg-primary-dark/60 text-white tracking-widest uppercase -skew-x-6">
              Emergency Information
            </h1>
            <div className="md:pl-6 space-y-4">
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Guardian Name
                </span>
                <input
                  arial-label="guardianName"
                  name="guardianName"
                  defaultValue={data?.guardianName}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Guardian Phone
                </span>
                <input
                  arial-label="guardianPhone"
                  name="guardianPhone"
                  defaultValue={data?.guardianPhone}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Ghana Card Number
                </span>
                <input
                  arial-label="ghcardNo"
                  name="ghcardNo"
                  defaultValue={data?.ghcardNo}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
            </div>

            <h1 className="py-0.5 px-2 md:px-4 w-fit text-xs md:text-base font-semibold rounded-md bg-primary-dark/60 text-white tracking-widest uppercase -skew-x-6">
              Academic Information
            </h1>
            <div className="md:pl-6 space-y-4">
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Student Number
                </span>
                <input
                  arial-label="id"
                  name="id"
                  defaultValue={data?.id}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Index Number
                </span>
                <input
                  arial-label="indexno"
                  name="indexno"
                  defaultValue={data?.indexno}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Programme
                </span>
                <select
                  arial-label="programId"
                  name="programId"
                  defaultValue={data?.programId}
                  required
                  onChange={(e) => setprogramId(e.target.value)}
                  className="w-full focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  {programs &&
                    programs?.map((row: any) => {
                      const category =
                        row.category == "CP"
                          ? "CERTIFICATE"
                          : row.category == "DP"
                          ? "DIPLOMA"
                          : "DEGREE";
                      return (
                        <option key={row.id} value={row.id}>
                          {row.longName} {category ? `( ${category} )` : ""}
                        </option>
                      );
                    })}
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Major
                </span>
                <select
                  arial-label="majorId"
                  name="majorId"
                  defaultValue={data?.majorId}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected value="NONE">
                    -- NONE --
                  </option>
                  {majors &&
                    majors?.map((row: any) => {
                      if (programId == row.programId)
                        return (
                          <option key={row.id} value={row.id}>
                            {row.longName}
                          </option>
                        );
                      return null;
                    })}
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Study Mode
                </span>
                <select
                  arial-label="deferStatus"
                  name="studyMode"
                  defaultValue={data?.studyMode}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value="M">MORNING</option>
                  <option value="W">WEEKEND</option>
                  <option value="E">EVENING</option>
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Program Level
                </span>
                <select
                  arial-label="semesterNum"
                  name="semesterNum"
                  defaultValue={Number(data?.semesterNum)}
                  required
                  className="w-full focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value={1}>YEAR 1, SEMESTER 1</option>
                  <option value={2}>YEAR 1, SEMESTER 2</option>
                  <option value={3}>YEAR 2, SEMESTER 1</option>
                  <option value={4}>YEAR 2, SEMESTER 2</option>
                  <option value={5}>YEAR 3, SEMESTER 1</option>
                  <option value={6}>YEAR 3, SEMESTER 2</option>
                  <option value={7}>YEAR 4, SEMESTER 1</option>
                  <option value={8}>YEAR 4, SEMESTER 2</option>
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Residential Status
                </span>
                <select
                  arial-label="residentialStatus"
                  name="residentialStatus"
                  defaultValue={data?.residentialStatus}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value="RESIDENTIAL">RESIDENTIAL</option>
                  <option value="NON_RESIDENTIAL">NON-RESIDENTIAL</option>
                </select>
              </label>
             
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Institutional Email Address
                </span>
                <input
                  arial-label="instituteEmail"
                  name="instituteEmail"
                  defaultValue={data?.instituteEmail}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Deferred Status
                </span>
                <select
                  arial-label="deferStatus"
                  name="deferStatus"
                  defaultValue={Number(data?.deferStatus)}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value="0">NOT DEFERRED</option>
                  <option value="1">DEFERRED</option>
                </select>
              </label>

              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Completed Status
                </span>
                <select
                  arial-label="completeStatus"
                  name="completeStatus"
                  defaultValue={Number(data?.completeStatus)}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value="0">NOT COMPLETED</option>
                  <option value="1">COMPLETED</option>
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Student Status
                </span>
                <select
                  arial-label="completeType"
                  name="completeType"
                  defaultValue={data?.completeType}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected>
                    -- Choose --
                  </option>
                  <option value="GRADUATION">GRADUATED</option>
                  <option value="RASTICATED">RASTICATED</option>
                  <option value="FORFEITED">FORFEITED</option>
                  <option value="DISMISSED">DISMISSED</option>
                  <option value="DEAD">DEAD</option>
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Graduated Status
                </span>
                <select
                  arial-label="graduateStatus"
                  name="graduateStatus"
                  defaultValue={Number(data?.graduateStatus)}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value="0">NOT GRADUATED</option>
                  <option value="1">GRADUATED</option>
                </select>
              </label>
              {/* <label className="flex flex-col space-y-2">
                      <span className="text-sm md:text-base text-gray-500 font-medium">Certificate Number</span>
                      <input arial-label="graduateCertNo" name="graduateCertNo" defaultValue={data?.graduateCertNo} className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md" />
                  </label> */}

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

export default AISProgramChangeForm;
