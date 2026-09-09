import moment from "moment";
import React, { useState } from "react";
import { Form, redirect, useLoaderData, useNavigate } from "react-router-dom";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";

type Props = {};

const inputClass =
  "w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-secondary-accent/20 focus:border-secondary-accent/40 transition-colors";
const labelClass = "text-xs font-semibold text-slate-500 uppercase tracking-wider";

// Ghana Card format: GHA-XXXXXXXXX-X — a 3-letter prefix, 9 digits, a
// hyphen, then 1 final check digit (10 digits total in the numbered block).
const GHANA_CARD_PATTERN = "GHA-\\d{9}-\\d{1}";
function formatGhanaCard(raw: string): string {
  const digits = (raw || "")
    .toUpperCase()
    .replace(/^GHA-?/, "")
    .replace(/[^0-9]/g, "")
    .slice(0, 10);
  if (!digits) return "GHA-";
  let formatted = "GHA-" + digits.slice(0, 9);
  if (digits.length > 9) formatted += "-" + digits.slice(9);
  return formatted;
}

// Save Form
export async function action({ request, params }) {
  const user = useUserStore.getState().user;
  const id = user?.user?.tag || 0;
  const formData = await request.formData();
  let data = Object.fromEntries(formData);
  data.dob = moment(data.dob);
  data.entryDate = moment(data.entryDate);
  data.completeStatus = data.completeStatus == 1;
  data.deferStatus = data.deferStatus == 1;
  data.graduateStatus = data.graduateStatus == 1;
  delete data.indexno;

  let resp;
  if (id != 0) resp = await Service.updateStudent(id, data);
  else resp = await Service.postStudent(data);

  if (resp) {
    return redirect(`/aisp/profile`);
  }
}

// Load Data of Single
export async function loader() {
  const countries = await Service.fetchCountries();
  const regions = await Service.fetchRegions();
  const religions = await Service.fetchReligions();
  const disabilities = await Service.fetchDisabilities();
  const titles = await Service.fetchTitles();
  const programs = await Service.fetchProgramList();
  const majors = await Service.fetchMajorList();
  const user = useUserStore.getState().user;
  const data = await Service.fetchStudent(user?.user?.tag);

  return { data, countries, regions, religions, disabilities, titles, majors };
}

function PgAISPProfileForm({}: Props) {
  const navigate = useNavigate();
  const { data, countries, regions, religions, titles, majors }: any =
    useLoaderData();
  const [programId, setprogramId] = useState(data?.programId);
  // Major is only relevant/collected for: final-year (semester 5) UG/DP/CP
  // students, or first-semester (semester 1) PG students.
  const category = data?.program?.category;
  const canSeeMajor =
    (data?.semesterNum == 5 && ["UG", "DP", "CP"].includes(category)) ||
    (data?.semesterNum == 1 && category == "PG");

  return (
    <div className="p-4 md:p-0 space-y-6 md:space-y-8">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-primary">
          {data?.id ? "Edit" : "Create"} Student Profile
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Please provide necessary information
        </p>
      </div>

      <Form method="post" className="grid md:grid-cols-2 gap-6">
        {/* Record */}
        <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-primary">
            Personal Information
          </h2>
          <div className="space-y-4">
            <label className="flex flex-col space-y-1.5">
              <span className={labelClass}>Title</span>
              <select
                arial-label="titleId"
                name="titleId"
                defaultValue={data?.titleId}
                required
                className={inputClass}
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

            <label className="flex flex-col space-y-1.5">
              <span className={labelClass}>Phone Number</span>
              <input
                arial-label="phone"
                name="phone"
                type="tel"
                minLength={10}
                maxLength={10}
                defaultValue={data?.phone}
                required
                className={inputClass}
              />
            </label>
            <label className="flex flex-col space-y-1.5">
              <span className={labelClass}>Email Address</span>
              <input
                arial-label="email"
                name="email"
                type="email"
                defaultValue={data?.email}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col space-y-1.5">
              <span className={labelClass}>Hometown</span>
              <input
                arial-label="hometown"
                name="hometown"
                defaultValue={data?.hometown}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col space-y-1.5">
              <span className={labelClass}>Residential Address</span>
              <textarea
                arial-label="address"
                name="address"
                defaultValue={data?.address}
                rows={2}
                className={inputClass}
              ></textarea>
            </label>
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4">
          <div className="space-y-4">
            <label className="flex flex-col space-y-1.5">
              <span className={labelClass}>Ghana Card Number</span>
              <input
                arial-label="ghcardNo"
                name="ghcardNo"
                defaultValue={formatGhanaCard(data?.ghcardNo)}
                onChange={(e) => {
                  e.target.value = formatGhanaCard(e.target.value);
                }}
                placeholder="GHA-123456789-0"
                pattern={GHANA_CARD_PATTERN}
                title="Format: GHA-123456789-0"
                maxLength={15}
                className={inputClass}
              />
            </label>
          </div>

          <div className="space-y-4">
            <label className="flex flex-col space-y-1.5">
              <span className={labelClass}>Religion</span>
              <select
                arial-label="religionId"
                name="religionId"
                defaultValue={data?.religionId}
                required
                className={inputClass}
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
            <label className="flex flex-col space-y-1.5">
              <span className={labelClass}>Region</span>
              <select
                arial-label="regionId"
                name="regionId"
                defaultValue={data?.regionId}
                className={inputClass}
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
            <label className="flex flex-col space-y-1.5">
              <span className={labelClass}>Country of Citizenship</span>
              <select
                arial-label="countryId"
                name="countryId"
                defaultValue={data?.countryId}
                required
                className={inputClass}
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

            {canSeeMajor ? (
              <label className="flex flex-col space-y-1.5">
                <span className={labelClass}>Major</span>
                <select
                  arial-label="majorId"
                  name="majorId"
                  defaultValue={data?.majorId}
                  required
                  className={inputClass}
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
            ) : null}

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
        </div>
      </Form>
    </div>
  );
}

export default PgAISPProfileForm;
