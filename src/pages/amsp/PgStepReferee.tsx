import React, { useState } from "react";
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
export async function action({ request }) {
  const { user, stepUrl } = useUserStore.getState() ?? null;
  const serial = user?.user?.tag;
  const formData = await request.formData();
  let mdata = Object.fromEntries(formData);
  let data: any = [];
  for (let i = 0; i < mdata.count; i++) {
    const row = {
      id: mdata[`id_${i}`],
      titleId: mdata[`titleId_${i}`],
      fname: mdata[`fname_${i}`],
      lname: mdata[`lname_${i}`],
      mname: mdata[`jobTitle_${i}`],
      phone: mdata[`phone_${i}`],
      email: mdata[`email_${i}`] || null,
      address: mdata[`address_${i}`] || null,
      occupation: mdata[`occupation_${i}`] || null,
      serial: serial,
    };
    data.push(row);
  }
  let resp = await Service.saveStepReferee(data);
  if (resp) {
    return redirect(stepUrl.nextUrl);
  }
  return null;
}

// Load Data of Single
export async function loader({ params }) {
  const { user, stepUrl } = useUserStore.getState() ?? null;
  const serial = user?.user?.tag;
  const titles = await Helper.fetchTitles();

  const data = await Service.fetchStepReferee(serial);
  return { data, stepUrl, titles };
}

function PgStepReferee({}: Props) {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const { data, stepUrl, titles }: any = useLoaderData();
  const [rows, setRows] = useState(data || [{}]);

  const years = () => {
    var yrs: any = [];
    for (var i = new Date().getFullYear(); i >= 1975; i--) {
      yrs.push(i);
    }
    return yrs;
  };

  const addRecord = (e) => {
    const cm = window.confirm(`ADD REFEREE RECORD ${rows.length + 1} ?`);
    if (cm) {
      const data = {};
      setRows([...rows, data]);
    }
  };

  const delRecord = (id) => {
    const cm = window.confirm(`REMOVE REFEREE RECORD ${id + 1} ?`);
    if (cm) {
      setRows([...rows.filter((r, i) => i !== id)]);
    }
  };

  return (
    <main className="p-2">
      <div className="p-3 border bg-slate-50/50 rounded-xl space-y-4">
        <section className="px-3 py-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex-1 flex flex-col space-y-6">
            <h1 className="px-3 py-4 md:py-1 flex flex-col md:flex-row md:items-center md:justify-between space-y-2 rounded-md border md:border-0 text-base md:text-xl tracking-wide font-semibold text-primary/80 uppercase">
              <span className="text-center">Referee Information</span>
              <button
                onClick={addRecord}
                className="px-4 py-1 w-fit rounded-full font-semibold text-xs bg-primary/70 text-white"
              >
                ADD EXTRA RECORD
              </button>
            </h1>
          </div>
        </section>
        <fetcher.Form
          method="post"
          encType="multipart/form-data"
          className="w-full grid grid-cols-1 md:grid-cols-1 gap-y-2 md:gap-y-4 md:gap-x-2"
        >
          {/* Record */}
          {rows?.map((rec, i) => (
            <div className="p-3 md:py-6 md:px-6 border rounded-lg md:rounded-xl bg-white">
              <div className="px-2 py-4 w-full flex flex-col md:flex-row space-y-2 md:space-y-0 items-center justify-between">
                <h1 className="text-sm font-semibold text-primary/70 tracking-widest">
                  REFEREE RECORD {i + 1}
                </h1>
                {i != 0 && (
                  <button
                    onClick={() => delRecord(i)}
                    className="px-4 py-1 rounded-full font-semibold text-xs bg-primary-accent text-white"
                  >
                    REMOVE
                  </button>
                )}
                <input
                  type="hidden"
                  name={`id_${i}`}
                  defaultValue={rec?.id}
                  value={rec?.id}
                />
              </div>
              <div className=" w-full grid grid-cols-1 md:grid-cols-2 gap-y-2 md:gap-x-4 ">
                <div className="px-2 space-y-4">
                  <label className="flex flex-col space-y-2">
                    <span className="text-sm md:text-base text-gray-500 font-medium">
                      Title
                    </span>
                    <select
                      arial-label="titleId"
                      name={`titleId_${i}`}
                      defaultValue={rec?.titleId}
                      required
                      className="capitalize focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                    >
                      <option selected disabled>
                        -- Choose --
                      </option>
                      {titles &&
                        titles?.map((row: any) => (
                          <option key={row.id} value={row.id}>
                            {row.label?.toLowerCase()}
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
                      name={`fname_${i}`}
                      defaultValue={rec?.fname}
                      required
                      className="uppercase focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                    />
                  </label>
                  <label className="flex flex-col space-y-2">
                    <span className="text-sm md:text-base text-gray-500 font-medium">
                      Last Name <Asterix />
                    </span>
                    <input
                      arial-label="lname"
                      name={`lname_${i}`}
                      defaultValue={rec?.lname}
                      required
                      className="uppercase focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                    />
                  </label>
                  <label className="flex flex-col space-y-2">
                    <span className="text-sm md:text-base text-gray-500 font-medium">
                      Phone Number <Asterix />
                    </span>
                    <input
                      arial-label="phone"
                      name={`phone_${i}`}
                      defaultValue={rec?.phone}
                      required
                      className="uppercase focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                    />
                  </label>
                </div>

                <div className="px-2 space-y-4">
                  <label className="flex flex-col space-y-2">
                    <span className="text-sm md:text-base text-gray-500 font-medium">
                      Middle Name{" "}
                    </span>
                    <input
                      arial-label="mname"
                      name={`mname_${i}`}
                      defaultValue={rec?.mname}
                      className="uppercase focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                    />
                  </label>
                  <label className="flex flex-col space-y-2">
                    <span className="text-sm md:text-base text-gray-500 font-medium">
                      Email Address{" "}
                    </span>
                    <input
                      arial-label="email"
                      name={`email_${i}`}
                      defaultValue={rec?.email}
                      className="uppercase focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                    />
                  </label>
                  <label className="flex flex-col space-y-2">
                    <span className="text-sm md:text-base text-gray-500 font-medium">
                      Address
                    </span>
                    <input
                      arial-label="address"
                      name={`address_${i}`}
                      defaultValue={rec?.address}
                      required
                      className="uppercase focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                    />
                  </label>
                  <label className="flex flex-col space-y-2">
                    <span className="text-sm md:text-base text-gray-500 font-medium">
                      Occupation{" "}
                    </span>
                    <input
                      arial-label="occupation"
                      name={`occupation_${i}`}
                      defaultValue={rec?.occupation}
                      className="uppercase focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                    />
                  </label>
                </div>
              </div>
            </div>
          ))}

          <div className="p-3 md:py-6 md:px-6 border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-66">
            <div className="px-2 space-y-4">
              <div className="flex items-center space-x-4">
                <input
                  type="hidden"
                  name="count"
                  value={Number(rows?.length)}
                />
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
          </div>
        </fetcher.Form>
      </div>
    </main>
  );
}

export default PgStepReferee;
