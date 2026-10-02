import React, { useState } from "react";
import { Form, redirect, useNavigate } from "react-router-dom";
// import Service from '../../utils/authService'
import toast from "react-hot-toast";
import { HiCheck, HiOutlineEye, HiOutlineEyeSlash, HiOutlineKey, HiOutlineShieldCheck } from "react-icons/hi2";
import AISPPageHeader from "../../components/aisp/AISPPageHeader";
import { AISPCrest } from "../../components/aisp/AISPPhotoBlend";
import { useUserStore } from "../../utils/authService";

type Props = {};

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

// Same rules as passwordPolicyIssue, as a live checklist under the field.
const PASSWORD_RULES = [
  { label: `${PASSWORD_MIN_LENGTH}+ characters`, test: (p: string) => p.length >= PASSWORD_MIN_LENGTH },
  { label: "Lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Number", test: (p: string) => /[0-9]/.test(p) },
];

function PasswordInput({ name, value, onChange }: { name: string; value?: string; onChange?: (v: string) => void }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        arial-label={name}
        type={visible ? "text" : "password"}
        name={name}
        {...(onChange ? { value, onChange: (e: any) => onChange(e.target.value) } : {})}
        required
        className="aisp-input pr-12"
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-0 w-12 flex items-center justify-center text-slate-400 hover:text-slate-600"
      >
        {visible ? <HiOutlineEyeSlash className="h-5 w-5" /> : <HiOutlineEye className="h-5 w-5" />}
      </button>
    </div>
  );
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

  const passed = PASSWORD_RULES.filter((r) => r.test(newpassword)).length;
  const strength = ["bg-slate-200", "bg-rose-500", "bg-amber-500", "bg-sky-500", "bg-emerald-500"][passed];

  return (
    <div className="space-y-6 md:space-y-8">
      <AISPPageHeader photo="gate"
        eyebrow="Account"
        title="Change Password"
        subtitle="Choose a strong password you don't use anywhere else."
        Icon={HiOutlineKey}
      />

      <div className="grid lg:grid-cols-5 gap-6 items-start">
        <Form method="post" className="lg:col-span-3">
          <div className="aisp-rise aisp-card p-6 md:p-8 space-y-5">
            <label className="flex flex-col gap-2">
              <span className="aisp-label">Current Password</span>
              <PasswordInput name="oldpassword" />
            </label>
            <label className="flex flex-col gap-2">
              <span className="aisp-label">New Password</span>
              <PasswordInput name="newpassword" value={newpassword} onChange={setNewpassword} />
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {PASSWORD_RULES.map((_, i) => (
                  <span key={i} className={`h-1.5 rounded-full transition-colors ${i < passed ? strength : "bg-slate-200"}`} />
                ))}
              </div>
              <span className={`text-xs ${newpassword.length > 0 && policyIssue ? "text-rose-600" : "text-slate-400"}`}>
                {newpassword.length > 0 && policyIssue
                  ? policyIssue
                  : `At least ${PASSWORD_MIN_LENGTH} characters, with an uppercase letter, a lowercase letter, and a number.`}
              </span>
            </label>
            <label className="flex flex-col gap-2">
              <span className="aisp-label">Confirm New Password</span>
              <PasswordInput name="rnewpassword" value={rnewpassword} onChange={setRnewpassword} />
              {mismatch ? <span className="text-xs text-rose-600">Passwords do not match.</span> : null}
            </label>

            <div className="flex items-center gap-3 pt-2">
              <input type="hidden" name="tag" defaultValue={user?.user?.tag} />
              <button disabled={!canSubmit} className="aisp-btn-primary flex-1" type="submit">
                Update Password
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
        </Form>

        <aside className="aisp-rise lg:col-span-2 relative overflow-hidden rounded-3xl p-6 text-white bg-gradient-to-br from-secondary via-primary to-sky-700 shadow-xl shadow-primary/20" style={{ animationDelay: "80ms" }}>
          <div className="pointer-events-none absolute inset-0 aisp-grid opacity-70" />
          <div className="pointer-events-none absolute -bottom-16 -right-10 h-48 w-48 rounded-full bg-sky-400/30 blur-3xl" />
          <AISPCrest className="-right-8 -bottom-8 h-48 opacity-[0.14] mix-blend-luminosity rotate-[-8deg]" />
          <div className="relative space-y-5">
            <div className="h-12 w-12 rounded-2xl bg-white/[0.15] ring-1 ring-inset ring-white/25 flex items-center justify-center">
              <HiOutlineShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold">Password requirements</h2>
              <p className="text-xs text-sky-100/75 mt-1">Your new password must include:</p>
            </div>
            <ul className="space-y-2.5">
              {PASSWORD_RULES.map((rule) => {
                const ok = rule.test(newpassword);
                return (
                  <li key={rule.label} className="flex items-center gap-3 text-sm">
                    <span className={`h-6 w-6 rounded-full flex items-center justify-center transition-colors ${ok ? "bg-emerald-400 text-emerald-950" : "bg-white/10 text-white/40 ring-1 ring-inset ring-white/20"}`}>
                      <HiCheck className="h-3.5 w-3.5" />
                    </span>
                    <span className={ok ? "text-white font-semibold" : "text-white/70"}>{rule.label}</span>
                  </li>
                );
              })}
            </ul>
            <p className="text-xs text-sky-100/70">You'll be signed out after changing your password.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default PgAISPPasswordForm;
