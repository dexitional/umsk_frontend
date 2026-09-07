import moment from "moment";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { PiNumberCircleOneBold, PiNumberCircleTwoBold } from "react-icons/pi";
import {
  Form,
  NavLink,
  Outlet,
  redirect,
  useLoaderData,
} from "react-router-dom";
import None from "../../assets/img/add_photo.png";
import Asterix from "../../components/aisp/Asterix";
import Helper from "../../utils/aisService";
import Service from "../../utils/amsService";
import { useUserStore } from "../../utils/authService";
import { resolveAmsPhotoSrc } from "../../utils/amsFile";

type Props = {};

// Save Form
export async function action({ request, params }) {
  const user = useUserStore.getState()?.user;
  const serial = user?.user?.tag;
  const formData = await request.formData();
  const photo = formData.get("photo");

  if (photo?.size && !photo?.type?.match("image.*")) {
    toast("Please upload an image file as signature!", {
      className: "text-red-400 font-medium",
    });
    return false;
  }

  let data = Object.fromEntries(formData);
  data.serial = serial;
  if (photo?.size) data.photo = await Helper.convertBase64(photo); // Base64 conversion
  if (!photo?.size) delete data.photo;

  let resp = await Service.saveStepApplicant(data);
  if (resp) {
    const url: any = await Service.getNextPageUrl(serial);
    return redirect(url?.nextUrl);
  }
  return null;
}

// Load Data of Single
export async function loader({ params }) {
  const user = useUserStore.getState()?.user;
  const serial = user?.user?.tag;
  const stages = await Service.fetchStages();
  const applytypes = await Service.fetchApplytypes();
  const voucher = await Service.fetchVoucher(serial);
  const sorted = await Service.fetchMyShortlist();
  const data = await Service.fetchStepApplicant(serial);
  return { data, stages, applytypes, voucher, sorted };
}

