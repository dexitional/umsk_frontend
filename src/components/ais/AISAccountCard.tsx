import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { GoPasskeyFill } from "react-icons/go";
import { HiUserAdd } from "react-icons/hi";
import { TbPhotoCancel, TbPhotoEdit } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
// @ts-ignore
import { Link } from "react-router-dom";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";
import { useHasRole } from "../../utils/roles";

type Props = {
  data?: any;
};

function AISAccountCard({ data }: Props) {
  const navigate = useNavigate();
  const fileRef: any = useRef(null);
  const { switchUser, user, message } = useUserStore((state) => state);
  // Non-admin roles are restricted to a subset of account actions: clerk/registry
  // get the "core" identity actions (reset access, change photo, remove photo),
  // finance gets the two finance-adjacent actions (generate index, finance pardon).
  // Everything else here is an administrative action limited to student::admin.
  const canAdminAccount = useHasRole("ais", ["student::admin"]);
  const canCoreAccount = useHasRole("ais", ["student::admin", "student::clerk", "student::registry"]);
  const canFinanceAccount = useHasRole("ais", ["student::admin", "student::finance"]);

  // Tracks which single action (if any) is currently in flight, by key --
  // disables every button on the card while one is running (these all
  // mutate the same student record, so overlapping requests would race),
  // and lets the specific button that was clicked show its own loading
  // label. `null` means idle.
  const [pending, setPending] = useState<string | null>(null);

  // A successful mutation reloads the card's data (matching the rest of
  // this file's convention), but not instantly -- react-hot-toast's toast
  // would otherwise get wiped by the reload before it's readable. Same
  // delay PgAISStudents.tsx's upload flow already uses for the same reason.
  const reloadAfterToast = () => setTimeout(() => navigate(0), 2000);

  const stageAccess = async () => {
    const ok = window.confirm("Setup Student Portal Access ?");
    if (!ok) return;
    setPending("stage");
    try {
      const resp = await Service.stageStudentAccess(data?.id);
      if (resp) reloadAfterToast();
      else setPending(null);
    } catch (error) {
      // Service.stageStudentAccess already shows the toast.
      setPending(null);
    }
  };

  const resetAccess = async () => {
    const ok = window.confirm("Reset Student Portal Password ?");
    if (!ok) return;
    setPending("reset");
    try {
      await Service.resetStudentAccess(data?.id, data?.instituteEmail);
    } catch (error) {
      // Service.resetStudentAccess already shows the toast; this just
      // stops the rejection from going unhandled.
    } finally {
      setPending(null);
    }
  };

  const changePhoto = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("tag", data?.id);
    setPending("photo");
    try {
      const resp = await Service.changePhoto(formData);
      if (resp) reloadAfterToast();
      else setPending(null);
    } catch (error) {
      setPending(null);
    }
  };

  const removePhoto = async () => {
    const ok = window.confirm("Remove Student Photo ?");
    if (!ok) return;
    setPending("removePhoto");
    try {
      const resp = await Service.removePhoto(data?.id);
      if (resp) reloadAfterToast();
      else setPending(null);
    } catch (error) {
      setPending(null);
    }
  };

  const generateIndex = async () => {
    const ok = window.confirm("Generate Index Number ?");
    if (!ok) return;
    setPending("index");
    try {
      const resp = await Service.generateIndex(data?.id);
      if (resp) reloadAfterToast();
      else setPending(null);
    } catch (error) {
      setPending(null);
    }
  };

  const activatePardon = async () => {
    const ok = window.confirm("Allow Financial Pardon ?");
    if (!ok) return;
    setPending("pardon");
    try {
      const resp = await Service.pardonStudent(data?.id);
      if (resp) reloadAfterToast();
      else setPending(null);
    } catch (error) {
      setPending(null);
    }
  };

  const generateEmail = async () => {
    const ok = window.confirm("Generate Student Mail ?");
    if (!ok) return;
    setPending("email");
    try {
      const resp = await Service.generateEmail(data?.id);
      // Service.generateEmail already fires the success toast.
      if (resp) reloadAfterToast();
      else setPending(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Mail already exists !");
      setPending(null);
    }
  };

  const retryGsuiteSync = async () => {
    const ok = window.confirm("Retry Google Workspace Sync ?");
    if (!ok) return;
    setPending("gsuite");
    try {
      const resp = await Service.retryGsuiteSync(data?.id);
      if (resp) reloadAfterToast();
      else setPending(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Google Workspace sync failed. Check the GSuite configuration.");
      setPending(null);
    }
  };

  const progressStudent = async () => {
    const ok = window.confirm("Progress Student for Academic Session ?");
    if (!ok) return;
    setPending("progress");
    try {
      const resp = await Service.progressStudent({ indexno: data?.indexno });
      // Service.progressStudent already shows the toast either way.
      if (resp) reloadAfterToast();
      else setPending(null);
    } catch (error) {
      setPending(null);
    }
  };

  const switchAccount = async (e) => {
    e.preventDefault();
    setPending("switch");
    try {
      await switchUser(data?.id);
      window.location.href = "/";
      //navigate("/")
    } catch (error) {
      // switchUser already shows the toast.
      setPending(null);
    }
  };

  return (
    <div className="w-full rounded flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-6">
      <section className="w-full grid md:grid-cols-3 gap-2 md:gap-4">
        {/* Stage Account */}
        {canAdminAccount ? (
          <button
            onClick={stageAccess}
            disabled={!!pending}
            className="p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-secondary-accent/5 border border-secondary-accent/20 shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <HiUserAdd className="text-secondary-accent h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 border-secondary-accent/20 rounded-full" />
            <span className={`font-semibold text-sm md:text-base text-secondary-accent font-noto ${pending === "stage" ? "animate-pulse" : ""}`}>
              {pending === "stage" ? "Staging..." : "Stage Student Access"}
            </span>
          </button>
        ) : null}
        {/* Reset Account */}
        {canCoreAccount ? (
          <button
            onClick={resetAccess}
            disabled={!!pending}
            className="p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-secondary-accent/5 border border-secondary-accent/20 shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GoPasskeyFill className="text-secondary-accent h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 border-secondary-accent/20 rounded-full" />
            <span className={`font-semibold text-sm md:text-base text-secondary-accent font-noto ${pending === "reset" ? "animate-pulse" : ""}`}>
              {pending === "reset" ? "Resetting..." : "Reset Student Access"}
            </span>
          </button>
        ) : null}
        {/* Index Number */}
        {canFinanceAccount ? (
          <button
            onClick={!data?.indexno ? generateIndex : undefined}
            disabled={!!pending || !!data?.indexno}
            className={`p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 ${
              data?.indexno
                ? "bg-primary/5 border-primary/20 cursor-not-allowed"
                : "bg-secondary-accent/5 border-secondary-accent/20"
            } border shadow disabled:opacity-50`}
          >
            <GoPasskeyFill
              className={`${
                data?.indexno
                  ? "text-primary/60 border-primary/20"
                  : "text-secondary-accent border-secondary-accent/20"
              } h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 rounded-full`}
            />
            <span
              className={`font-semibold text-sm md:text-base ${
                data?.indexno ? "text-primary/50" : "text-secondary-accent"
              } font-noto ${pending === "index" ? "animate-pulse" : ""}`}
            >
              {pending === "index" ? "Generating..." : data?.indexno ? "Index Number Activated" : "Generate Index Number"}
            </span>
          </button>
        ) : null}

        {/* Change Photo */}
        {canCoreAccount ? (
          <form action="post" encType="multipart/form-data" className="w-full">
            <button
              type="button"
              onClick={() => fileRef.current.click()}
              disabled={!!pending}
              className="w-full p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-secondary-accent/5 border border-secondary-accent/20 shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <TbPhotoEdit className="text-secondary-accent h-8 w-8 md:h-10 md:w-10 p-1 md:p-1 bg-white border-2 md:border-4 border-secondary-accent/20 rounded-full" />
              <span className={`font-semibold text-sm md:text-base text-secondary-accent font-noto ${pending === "photo" ? "animate-pulse" : ""}`}>
                {pending === "photo" ? "Uploading..." : "Change Student Photo"}
              </span>
            </button>
            <input
              type="file"
              ref={fileRef}
              name="photo"
              onChange={changePhoto}
              className="hidden"
            />
          </form>
        ) : null}
        {/* Remove Photo */}
        {canCoreAccount ? (
          <button
            onClick={removePhoto}
            disabled={!!pending}
            className="p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-secondary-accent/5 border border-secondary-accent/20 shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TbPhotoCancel className="text-secondary-accent h-8 w-8 md:h-10 md:w-10 p-1 md:p-1 bg-white border-2 md:border-4 border-secondary-accent/20 rounded-full" />
            <span className={`font-semibold text-sm md:text-base text-secondary-accent font-noto ${pending === "removePhoto" ? "animate-pulse" : ""}`}>
              {pending === "removePhoto" ? "Removing..." : "Remove Student Photo"}
            </span>
          </button>
        ) : null}
        {/* Reset Account */}
        {/* <button onClick={generateCard} className="p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-secondary-accent/5 border border-secondary-accent/20 shadow">
            <FaRegIdCard className="text-secondary-accent h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 border-secondary-accent/20 rounded-full" />
            <span className="font-semibold text-sm md:text-base text-secondary-accent font-noto">Generate ID Card</span>
          </button> */}
        {/* Pardon Registration */}
        {canFinanceAccount ? (
          <button
            onClick={!data?.flagPardon ? activatePardon : undefined}
            disabled={!!pending || !!data?.flagPardon}
            className={`p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 ${
              data?.flagPardon
                ? "bg-primary/5 border-primary/20 cursor-not-allowed"
                : "bg-secondary-accent/5 border-secondary-accent/20"
            } border shadow disabled:opacity-50`}
          >
            <FaMoneyCheckDollar
              className={`${
                data?.flagPardon
                  ? "text-primary/60 border-primary/20"
                  : "text-secondary-accent border-secondary-accent/20"
              } h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 rounded-full`}
            />
            <span
              className={`font-semibold text-sm md:text-base ${
                data?.flagPardon ? "text-primary/50" : "text-secondary-accent"
              } font-noto ${pending === "pardon" ? "animate-pulse" : ""}`}
            >
              {pending === "pardon" ? "Activating..." : data?.flagPardon ? "Pardon Activated" : "Finance Pardon"}
            </span>
          </button>
        ) : null}

        {/* Switch Account */}
        {canAdminAccount ? (
          <button
            onClick={switchAccount}
            disabled={!!pending}
            className="p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-secondary-accent/5 border border-secondary-accent/20 shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GoPasskeyFill className="text-secondary-accent h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 border-secondary-accent/20 rounded-full" />
            <span className={`font-semibold text-sm md:text-base text-secondary-accent font-noto ${pending === "switch" ? "animate-pulse" : ""}`}>
              {pending === "switch" ? "Switching..." : "Switch User Access"}
            </span>
          </button>
        ) : null}

        {/* Generate Institutional Email  */}
        {canAdminAccount ? (
          <button
            onClick={generateEmail}
            disabled={!!pending}
            className="p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-secondary-accent/5 border border-secondary-accent/20 shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GoPasskeyFill className="text-secondary-accent h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 border-secondary-accent/20 rounded-full" />
            <span className={`font-semibold text-sm md:text-base text-secondary-accent font-noto ${pending === "email" ? "animate-pulse" : ""}`}>
              {pending === "email" ? "Generating Email..." : "Generate Student Email"}
            </span>
          </button>
        ) : null}
        {/* Google Workspace Sync -- only relevant once an institutional
            email exists; active (retry) when not yet synced, disabled-style
            confirmation once it is. */}
        {canAdminAccount && data?.instituteEmail ? (
          <button
            onClick={!data?.gsuiteSynced ? retryGsuiteSync : undefined}
            disabled={!!pending || !!data?.gsuiteSynced}
            className={`p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 ${
              data?.gsuiteSynced
                ? "bg-primary/5 border-primary/20 cursor-not-allowed"
                : "bg-secondary-accent/5 border-secondary-accent/20"
            } border shadow disabled:opacity-50`}
          >
            <GoPasskeyFill
              className={`${
                data?.gsuiteSynced
                  ? "text-primary/60 border-primary/20"
                  : "text-secondary-accent border-secondary-accent/20"
              } h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 rounded-full`}
            />
            <span
              className={`font-semibold text-sm md:text-base ${
                data?.gsuiteSynced ? "text-primary/50" : "text-secondary-accent"
              } font-noto ${pending === "gsuite" ? "animate-pulse" : ""}`}
            >
              {pending === "gsuite" ? "Syncing..." : data?.gsuiteSynced ? "Google Account Synced" : "Retry Google Sync"}
            </span>
          </button>
        ) : null}
        {/* Generate Transcript  */}
        {canAdminAccount ? (
          <Link
            to={`/print/transwift/${encodeURIComponent(data?.id)}/statement`}
            className="p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-secondary-accent/5 border border-secondary-accent/20 shadow"
          >
            <GoPasskeyFill className="text-secondary-accent h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 border-secondary-accent/20 rounded-full" />
            <span className="font-semibold text-sm md:text-base text-secondary-accent font-noto">
              Academic Statement
            </span>
          </Link>
        ) : null}
        {/* Progress Student  */}
        {canAdminAccount ? (
          <button
            onClick={progressStudent}
            disabled={!!pending}
            className="p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-secondary-accent/5 border border-secondary-accent/20 shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GoPasskeyFill className="text-secondary-accent h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 border-secondary-accent/20 rounded-full" />
            <span className={`font-semibold text-sm md:text-base text-secondary-accent font-noto ${pending === "progress" ? "animate-pulse" : ""}`}>
              {pending === "progress" ? "Progressing..." : "Progress Student"}
            </span>
          </button>
        ) : null}
      </section>
    </div>
  );
}

export default AISAccountCard;
