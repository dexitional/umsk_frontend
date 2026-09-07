import React, { useRef } from "react";
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

  const stageAccess = async () => {
    const ok = window.confirm("Setup Student Portal Access ?");
    if (ok) {
      await Service.stageStudentAccess(data?.id);
    }
  };

  const resetAccess = async () => {
    const ok = window.confirm("Reset Student Portal Password ?");
    if (ok) {
      await Service.resetStudentAccess(data?.id, data?.instituteEmail);
    }
  };

  const changePhoto = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("tag", data?.id);
    const resp = await Service.changePhoto(formData);
    if (resp) navigate(0);
  };

  const removePhoto = async () => {
    const ok = window.confirm("Remove Student Photo ?");
    if (ok) {
      const resp = await Service.removePhoto(data?.id);
      if (resp) navigate(0);
    }
  };

  const generateIndex = async () => {
    const ok = window.confirm("Generate Index Number ?");
    if (ok) {
      const resp = await Service.generateIndex(data?.id);
      if (resp) navigate(0);
    }
  };

  const activatePardon = async () => {
    const ok = window.confirm("Allow Financial Pardon ?");
    if (ok) {
      const resp = await Service.updateStudent(data?.id, { flagPardon: true });
      if (resp) navigate(0);
    }
  };

  const generateEmail = async () => {
    const ok = window.confirm("Generate Student Mail ?");
    if (ok) {
      try {
        const resp = await Service.generateEmail(data?.id);
        if (resp) navigate(0);
      } catch (error) {
        toast.error("Mail already exists !");
      }
    }
  };

  const progressStudent = async () => {
    const ok = window.confirm("Progress Student for Academic Session ?");
    if (ok) {
      try {
        const resp = await Service.progressStudent({ indexno: data?.indexno });
        if (resp) navigate(0);
      } catch (error) {
        toast.error("Student already progressed !");
      }
    }
  };

  const switchAccount = async (e) => {
    try {
      e.preventDefault();
      await switchUser(data?.id);
      window.location.href = "/";
      //navigate("/")
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full rounded flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-6">
      <section className="w-full grid md:grid-cols-3 gap-2 md:gap-4">
        {/* Stage Account */}
        {canAdminAccount ? (
          <button
            onClick={stageAccess}
            className="p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-primary-accent/5 border border-primary-accent/20 shadow"
          >
            <HiUserAdd className="text-primary-accent/60 h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 border-primary-accent/20 rounded-full" />
            <span className="font-semibold text-sm md:text-base text-primary-accent/70 font-noto">
              Stage Student Access
            </span>
          </button>
        ) : null}
        {/* Reset Account */}
        {canCoreAccount ? (
          <button
            onClick={resetAccess}
            className="p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-primary-accent/5 border border-primary-accent/20 shadow"
          >
            <GoPasskeyFill className="text-primary-accent/60 h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 border-primary-accent/20 rounded-full" />
            <span className="font-semibold text-sm md:text-base text-primary-accent/70 font-noto">
              Reset Student Access
            </span>
          </button>
        ) : null}
        {/* Index Number */}
        {canFinanceAccount ? (
          <button
            onClick={!data?.indexno ? generateIndex : undefined}
            className={`p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 ${
              data?.indexno
                ? "bg-primary/5 border-primary/20 cursor-not-allowed"
                : "bg-primary-accent/5 border-primary-accent/20"
            } border shadow`}
          >
            <GoPasskeyFill
              className={`${
                data?.indexno
                  ? "text-primary/60 border-primary/20"
                  : "text-primary-accent/60 border-primary-accent/20"
              } h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 rounded-full`}
            />
            <span
              className={`font-semibold text-sm md:text-base ${
                data?.indexno ? "text-primary/50" : "text-primary-accent/70"
              } font-noto`}
            >
              {data?.indexno ? "Index Number Activated" : "Generate Index Number"}
            </span>
          </button>
        ) : null}

        {/* Change Photo */}
        {canCoreAccount ? (
          <form action="post" encType="multipart/form-data" className="w-full">
            <button
              type="button"
              onClick={() => fileRef.current.click()}
              className="w-full p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-primary-accent/5 border border-primary-accent/20 shadow"
            >
              <TbPhotoEdit className="text-primary-accent/60 h-8 w-8 md:h-10 md:w-10 p-1 md:p-1 bg-white border-2 md:border-4 border-primary-accent/20 rounded-full" />
              <span className="font-semibold text-sm md:text-base text-primary-accent/70 font-noto">
                Change Student Photo
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
            className="p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-primary-accent/5 border border-primary-accent/20 shadow"
          >
            <TbPhotoCancel className="text-primary-accent/60 h-8 w-8 md:h-10 md:w-10 p-1 md:p-1 bg-white border-2 md:border-4 border-primary-accent/20 rounded-full" />
            <span className="font-semibold text-sm md:text-base text-primary-accent/70 font-noto">
              Remove Student Photo
            </span>
          </button>
        ) : null}
        {/* Reset Account */}
        {/* <button onClick={generateCard} className="p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-primary-accent/5 border border-primary-accent/20 shadow">
            <FaRegIdCard className="text-primary-accent/60 h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 border-primary-accent/20 rounded-full" />
            <span className="font-semibold text-sm md:text-base text-primary-accent/70 font-noto">Generate ID Card</span>
          </button> */}
        {/* Pardon Registration */}
        {canFinanceAccount ? (
          <button
            onClick={!data?.flagPardon ? activatePardon : undefined}
            className={`p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 ${
              data?.flagPardon
                ? "bg-primary/5 border-primary/20 cursor-not-allowed"
                : "bg-primary-accent/5 border-primary-accent/20"
            } border shadow`}
          >
            <FaMoneyCheckDollar
              className={`${
                data?.flagPardon
                  ? "text-primary/60 border-primary/20"
                  : "text-primary-accent/60 border-primary-accent/20"
              } h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 rounded-full`}
            />
            <span
              className={`font-semibold text-sm md:text-base ${
                data?.flagPardon ? "text-primary/50" : "text-primary-accent/70"
              } font-noto`}
            >
              {data?.flagPardon ? "Pardon Activated" : "Finance Pardon"}
            </span>
          </button>
        ) : null}

        {/* Switch Account */}
        {canAdminAccount ? (
          <button
            onClick={switchAccount}
            className="p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-primary-accent/5 border border-primary-accent/20 shadow"
          >
            <GoPasskeyFill className="text-primary-accent/60 h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 border-primary-accent/20 rounded-full" />
            <span className="font-semibold text-sm md:text-base text-primary-accent/70 font-noto">
              Switch User Access
            </span>
          </button>
        ) : null}

        {/* Generate Institutional Email  */}
        {canAdminAccount ? (
          <button
            onClick={generateEmail}
            className="p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-primary-accent/5 border border-primary-accent/20 shadow"
          >
            <GoPasskeyFill className="text-primary-accent/60 h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 border-primary-accent/20 rounded-full" />
            <span className="font-semibold text-sm md:text-base text-primary-accent/70 font-noto">
              Generate Student Email
            </span>
          </button>
        ) : null}
        {/* Generate Transcript  */}
        {canAdminAccount ? (
          <Link
            to={`/print/transwift/${encodeURIComponent(data?.id)}/statement`}
            className="p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-primary-accent/5 border border-primary-accent/20 shadow"
          >
            <GoPasskeyFill className="text-primary-accent/60 h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 border-primary-accent/20 rounded-full" />
            <span className="font-semibold text-sm md:text-base text-primary-accent/70 font-noto">
              Academic Statement
            </span>
          </Link>
        ) : null}
        {/* Progress Student  */}
        {canAdminAccount ? (
          <button
            onClick={progressStudent}
            className="p-1.5 md:py-1 md:px-1 rounded-full flex items-center space-x-4 bg-primary-accent/5 border border-primary-accent/20 shadow"
          >
            <GoPasskeyFill className="text-primary-accent/60 h-8 w-8 md:h-10 md:w-10 p-1 md:p-1.5 bg-white border-2 md:border-4 border-primary-accent/20 rounded-full" />
            <span className="font-semibold text-sm md:text-base text-primary-accent/70 font-noto">
              Progress Student
            </span>
          </button>
        ) : null}
      </section>
    </div>
  );
}

export default AISAccountCard;
