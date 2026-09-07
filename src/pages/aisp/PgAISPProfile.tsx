import moment from "moment";
import React from "react";
import { BiMoneyWithdraw } from "react-icons/bi";
import { BsCalendarRange } from "react-icons/bs";
import { FaPhoneAlt, FaRegAddressCard, FaTransgender } from "react-icons/fa";
import { FaRegCalendar } from "react-icons/fa6";
import { ImProfile } from "react-icons/im";
import { MdOutlineFiberPin, MdOutlineMarkEmailUnread } from "react-icons/md";
import { RiCommunityLine } from "react-icons/ri";
import { TbHomeCheck } from "react-icons/tb";
import { Link, useLoaderData } from "react-router-dom";
import AISPBioCard from "../../components/aisp/AISPBioCard";
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

  return (
    <div className="p-4 md:p-0 space-y-6 md:space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-primary">
          My Profile
        </h1>
        <Link
          to={`/aisp/profile/${encodeURIComponent(user?.user?.tag)}/edit`}
          className="px-4 py-2 rounded-lg bg-primary-accent text-white text-sm font-semibold hover:bg-primary-accent/90 transition-colors"
        >
          Edit Profile
        </Link>
      </div>

      {/* Summary card */}
      <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6">
        <img
          src={`${REACT_APP_API_URL}/auth/photos/?tag=${user?.user?.tag}`}
          className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-primary-accent/10 object-cover shrink-0"
        />
        <div className="flex-1 min-w-0 text-center md:text-left space-y-1">
          <h2 className="text-lg font-bold text-primary">{`${data?.fname} ${
            data?.mname ? data?.mname + " " : ""
          }${data?.lname}`}</h2>
          <p className="text-sm text-slate-400 font-medium">
            {data?.program?.longName || "Not Set"}
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
            <span className="px-2.5 py-1 rounded-full bg-primary-accent/10 text-primary-accent text-xs font-semibold">
              ID: {`${data?.id}`}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              INDEX: {data?.indexno || "Not Set"}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-primary-dark/10 text-primary-dark text-xs font-semibold">
              YEAR:{" "}
              {Math.ceil(data?.semesterNum / 2)
                ? Math.ceil(data?.semesterNum / 2).toString()
                : "COMPLETED"}
            </span>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-primary">
          Personal Information
        </h2>
        <div className="grid md:grid-cols-2 gap-3">
          <AISPBioCard
            label="Full Name"
            value={`${data?.fname} ${data?.mname ? data?.mname + " " : ""}${
              data?.lname
            }`}
            Icon={ImProfile}
          />
          <AISPBioCard
            label="Gender"
            value={data?.gender == "M" ? "MALE" : "FEMALE"}
            Icon={FaTransgender}
          />
          <AISPBioCard
            label="Date of Birth"
            value={
              (data?.dob &&
                moment(data?.dob).format("MMMM DD, YYYY").toUpperCase()) ||
              "Not Set"
            }
            Icon={FaRegCalendar}
          />
          <AISPBioCard
            label="Hometown"
            value={data?.hometown || "Not Set"}
            Icon={TbHomeCheck}
          />
          <AISPBioCard
            label="Phone Number"
            value={data?.phone || "Not Set"}
            Icon={FaPhoneAlt}
          />
          <AISPBioCard
            label="Email Address"
            value={data?.email?.toUpperCase() || "Not Set"}
            Icon={MdOutlineMarkEmailUnread}
          />
          <AISPBioCard
            label="Residential Address"
            value={data?.address?.toUpperCase() || "Not Set"}
            Icon={FaRegAddressCard}
          />
          <AISPBioCard
            label="Region"
            value={data?.region?.title || "Not Set"}
            Icon={BiMoneyWithdraw}
          />
          <AISPBioCard
            label="Country"
            value={data?.country?.longName || "Not Set"}
            Icon={RiCommunityLine}
          />
          <AISPBioCard
            label="Religion"
            value={data?.religion?.title || "Not Set"}
            Icon={BiMoneyWithdraw}
          />
          <AISPBioCard
            label="Disability"
            value={data?.disability?.title || "None"}
            Icon={BiMoneyWithdraw}
          />
          <AISPBioCard
            label="Ghana Card Number"
            value={data?.ghcardNo || "Not Set"}
            Icon={BsCalendarRange}
          />
          <AISPBioCard
            label="Guardian Name"
            value={data?.guardianName || "Not Set"}
            Icon={MdOutlineFiberPin}
          />
          <AISPBioCard
            label="Guardian Contact"
            value={data?.guardianPhone || "Not Set"}
            Icon={BsCalendarRange}
          />
        </div>
      </div>

      {/* Academic Information */}
      <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-primary">
          Academic Information
        </h2>
        <div className="grid md:grid-cols-2 gap-3">
          <AISPBioCard
            label="Student Number"
            value={`${data?.id}`}
            Icon={ImProfile}
          />
          <AISPBioCard
            label="Index Number"
            value={data?.indexno || "Not Set"}
            Icon={TbHomeCheck}
          />
          <AISPBioCard
            label="Programme"
            value={data?.program?.longName || "Not Set"}
            Icon={MdOutlineMarkEmailUnread}
          />
          <AISPBioCard
            label="Major"
            value={data?.major?.longName || "Not Set"}
            Icon={MdOutlineMarkEmailUnread}
          />
          <AISPBioCard
            label="Year"
            value={
              Math.ceil(data?.semesterNum / 2)
                ? (Math.ceil(data?.semesterNum / 2)).toString()
                : "COMPLETED"
            }
            Icon={MdOutlineMarkEmailUnread}
          />
          <AISPBioCard
            label="Department"
            value={data?.program?.department?.title || "Not Set"}
            Icon={FaPhoneAlt}
          />
          <AISPBioCard
            label="Institutional Email"
            value={data?.instituteEmail?.toUpperCase() || "Not Set"}
            Icon={FaRegAddressCard}
          />
          <AISPBioCard
            label="Date of Admission"
            value={
              (data?.entryDate &&
                moment(data?.entryDate)
                  .format("MMMM DD, YYYY")
                  .toUpperCase()) ||
              "Not Set"
            }
            Icon={FaRegCalendar}
          />
          <AISPBioCard
            label="Study Mode"
            value={
              data?.studyMode == "W"
                ? "WEEKEND"
                : data?.studyMode == "E"
                ? "EVENING"
                : "MORNING"
            }
            Icon={MdOutlineMarkEmailUnread}
          />
          <AISPBioCard
            label="Student Category"
            value={data?.entryGroup == "GH" ? "GHANAIAN" : "INTERNATIONAL"}
            Icon={MdOutlineFiberPin}
          />
          <AISPBioCard
            label="Academic Status"
            value={data?.completeStatus ? "COMPLETED" : "ACTIVE STUDENT"}
            Icon={MdOutlineFiberPin}
          />
          <AISPBioCard
            label="Residential Status"
            value={data?.residentialStatus?.toUpperCase() || "Not Set"}
            Icon={FaRegAddressCard}
          />
        </div>
      </div>
    </div>
  );
}

export default PgAISPProfile;
