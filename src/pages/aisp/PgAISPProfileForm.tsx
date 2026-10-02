import moment from "moment";
import React, { useState } from "react";
import { HiOutlineGlobeAlt, HiOutlineUser, HiOutlineUserCircle } from "react-icons/hi2";
import AISPPageHeader from "../../components/aisp/AISPPageHeader";
import { Form, redirect, useLoaderData, useNavigate } from "react-router-dom";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";

type Props = {};

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
    <div className="space-y-6 md:space-y-8">
      <AISPPageHeader photo="gate"
        eyebrow="My Profile"
        title={`${data?.id ? "Edit" : "Create"} Student Profile`}
        subtitle="Keep your contact and personal details up to date."
        Icon={HiOutlineUserCircle}
      />

      <Form method="post" className="grid lg:grid-cols-2 gap-6 items-start">
        {/* Record */}
        <div className="aisp-rise aisp-card p-6 md:p-7 space-y-5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-sky-50 text-sky-600 ring-1 ring-inset ring-sky-100 flex items-center justify-center">
              <HiOutlineUser className="h-[1.1rem] w-[1.1rem]" />
            </div>
            <h2 className="text-[0.95rem] font-bold text-slate-900">Contact Information</h2>
          </div>
          <div className="space-y-4">
            <label className="flex flex-col gap-2">
              <span className="aisp-label">Title</span>
              <select
                arial-label="titleId"
                name="titleId"
                defaultValue={data?.titleId}
                required
                className="aisp-input"
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

            <label className="flex flex-col gap-2">
              <span className="aisp-label">Phone Number</span>
              <input
                arial-label="phone"
                name="phone"
                type="tel"
                minLength={10}
                maxLength={10}
                defaultValue={data?.phone}
                required
                className="aisp-input"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="aisp-label">Email Address</span>
              <input
                arial-label="email"
                name="email"
                type="email"
                defaultValue={data?.email}
                className="aisp-input"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="aisp-label">Hometown</span>
              <input
                arial-label="hometown"
                name="hometown"
                defaultValue={data?.hometown}
                className="aisp-input"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="aisp-label">Residential Address</span>
              <textarea
                arial-label="address"
                name="address"
                defaultValue={data?.address}
                rows={2}
                className="aisp-input"
              ></textarea>
            </label>
          </div>
        </div>

        <div className="aisp-rise aisp-card p-6 md:p-7 space-y-5" style={{ animationDelay: "80ms" }}>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-sky-50 text-sky-600 ring-1 ring-inset ring-sky-100 flex items-center justify-center">
              <HiOutlineGlobeAlt className="h-[1.1rem] w-[1.1rem]" />
            </div>
            <h2 className="text-[0.95rem] font-bold text-slate-900">Identity &amp; Background</h2>
          </div>
          <div className="space-y-4">
            <label className="flex flex-col gap-2">
              <span className="aisp-label">Ghana Card Number</span>
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
                className="aisp-input"
              />
            </label>
          </div>

          <div className="space-y-4">
            <label className="flex flex-col gap-2">
              <span className="aisp-label">Religion</span>
              <select
                arial-label="religionId"
                name="religionId"
                defaultValue={data?.religionId}
                required
                className="aisp-input"
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
            <label className="flex flex-col gap-2">
              <span className="aisp-label">Region</span>
              <select
                arial-label="regionId"
                name="regionId"
                defaultValue={data?.regionId}
                className="aisp-input"
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
            <label className="flex flex-col gap-2">
              <span className="aisp-label">Country of Citizenship</span>
              <select
                arial-label="countryId"
                name="countryId"
                defaultValue={data?.countryId}
                required
                className="aisp-input"
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
              <label className="flex flex-col gap-2">
                <span className="aisp-label">Major</span>
                <select
                  arial-label="majorId"
                  name="majorId"
                  defaultValue={data?.majorId}
                  required
                  className="aisp-input"
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
        </div>
      </Form>
    </div>
  );
}

export default PgAISPProfileForm;
