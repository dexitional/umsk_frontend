import React, { useState } from "react";
import { Form, redirect, useNavigate } from "react-router-dom";
// import Service from '../../utils/authService'
import toast from "react-hot-toast";
import { useUserStore } from "../../utils/authService";

type Props = {};

const inputClass =
  "w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-secondary-accent/20 focus:border-secondary-accent/40 transition-colors";
const labelClass = "text-xs font-semibold text-slate-500 uppercase tracking-wider";

// Mirrors the backend's isStrongPassword (backend/util/password.ts) rule
// order and wording exactly, so a student never sees a different reason
// here than they would from the server on submit -- min length, then
// lowercase, then uppercase, then digit, first failure wins.
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
  return redirect(`/aisp/profile`);
}

function PgAISPPasswordForm({}: Props) {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  const [newpassword, setNewpassword] = useState("");
  const [rnewpassword, setRnewpassword] = useState("");

  const policyIssue = passwordPolicyIssue(newpassword);
  const mismatch = rnewpassword.length > 0 && newpassword !== rnewpassword;
  const canSubmit = newpassword.length > 0 && rnewpassword.length > 0 && !policyIssue && !mismatch;

  return (
    <div className="p-4 md:p-0 space-y-6 md:space-y-8">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-primary">
          Change Password
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Please provide necessary information
        </p>
      </div>

      <Form method="post">
        <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4 max-w-lg">
          <label className="flex flex-col space-y-1.5">
            <span className={labelClass}>Enter Old Password</span>
            <input
              arial-label="oldpassword"
              type="password"
              name="oldpassword"
              required
              className={inputClass}
            />
          </label>
          <label className="flex flex-col space-y-1.5">
            <span className={labelClass}>Enter New Password</span>
            <input
              arial-label="newpassword"
              type="password"
              name="newpassword"
              value={newpassword}
              onChange={(e) => setNewpassword(e.target.value)}
              required
              className={inputClass}
            />
            <span className={`text-xs ${newpassword.length > 0 && policyIssue ? "text-red-500" : "text-slate-400"}`}>
              {newpassword.length > 0 && policyIssue
                ? policyIssue
                : `At least ${PASSWORD_MIN_LENGTH} characters, with an uppercase letter, a lowercase letter, and a number.`}
            </span>
          </label>
          <label className="flex flex-col space-y-1.5">
            <span className={labelClass}>Repeat New Password</span>
            <input
              arial-label="rnewpassword"
              type="password"
              name="rnewpassword"
              value={rnewpassword}
              onChange={(e) => setRnewpassword(e.target.value)}
              required
              className={inputClass}
            />
            {mismatch ? <span className="text-xs text-red-500">Passwords do not match.</span> : null}
          </label>

          <div className="flex items-center gap-3 pt-2">
            <input type="hidden" name="tag" defaultValue={user?.user?.tag} />
            <button
              disabled={!canSubmit}
              className="flex-1 py-2.5 px-4 rounded-lg bg-secondary-accent text-white font-semibold text-sm hover:bg-secondary-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-secondary-accent"
              type="submit"
            >
              Change
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
      </Form>
    </div>
  );
}

export default PgAISPPasswordForm;