function PgStepConfigure({}: Props) {
  const photoRef: any = useRef(null);
  const { data, stages, applytypes, voucher, sorted }: any = useLoaderData();
  const [file, setFile] = useState(resolveAmsPhotoSrc(data) || null);
  const [form, setForm]: any = useState(data);
  const [show, setShow]: any = useState(data?.submitted ? false : true);

  const photoChange = async (e) => {
    const f = e.target.files[0];
    if (f && f.type.match("image.*")) {
      try {
        const base64: any = await Helper.convertBase64(f);
        setFile(base64);
      } catch (err) {
        console.log(err);
      }
    }
  };
  
  const formChange = async (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const updateForm = () => setShow(true);
  
  return (
    <main className="p-2">
      <div className="p-3 border bg-slate-50/50 rounded-xl space-y-4">
        <section className="px-3 py-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex-1 flex flex-col space-y-4">
            <h1 className="px-3 py-1 rounded-md border md:border-0 text-base md:text-3xl tracking-wide font-semibold text-primary/80">Welcome to the Applicant Portal</h1>
            <div className="px-2 md:px-6 flex flex-col space-y-3 md:space-y-3 text-zinc-500 text-base">
              {/* <span className="text-lg md:tracking-wider">To start your application procedure, you are required to choose admission group and application type for your defined application form..</span> */}
              <h1 className="px-3 md:px-4 py-1 w-fit bg-primary text-white rounded text-lg md:text-2xl font-medium md:tracking-wider">{voucher?.admission?.title}</h1>
              <div className="text-lg md:tracking-wider">Please choose an action from the list of services below.</div>
              <ul className="list-inside list-disc accent-red-700">
                <li>
                  Applications are currently{" "}
                  <b>
                    {voucher?.admission?.applyPause
                      ? "halted temporarily"
                      : moment().isAfter(moment(voucher?.admission?.applyEnd))
                      ? "closed"
                      : "opened and on-going"}
                    .
                  </b>
                </li>
                <li>
                  Please complete your application before midnight of{" "}
                  <b>{moment(voucher?.admission?.applyEnd).format("LL")}.</b>
                </li>
              </ul>
            </div>
          </div>
        </section>
        {(show && moment().isBefore(moment(voucher?.admission?.applyEnd))) && (
          <Form
            method="post"
            onChange={formChange}
            encType="multipart/form-data"
            className="w-full grid grid-cols-1 md:grid-cols-2 gap-y-2 md:gap-y-0 md:gap-x-2"
          >
            {/* Record */}
            <div className="relative p-3 md:py-6 md:px-6 border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
              <PiNumberCircleOneBold className="absolute h-9 w-9 right-2 top-2 text-primary-accent" />
              <h1 className="py-0.5 px-2 md:px-4 w-fit text-xs md:text-base font-semibold rounded-md bg-primary/60 text-white tracking-widest uppercase -skew-x-6">
                APPLICANT PHOTO UPLOAD
              </h1>
              <div className="px-2 space-y-4">
                <div className="w-full flex flex-col space-y-3 items-center justify-center">
                  <div className="p-1 w-fit rounded-lg border-2 border-primary/20 bg-primary/5 relative flex items-center justify-center">
                    <img
                      src={file || None}
                      onClick={() => photoRef.current.click()}
                      className="h-40 w-fit object-cover"
                    />
                    <input
                      type="file"
                      name="photo"
                      ref={photoRef}
                      onChange={photoChange}
                      className="hidden"
                      defaultValue={data?.id}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => photoRef.current.click()}
                    className="py-1 px-4 md:w-96 rounded-md bg-primary-accent/70 text-white font-semibold"
                  >
                    PICK PHOTO{" "}
                  </button>
                </div>
              </div>
            </div>
            <div className="relative p-3 md:py-6 md:pb-10 md:px-6 border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
              <PiNumberCircleTwoBold className="absolute h-9 w-9 right-2 top-2 text-primary-accent" />
              <div className="px-2 space-y-4">
                <label className="flex flex-col space-y-2">
                  <span className="text-sm md:text-lg text-gray-500 font-medium">
                    Admission Group <Asterix />
                  </span>
                  <select
                    arial-label="stageId"
                    name="stageId"
                    defaultValue={data?.stageId}
                    required
                    className="capitalize focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                  >
                    <option>
                      -- Choose --
                    </option>
                    {stages &&
                      stages?.map((row: any) => {
                        //if(row.categoryId != voucher.categoryId ) return
                        if ((row.categoryId == voucher.categoryId && row.sellType == voucher.sellType) || (row.categoryId == "UG" && voucher.sellType == 1) || (row.categoryId == "PG" && voucher.sellType == 2))
                          return (<option key={row.id} value={row.id}>{row.title?.toUpperCase()}</option>);
                      })}
                  </select>
                </label>
                <label className="flex flex-col space-y-2">
                  <span className="text-sm md:text-lg text-gray-500 font-medium">
                    Application Type <Asterix />
                  </span>
                  <select
                    disabled={!form?.stageId}
                    arial-label="applyTypeId"
                    name="applyTypeId"
                    defaultValue={data?.applyTypeId}
                    required
                    className="capitalize focus:ring-0 border focus:border-slate-300  border-slate-200 bg-blue-500/5 text-sm md:text-base text-gray-500 rounded-md"
                  >
                    <option>
                      -- Choose --
                    </option>
                    {applytypes &&
                      applytypes?.map((row: any) => {
                        if (!row.stages.includes(form?.stageId)) return;
                        return (
                          <option key={row.id} value={row.id}>
                            {row.title?.toUpperCase()}
                          </option>
                        );
                      })}
                  </select>
                </label>
              </div>
              <hr className="border-dashed" />
              <div className="">
                <input
                  type="hidden"
                  name="categoryId"
                  value={
                    stages.find((r: any) => r.id == form?.stageId)?.categoryId
                  }
                />
                <button
                  disabled={!file || !form?.stageId || !form?.applyTypeId}
                  className="px-2 py-1 md:py-2 md:px-4 w-full rounded-md disabled:bg-primary/30 bg-primary/70 text-sm md:text-lg text-white font-semibold tracking-wider"
                  type="submit"
                >
                  Goto Application
                </button>
              </div>
            </div>
          </Form>
        )}
        {!show && (
          <>
            <section className="px-6 py-0 w-full flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 bg-white">
              { sorted?.admitted && (
                <div className="w-full flex flex-col md:flex-row">
                    <NavLink
                      to={`https://docs.google.com/forms/d/e/1FAIpQLSeldsF0yCsNfU76FJa6LwERQCISQ3cFBy-wi5g2fpkzscy3LA/viewform?usp=header`}
                      target="_blank"
                      className="my-6 mx-6 px-6 py-3 h-14 flex-1 border rounded bg-slate-100 text-gray-600 font-semibold tracking-widest text-center">
                     Complete Acceptance Form <sup className="text-red-400">***</sup>
                    </NavLink>
                    <NavLink
                      to={`/amsp/dash/letter`}
                      className="my-6 mx-6 px-6 py-3 h-14 flex-1 border rounded bg-slate-100 text-gray-600 font-semibold tracking-widest text-center">
                      Print Admission Letter
                    </NavLink>
                </div>
              )}

              {!sorted?.admitted && (
                <>
                <NavLink
                  to={`/amsp/dash/form`}
                  className={({ isActive }) =>
                    isActive
                      ? "my-6 mx-3 px-6 py-3 flex-1 bg-primary-dark/90 rounded text-white font-medium tracking-widest text-center"
                      : "my-6 mx-6 px-6 py-3 flex-1 border rounded bg-slate-100 text-gray-600 font-semibold tracking-widest text-center"
                  }
                >
                  View Applicant Form
                </NavLink>
                <button
                  disabled={(voucher?.admission?.applyPause || moment().isAfter(moment(voucher?.admission?.applyEnd)))}
                  onClick={updateForm}
                  className="my-6 px-6 py-3 h-12 self-center flex-1 rounded bg-primary/70 hover:bg-primary/60 disabled:bg-primary/40 transition text-white font-semibold tracking-widest text-center"
                >
                  Edit Application Form
                </button>
                </>
              )}
            </section>
            <section>
              <Outlet />
            </section>
          </>
        )}
      </div>
    </main>
  );
}

export default PgStepConfigure;
