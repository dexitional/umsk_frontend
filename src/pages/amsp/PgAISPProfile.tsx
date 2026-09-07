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

type Props = {};

// Load Data of Single
export async function loader({ params }) {
  const user = useUserStore.getState().user;
  const data = await Service.fetchStudent(user?.user?.tag);
  return { data, user };
}

function PgAISPProfile({}: Props) {
  const { data, user }: any = useLoaderData();
  console.log(data);

  return (
    <section className="my-3 md:my-0 md:mx-10 md:pr-4 md:col-span-2 border-x bg-gradient-to-r from-white via-white to-primary/5">
      <div className="px-3 md:px-10 md:py-8 md:col-span-2 rounded-xl space-y-4">
        {/* Banner */}
        <div className="min-h-fit py-1.5 px-3 md:py-2 md:px-4 bg-primary-dark/90 bg-[url('./assets/img/eagle.png')] bg-no-repeat bg-center rounded-md md:rounded-xl text-white flex items-center justify-center">
          <div className="w-full md:w-[90%] mx-auto flex items-center justify-between">
            <h1 className="md:text-2xl font-noto">My Profile</h1>
            <Link
              to={`/aisp/profile/${encodeURIComponent(user?.user?.tag)}/edit`}
              className="px-2 py-1 md:px-4 md:py-1 border border-white hover:bg-primary-accent/60 shadow-md rounded-md md:rounded-full text-[0.65rem] md:text-sm font-medium tracking-wider cursor-pointer"
            >
              <span>EDIT PROFILE</span>
            </Link>
          </div>
        </div>
        {/* Circular Messages */}
        <div className="flex w-full flex-1 flex-col md:flex-row space-between space-y-2 md:space-y-0 md:space-x-10">
          <div className="flex-1 space-y-2">
            <AISPBioCard
              label="Full Name"
              value={`${data?.fname} ${data?.mname && data?.mname + " "}${
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
              label="Residential Status"
              value={data?.residentialStatus?.toUpperCase() || "Not Set"}
              Icon={FaRegAddressCard}
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
          </div>
          <div className="flex-1 space-y-2">
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
              label="Level"
              value={
                Math.ceil(data?.semesterNum / 2) * 100
                  ? (Math.ceil(data?.semesterNum / 2) * 100).toString()
                  : "COMPLETED" || "Not Set"
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
              value={data?.address?.toUpperCase() || "Not Set"}
              Icon={FaRegAddressCard}
            />
            <AISPBioCard
              label="Ghana Card Number"
              value={
                (data?.end_date &&
                  moment(data?.end_date).format("MMMM, YYYY").toUpperCase()) ||
                "Not Set"
              }
              Icon={BsCalendarRange}
            />
            <AISPBioCard
              label="Date of Admission"
              value={
                (data?.dob &&
                  moment(data?.dob).format("MMMM DD, YYYY").toUpperCase()) ||
                "Not Set"
              }
              Icon={FaRegCalendar}
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
          </div>
        </div>
        {/* Documents & Latest Updates */}
      </div>
    </section>
  );
}

export default PgAISPProfile;
