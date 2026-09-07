import React from "react";
import { Form, redirect, useNavigate } from "react-router-dom";
import SubPageTitle from "../../components/aisp/SubPageTitle";
// import Service from '../../utils/authService'
import toast from "react-hot-toast";
import { useUserStore } from "../../utils/authService";

type Props = {};

// Save Form
export async function action({ request, params }) {
  const formData = await request.formData();
  let data = Object.fromEntries(formData);

  if (data.newpassword != data.rnewpassword) {
    toast.error("Password mismatch !");
    return false;
  }
  const changePassword = useUserStore.getState().changePassword;
  await changePassword(data.tag, data.oldpassword, data.newpassword);
  return redirect(`/aisp/profile`);
}

function PgAISPPasswordForm({}: Props) {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  // const lasRole = user?.roles?.find(r => r?.app_tag?.toLowerCase() == 'las')

  return (
    <main className="p-2 md:pl-10 md:p-6 space-y-4 md:space-y-10">
      <SubPageTitle title={`Password Change`} page="NSS USER ACCOUNT" />
      <div className="p-2 md:p-6 border bg-slate-50/50 rounded-xl space-y-6">
        <section className="flex md:space-x-6">
          <div className="flex-1 flex flex-col space-y-1 md:space-y-3">
            <h1 className="text-lg md:text-2xl tracking-wide font-semibold text-primary/70">
              Change of Password
            </h1>
            <div className="flex items-center space-x-2 text-zinc-400 text-base">
              <span className="text-xs md:tracking-wider">
                Please provide neccessary information
              </span>
            </div>
          </div>
        </section>

        <Form method="post" className="">
          {/* Record */}
          <div className="p-3 md:py-6 md:pb-10 md:px-6 border rounded-lg md:rounded-xl bg-white space-y-3 md:space-y-6">
            <div className="md:p-6 space-y-4">
              <label className="flex flex-col space-y-2">
                <div className="text-sm md:text-base text-gray-500 font-medium flex items-center justify-between">
                  <span>Enter Old Password</span>
                </div>
                <input
                  arial-label="oldpassword"
                  type="password"
                  name="oldpassword"
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-primary/5 text-sm md:text-base disabled:text-gray-400 text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <div className="text-sm md:text-base text-gray-500 font-medium flex items-center justify-between">
                  <span>Enter New Password</span>
                </div>
                <input
                  arial-label="newpassword"
                  type="password"
                  name="newpassword"
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-primary/5 text-sm md:text-base disabled:text-gray-400 text-gray-500 rounded-md"
                />
              </label>
              <label className="flex flex-col space-y-2">
                <div className="text-sm md:text-base text-gray-500 font-medium flex items-center justify-between">
                  <span>Re-peat New Password</span>
                </div>
                <input
                  arial-label="rnewpassword"
                  type="password"
                  name="rnewpassword"
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-primary/5 text-sm md:text-base disabled:text-gray-400 text-gray-500 rounded-md"
                />
              </label>

              <div className="flex items-center justify-between space-x-2">
                <input
                  type="hidden"
                  name="tag"
                  defaultValue={user?.user?.tag}
                />
                <button
                  className="py-1 px-4 w-4/5 rounded-md bg-primary/70 text-white font-semibold"
                  type="submit"
                >
                  Change
                </button>
                <button
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

export default PgAISPPasswordForm;
