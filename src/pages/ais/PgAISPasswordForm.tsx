import React, { useState } from "react";
import { Form, redirect, useNavigate } from "react-router-dom";
import SubPageTitle from "../../components/aisp/SubPageTitle";
// import Service from '../../utils/authService'
import toast from "react-hot-toast";
import { useUserStore } from "../../utils/authService";

type Props = {};

// Mirrors the backend's isStrongPassword (backend/util/password.ts) rule
// order and wording exactly, so a staff member never sees a different
// reason here than they would from the server on submit -- min length,
// then lowercase, then uppercase, then digit, first failure wins.
const PASSWORD_MIN_LENGTH = 8;
function passwordPolicyIssue(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) return `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`;
  if (!/[a-z]/.test(password)) return "Password must include a lowercase letter.";
  if (!/[A-Z]/.test(password)) return "Password must include an uppercase letter.";
  if (!/[0-9]/.test(password)) return "Password must include a number.";
  return null;
}

// Save Form
export async function action({ request, params }) {
  const formData = await request.formData();
  let data = Object.fromEntries(formData);

  if (data.newpassword != data.rnewpassword) {
    toast.error("Password mismatch !");
    return false;
  }
  const policyIssue = passwordPolicyIssue(String(data.newpassword || ""));
  if (policyIssue) {
    toast.error(policyIssue);
    return false;
  }
  const changePassword = useUserStore.getState().changePassword;
  await changePassword(data?.tag, data?.oldpassword, data?.newpassword);
  return redirect(`/ais/dash`);
}

function PgAISPasswordForm({}: Props) {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  // const lasRole = user?.roles?.find(r => r?.app_tag?.toLowerCase() == 'las')

  const [newpassword, setNewpassword] = useState("");
  const [rnewpassword, setRnewpassword] = useState("");

  const policyIssue = passwordPolicyIssue(newpassword);
  const mismatch = rnewpassword.length > 0 && newpassword !== rnewpassword;
  const canSubmit = newpassword.length > 0 && rnewpassword.length > 0 && !policyIssue && !mismatch;

  return (
    <main className="p-2 md:pl-10 md:p-6 space-y-4 md:space-y-10">
      <SubPageTitle title={`Password Change`} page="USER ACCOUNT" />
      <div className="p-2 md:p-6 border bg-slate-50/50 rounded-xl space-y-6">
        <section className="flex md:space-x-6">
          <div className="flex-1 flex flex-col space-y-1 md:space-y-3">
            <h1 className="text-lg md:text-2xl tracking-wide font-semibold text-primary/70">
              Staff Password Change
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
                  <span>Enter old Password</span>
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
                  <span>Enter new Password</span>
                </div>
                <input
                  arial-label="newpassword"
                  type="password"
                  name="newpassword"
                  value={newpassword}
                  onChange={(e) => setNewpassword(e.target.value)}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-primary/5 text-sm md:text-base disabled:text-gray-400 text-gray-500 rounded-md"
                />
                <span className={`text-xs ${newpassword.length > 0 && policyIssue ? "text-red-500" : "text-slate-400"}`}>
                  {newpassword.length > 0 && policyIssue
                    ? policyIssue
                    : `At least ${PASSWORD_MIN_LENGTH} characters, with an uppercase letter, a lowercase letter, and a number.`}
                </span>
              </label>
              <label className="flex flex-col space-y-2">
                <div className="text-sm md:text-base text-gray-500 font-medium flex items-center justify-between">
                  <span>Re-peat new Password</span>
                </div>
                <input
                  arial-label="rnewpassword"
                  type="password"
                  name="rnewpassword"
                  value={rnewpassword}
                  onChange={(e) => setRnewpassword(e.target.value)}
                  required
                  className="focus:ring-0 border focus:border-slate-300  border-slate-200 bg-primary/5 text-sm md:text-base disabled:text-gray-400 text-gray-500 rounded-md"
                />
                {mismatch ? <span className="text-xs text-red-500">Passwords do not match.</span> : null}
              </label>

              <div className="flex items-center justify-between space-x-2">
                <input
                  type="hidden"
                  name="tag"
                  defaultValue={user?.user?.tag}
                />
                <button
                  disabled={!canSubmit}
                  className="py-1 px-4 w-4/5 rounded-md bg-primary/70 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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

export default PgAISPasswordForm;
