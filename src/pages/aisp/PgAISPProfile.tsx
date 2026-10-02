import moment from "moment";
import React from "react";
import {
  HiCheckBadge,
  HiOutlineAcademicCap,
  HiOutlineBookOpen,
  HiOutlineBuildingLibrary,
  HiOutlineCake,
  HiOutlineCalendarDays,
  HiOutlineEnvelope,
  HiOutlineFlag,
  HiOutlineGlobeAlt,
  HiOutlineHashtag,
  HiOutlineHeart,
  HiOutlineHome,
  HiOutlineHomeModern,
  HiOutlineIdentification,
  HiOutlineMapPin,
  HiOutlinePencilSquare,
  HiOutlinePhone,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineUser,
  HiOutlineUserGroup,
  HiOutlineUsers,
  HiOutlineAtSymbol,
  HiOutlineStar,
  HiOutlineMap,
} from "react-icons/hi2";
import { Link, useLoaderData } from "react-router-dom";
import AISPInfoTile from "../../components/aisp/AISPInfoTile";
import AISPPanel from "../../components/aisp/AISPPanel";
import { AISPCrest, AISPPhotoBlend } from "../../components/aisp/AISPPhotoBlend";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";
const { REACT_APP_API_URL } = import.meta.env;

type Props = {};

// Load Data of Single
export async function loader({ params }) {
  const user = useUserStore.getState().user;
  const data = await Service.fetchStudent(user?.user?.tag);
  return { data, user };
}

