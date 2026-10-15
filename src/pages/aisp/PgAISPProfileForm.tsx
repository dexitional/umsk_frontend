import moment from "moment";
import React, { useState } from "react";
import toast from "react-hot-toast";
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

// dob is stored as UTC midnight -- read the calendar date in UTC so it
// doesn't shift a day in timezones west of GMT.
const toDateInput = (d?: string) => (d ? moment.utc(d).format("YYYY-MM-DD") : "");

// Save Form
export async function action({ request, params }) {
  const user = useUserStore.getState().user;
  const id = user?.user?.tag || 0;
  const formData = await request.formData();
  // Only the fields on this form. dob / instituteAffliate are absent once
  // their one-time edit is used up (disabled inputs aren't submitted), and
  // the server ignores anything a student isn't allowed to change.
  const data: any = Object.fromEntries(formData);
  if (!data.dob) delete data.dob;
  if (!data.instituteAffliate) delete data.instituteAffliate;

  try {
    const resp = await Service.updateStudent(id, data);
    if (resp) return redirect(`/aisp/profile`);
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Profile update failed");
  }
  return null;
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
  const halls = await Service.fetchHalls();
  const user = useUserStore.getState().user;
  const data = await Service.fetchStudent(user?.user?.tag);

  return { data, countries, regions, religions, disabilities, titles, majors, halls };
}

function PgAISPProfileForm({}: Props) {
  const navigate = useNavigate();
  const { data, countries, regions, religions, disabilities, titles, majors, halls }: any =
    useLoaderData();
  const dobLocked = !!data?.dobEditedAt;
  const hallLocked = !!data?.affiliateEditedAt;

  // Date of Birth and Hall of Affiliation can each be changed only once --
  // confirm before a save that would use that up.
  const confirmOneTimeEdits = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const changed: string[] = [];
    const dob = (form.elements.namedItem("dob") as HTMLInputElement)?.value;
    const hall = (form.elements.namedItem("instituteAffliate") as HTMLSelectElement)?.value;
    if (!dobLocked && dob && dob !== toDateInput(data?.dob)) changed.push("Date of Birth");
    if (!hallLocked && hall && hall.toUpperCase() !== (data?.instituteAffliate || "").trim().toUpperCase()) changed.push("Hall of Affiliation");
    if (changed.length && !window.confirm(`${changed.join(" and ")} can only be changed ONCE from the portal. Further corrections will require the College Registry.\n\nSave this change?`)) {
      e.preventDefault();
    }
  };
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

      <Form method="post" onSubmit={confirmOneTimeEdits} className="grid lg:grid-cols-2 gap-6 items-start">
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
              <span className="aisp-label">Personal Email Address</span>
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
            <label className="flex flex-col gap-2">
              <span className="aisp-label">Residential Status</span>
              <select
                arial-label="residentialStatus"
                name="residentialStatus"
                defaultValue={data?.residentialStatus || ""}
                className="aisp-input"
              >
                <option value="" disabled>
                  -- Choose --
                </option>
                <option value="RESIDENTIAL">RESIDENTIAL</option>
                <option value="NON_RESIDENTIAL">NON-RESIDENTIAL</option>
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="aisp-label">Guardian Name</span>
              <input
                arial-label="guardianName"
                name="guardianName"
                defaultValue={data?.guardianName}
                maxLength={350}
                className="aisp-input"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="aisp-label">Guardian Phone</span>
              <input
                arial-label="guardianPhone"
                name="guardianPhone"
                type="tel"
                minLength={10}
                maxLength={15}
                defaultValue={data?.guardianPhone}
                className="aisp-input"
              />
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
              <span className="aisp-label">Date of Birth</span>
              <input
                arial-label="dob"
                name="dob"
                type="date"
                defaultValue={toDateInput(data?.dob)}
                max={moment().subtract(10, "years").format("YYYY-MM-DD")}
                disabled={dobLocked}
                className="aisp-input disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <span className="text-xs text-slate-500">
                {dobLocked
                  ? `Changed on ${moment(data?.dobEditedAt).format("MMM D, YYYY")}. Contact the College Registry for further corrections.`
                  : "You can change this only once."}
              </span>
            </label>
            <label className="flex flex-col gap-2">
              <span className="aisp-label">Hall of Affiliation</span>
              <select
                arial-label="instituteAffliate"
                name="instituteAffliate"
                defaultValue={data?.instituteAffliate?.trim() || ""}
                disabled={hallLocked}
                className="aisp-input disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="" disabled>
                  -- Choose --
                </option>
                {halls &&
                  halls?.map((hall: string) => (
                    <option key={hall} value={hall}>
                      {hall}
                    </option>
                  ))}
              </select>
              <span className="text-xs text-slate-500">
                {hallLocked
                  ? `Changed on ${moment(data?.affiliateEditedAt).format("MMM D, YYYY")}. Contact the College Registry for further corrections.`
                  : "You can change this only once."}
              </span>
            </label>
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
              <span className="aisp-label">Disability</span>
              <select
                arial-label="disabilityId"
                name="disabilityId"
                defaultValue={data?.disabilityId || "NONE"}
                className="aisp-input"
              >
                <option value="NONE">-- None --</option>
                {disabilities &&
                  disabilities?.map((row: any) => (
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
