import moment from "moment";
import React from "react";
import {
  Form,
  redirect,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import SubPageTitle from "../../components/ais/SubPageTitle";
import Helper from "../../utils/aisService";
import Service from "../../utils/amsService";

type Props = {};

// Save Form
export async function action({ request, params }) {
  const id = params?.sessionId || 0;
  const formData = await request.formData();
  let data = Object.fromEntries(formData);
  data.applyStart = moment(data.applyStart);
  data.applyEnd = moment(data.applyEnd);
  data.admittedAt = moment(data.admittedAt);
  data.applyPause = data.applyPause == 1;
  data.showAdmitted = data.showAdmitted == 1;
  data.status = data.status == 1;
  data.default = data.default == 1;
  data.voucherIndex = Number(data.voucherIndex);

  let resp;
  if (id != 0) resp = await Service.updateSession(id, data);
  else resp = await Service.postSession(data);

  if (resp) {
    // return redirect(`/ais/courses/${encodeURIComponent(resp.id)}/profile`)
    return redirect(`/ams/sessions`);
  }
}
// Load Data of Single
export async function loader({ params }) {
  let data = { id: "" };
  const sessions = await Helper.fetchSessionList();
  const letters = await Service.fetchLetterList();

  const id = params?.sessionId || 0;
  if (id != 0) data = await Service.fetchSession(id);
  return { data, sessions, letters };
}

function PgAMSSessionForm({}: Props) {
  const navigate = useNavigate();
  const { data, sessions, letters }: any = useLoaderData();
  const navigation = useNavigation();
  const loading = navigation?.state;

  return (
    <main className="md:pl-10 p-2 md:p-6 space-y-4 md:space-y-10">
      <SubPageTitle
        title={`${data?.id ? "Edit" : "Create"} Session`}
        page="Admission Sessions"
      />
      <div className="p-2 md:p-6 border bg-slate-50/50 rounded-xl space-y-6">
        <section className="flex md:space-x-6">
          <div className="flex-1 flex flex-col space-y-1 md:space-y-3">
            <h1 className="text-lg md:text-2xl tracking-wide font-semibold text-primary-accent/80">
              {data?.id ? "Edit" : "Create"} Admission Session
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
            {/* <h1 className="py-0.5 px-2 md:px-4 w-fit text-xs md:text-base font-semibold rounded-md bg-primary-accent/80 text-white tracking-widest uppercase -skew-x-6">General Information</h1> */}
            <div className="md:pl-6 space-y-4">
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Title
                </span>
                <input
                  arial-label="title"
                  name="title"
                  defaultValue={data?.title}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Application Open Date
                </span>
                <input
                  arial-label="applyStart"
                  name="applyStart"
                  defaultValue={
                    data?.applyStart &&
                    moment(data?.applyStart).format("YYYY-MM-DD")
                  }
                  type="date"
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Application Close Date
                </span>
                <input
                  arial-label="applyEnd"
                  name="applyEnd"
                  defaultValue={
                    data?.applyEnd &&
                    moment(data?.applyEnd).format("YYYY-MM-DD")
                  }
                  type="date"
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Date of Admission
                </span>
                <input
                  arial-label="admittedAt"
                  name="admittedAt"
                  type="date"
                  defaultValue={
                    data?.admittedAt &&
                    moment(data?.admittedAt).format("YYYY-MM-DD")
                  }
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>
              {/* <hr/> */}
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Pause Applications?
                </span>
                <select
                  arial-label="applyPause"
                  name="applyPause"
                  defaultValue={Number(data?.applyPause)}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value={0}>NO</option>
                  <option value={1}>YES</option>
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Show Admission Status?
                </span>
                <select
                  arial-label="showAdmitted"
                  name="showAdmitted"
                  defaultValue={Number(data?.showAdmitted)}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value={0}>NO</option>
                  <option value={1}>YES</option>
                </select>
              </label>
            </div>
          </div>

          <div className="p-3 md:py-6 md:pb-10 md:px-6 w-full border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
            <div className="md:pl-6 space-y-4">
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Starting Academic Session
                </span>
                <select
                  arial-label="sessionId"
                  name="sessionId"
                  defaultValue={data?.sessionId}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  {sessions &&
                    sessions?.map((row: any) => (
                      <option key={row.id} value={row.id}>
                        {row.title?.toUpperCase()}{" "}
                        {row.tag && `(${row.tag.toUpperCase()})`}{" "}
                        {row.default && `- CURRENT`}
                      </option>
                    ))}
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Certificate Admission Letter Template
                </span>
                <select
                  arial-label="cpletterId"
                  name="cpletterId"
                  defaultValue={data?.cpletterId}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  {letters &&
                    letters?.map((row: any) => (
                      <option key={row.id} value={row.id}>
                        {row.title?.toUpperCase()}
                      </option>
                    ))}
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Diploma Admission Letter Template
                </span>
                <select
                  arial-label="dpletterId"
                  name="dpletterId"
                  defaultValue={data?.dpletterId}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  {letters &&
                    letters?.map((row: any) => (
                      <option key={row.id} value={row.id}>
                        {row.title?.toUpperCase()}
                      </option>
                    ))}
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Undergrad Admission Letter Template
                </span>
                <select
                  arial-label="ugletterId"
                  name="ugletterId"
                  defaultValue={data?.ugletterId}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  {letters &&
                    letters?.map((row: any) => (
                      <option key={row.id} value={row.id}>
                        {row.title?.toUpperCase()}
                      </option>
                    ))}
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Postgrad Admission Letter Template
                </span>
                <select
                  arial-label="pgletterId"
                  name="pgletterId"
                  defaultValue={data?.pgletterId}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  {letters &&
                    letters?.map((row: any) => (
                      <option key={row.id} value={row.id}>
                        {row.title?.toUpperCase()}
                      </option>
                    ))}
                </select>
              </label>
              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Voucher Generation Start Index
                </span>
                <input
                  arial-label="voucherIndex"
                  name="voucherIndex"
                  type="number"
                  defaultValue={data?.voucherIndex}
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                />
              </label>

              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Visibility Status
                </span>
                <select
                  arial-label="status"
                  name="status"
                  defaultValue={Number(data?.status)}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value={0}>DISABLED</option>
                  <option value={1}>ENABLED</option>
                </select>
              </label>

              <label className="flex flex-col space-y-2">
                <span className="text-sm md:text-base text-gray-500 font-medium">
                  Default?
                </span>
                <select
                  arial-label="default"
                  name="default"
                  defaultValue={Number(data?.default)}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                >
                  <option selected disabled>
                    -- Choose --
                  </option>
                  <option value={0}>DISABLED</option>
                  <option value={1}>ENABLED</option>
                </select>
              </label>

              <div className="flex items-center">
                {/* <input type="hidden" name="studentId" defaultValue={data?.id} /> */}
                <button
                  disabled={loading === "submitting"}
                  className="mr-4 py-1 px-4 w-4/5 rounded-md bg-primary-accent/80 text-white font-semibold disabled:opacity-50 disabled:animate-pulse"
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

export default PgAMSSessionForm;