function PgAISPProfile({}: Props) {
  const { data, user }: any = useLoaderData();
  const fullName = `${data?.fname ?? ""} ${data?.mname ? data?.mname + " " : ""}${data?.lname ?? ""}`.trim();
  const year = Math.ceil(data?.semesterNum / 2);
  const yearLabel = year ? `Year ${year}` : "Completed";
  const formatDate = (d: any) => (d ? moment(d).format("MMMM DD, YYYY") : null);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Cover + identity */}
      <section className="aisp-rise aisp-card overflow-hidden">
        <div className="relative h-36 md:h-44 bg-gradient-to-br from-secondary via-primary to-sky-600 overflow-hidden">
          <AISPPhotoBlend photo="gate" fade="none" className="opacity-50 object-[center_60%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 to-transparent" />
          <AISPCrest className="right-6 top-1/2 -translate-y-1/2 h-28 md:h-32 opacity-[0.2] mix-blend-luminosity" />
          <div className="absolute inset-0 aisp-grid" />
          <div className="absolute -top-20 right-10 h-64 w-64 rounded-full bg-sky-300/30 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-indigo-400/30 blur-3xl" />
        </div>
        <div className="px-5 md:px-8 pb-6 md:pb-8">
          <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
            <div className="relative -mt-14 md:-mt-16 h-28 w-28 md:h-36 md:w-36 shrink-0 rounded-[1.75rem] p-1.5 bg-white shadow-xl shadow-slate-900/10">
              <img
                src={`${REACT_APP_API_URL}/auth/photos/?tag=${user?.user?.tag}`}
                alt=""
                className="h-full w-full rounded-[1.35rem] object-cover object-top bg-slate-100"
              />
            </div>
            <div className="flex-1 min-w-0 space-y-2 md:pt-5">
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 capitalize">
                  {fullName.toLowerCase()}
                </h1>
                <HiCheckBadge className="h-6 w-6 text-sky-500 shrink-0" />
              </div>
              <p className="text-sm text-slate-500 capitalize">
                {data?.program?.longName?.toLowerCase() || "Programme not set"}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-100 text-xs font-semibold">
                  <HiOutlineIdentification className="h-3.5 w-3.5" /> {data?.id}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-100 text-xs font-semibold">
                  <HiOutlineHashtag className="h-3.5 w-3.5" /> {data?.indexno || "Index not set"}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100 text-xs font-semibold">
                  <HiOutlineAcademicCap className="h-3.5 w-3.5" /> {yearLabel}
                </span>
              </div>
            </div>
            <Link
              to={`/aisp/profile/${encodeURIComponent(user?.user?.tag)}/edit`}
              className="aisp-btn-primary w-full md:w-auto md:mt-5"
            >
              <HiOutlinePencilSquare className="h-4 w-4" />
              Edit Profile
            </Link>
          </div>
        </div>
      </section>

      <div className="grid xl:grid-cols-2 gap-6 md:gap-8 items-start">
        <AISPPanel title="Personal Information" subtitle="Your bio and contact details" Icon={HiOutlineUser}>
          <div className="grid sm:grid-cols-2 gap-3">
            <AISPInfoTile label="Full Name" value={fullName} Icon={HiOutlineUser} className="sm:col-span-2" />
            <AISPInfoTile label="Gender" value={data?.gender == "M" ? "Male" : "Female"} Icon={HiOutlineUsers} />
            <AISPInfoTile label="Date of Birth" value={formatDate(data?.dob)} Icon={HiOutlineCake} />
            <AISPInfoTile label="Phone Number" value={data?.phone} Icon={HiOutlinePhone} />
            <AISPInfoTile label="Hometown" value={data?.hometown} Icon={HiOutlineHome} />
            <AISPInfoTile label="Email Address" value={data?.email?.toLowerCase()} Icon={HiOutlineEnvelope} className="sm:col-span-2" />
            <AISPInfoTile label="Residential Address" value={data?.address} Icon={HiOutlineMapPin} className="sm:col-span-2" />
            <AISPInfoTile label="Region" value={data?.region?.title} Icon={HiOutlineMap} />
            <AISPInfoTile label="Country" value={data?.country?.longName} Icon={HiOutlineGlobeAlt} />
            <AISPInfoTile label="Religion" value={data?.religion?.title} Icon={HiOutlineStar} />
            <AISPInfoTile label="Disability" value={data?.disability?.title || "None"} Icon={HiOutlineHeart} />
            <AISPInfoTile label="Ghana Card Number" value={data?.ghcardNo} Icon={HiOutlineIdentification} className="sm:col-span-2" />
            <AISPInfoTile label="Guardian Name" value={data?.guardianName} Icon={HiOutlineUserGroup} />
            <AISPInfoTile label="Guardian Contact" value={data?.guardianPhone} Icon={HiOutlinePhone} />
          </div>
        </AISPPanel>

        <AISPPanel title="Academic Information" subtitle="Your programme and enrolment record" Icon={HiOutlineAcademicCap}>
          <div className="grid sm:grid-cols-2 gap-3">
            <AISPInfoTile label="Student Number" value={`${data?.id ?? ""}`} Icon={HiOutlineIdentification} />
            <AISPInfoTile label="Index Number" value={data?.indexno} Icon={HiOutlineHashtag} />
            <AISPInfoTile label="Programme" value={data?.program?.longName} Icon={HiOutlineAcademicCap} className="sm:col-span-2" />
            <AISPInfoTile label="Major" value={data?.major?.longName} Icon={HiOutlineBookOpen} className="sm:col-span-2" />
            <AISPInfoTile label="Department" value={data?.program?.department?.title} Icon={HiOutlineBuildingLibrary} className="sm:col-span-2" />
            <AISPInfoTile label="Year" value={yearLabel} Icon={HiOutlineSparkles} />
            <AISPInfoTile label="Date of Admission" value={formatDate(data?.entryDate)} Icon={HiOutlineCalendarDays} />
            <AISPInfoTile label="Institutional Email" value={data?.instituteEmail?.toLowerCase()} Icon={HiOutlineAtSymbol} className="sm:col-span-2" />
            <AISPInfoTile label="Student Category" value={data?.entryGroup == "GH" ? "Ghanaian" : "International"} Icon={HiOutlineFlag} />
            <AISPInfoTile label="Academic Status" value={data?.completeStatus ? "Completed" : "Active Student"} Icon={HiOutlineShieldCheck} />
            <AISPInfoTile label="Residential Status" value={data?.residentialStatus} Icon={HiOutlineHomeModern} className="sm:col-span-2" />
          </div>
        </AISPPanel>
      </div>
    </div>
  );
}

export default PgAISPProfile;
