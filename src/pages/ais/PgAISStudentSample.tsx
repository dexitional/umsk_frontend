import React, { useState } from "react";
import {
  Form,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import SubPageTitle from "../../components/ais/SubPageTitle";
import Service from "../../utils/aisService";
import { jsonToExcel } from "../../utils/util";

type Props = {};

// Builds a template sheet for the Student Module's bulk "Upload" button.
// ApplicantID maps straight onto student.id (same as the single-create
// form's free-typed "Student Number" field). yearGroup (1, 2, 3, ...) maps
// to the first-semester value of that year on student.semesterNum --
// YEAR 1 = 1, YEAR 2 = 3, YEAR 3 = 5, matching the single-create form's
// "Program Year and Semester" options.
export async function action({ request }) {
  const formData = await request.formData();
  let data: any = Object.fromEntries(formData);
  data.ApplicantID = "APP0001";
  data.fname = "JOHN";
  data.mname = "";
  data.lname = "DOE";
  data.dob = "2000-01-01";
  data.yearGroup = "1";
  data.gender = "M";
  data.email = "example@domain.com";
  data.phone = "0244000000";
  data.address = "P.O. BOX 123, ACCRA";
  data.hometown = "CAPE COAST";

  jsonToExcel([data], `STUDENT_UPLOAD_SAMPLE`);
  return false;
}

export async function loader() {
  const programs = await Service.fetchProgramList();
  const majors = await Service.fetchMajorList();
  return { programs, majors };
}

function PgAISStudentSample({}: Props) {
  const navigate = useNavigate();
  const { programs, majors }: any = useLoaderData();
  const [programId, setProgramId] = useState("");
  const navigation = useNavigation();
  const loading = navigation?.state;

  return (
    <main className="md:pl-10 p-2 md:p-6 space-y-4 md:space-y-10">
      <SubPageTitle title={`Create Student Upload Sample`} page="Students" link="/ais/students" />
      <div className="p-2 md:p-6 border bg-slate-50/50 rounded-xl space-y-6">
        <section className="flex md:space-x-6">
          <div className="flex-1 flex flex-col space-y-1 md:space-y-3">
            <h1 className="text-lg md:text-2xl tracking-wide font-semibold text-primary/70">
              Create Student Upload Sample
            </h1>
            <div className="flex items-center space-x-2 text-zinc-400 text-base">
              <span className="text-xs md:text-base tracking-wider">
                Please provide neccessary information
              </span>
            </div>
          </div>
        </section>

        <Form method="post" className="grid md:grid-cols-1 gap-y-2 md:gap-y-4">
          <div className="p-3 md:py-6 md:pb-10 md:px-6 border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
            <h1 className="py-0.5 px-2 md:px-4 w-fit text-xs md:text-base font-semibold rounded-md bg-primary-dark/60 text-white tracking-widest uppercase -skew-x-6">
              General Information
            </h1>
            <div className="md:pl-6 space-y-4">
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  PROGRAMME
                </span>
                <select
                  arial-label="programId"
                  name="programId"
                  required
                  onChange={(e) => setProgramId(e.target.value)}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  {programs &&
                    programs?.map((row: any) => (
                      <option key={row.id} value={row.id}>
                        {row.longName?.toUpperCase()}
                      </option>
                    ))}
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  MAJOR
                </span>
                <select
                  arial-label="majorId"
                  name="majorId"
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected value="">
                    -- NONE --
                  </option>
                  {majors &&
                    majors?.map((row: any) => {
                      if (programId == row.programId)
                        return (
                          <option key={row.id} value={row.id}>
                            {row.longName?.toUpperCase()}
                          </option>
                        );
                      return null;
                    })}
                </select>
              </label>
            </div>
          </div>
          <div className="flex items-center">
            <button
              disabled={loading === "submitting"}
              className="mr-4 py-1 px-4 w-4/5 rounded-md bg-primary/70 text-white font-semibold disabled:opacity-50 disabled:animate-pulse"
              type="submit"
            >
              {loading === "submitting" ? (
                <span className="animate-pulse">GENERATING ...</span>
              ) : (
                " GENERATE"
              )}
            </button>
            <button
              disabled={loading === "submitting"}
              onClick={() => {
                if (confirm("Cancel")) navigate("/ais/students");
              }}
              className="py-1 px-4 rounded-md  bg-slate-50 border text-sm text-gray-600"
              type="button"
            >
              CANCEL
            </button>
          </div>
        </Form>
      </div>
    </main>
  );
}

export default PgAISStudentSample;
