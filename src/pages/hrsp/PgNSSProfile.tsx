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
import { useLoaderData } from "react-router-dom";
import NSSBioCard from "../../components/nss/NSSBioCard";
import { useUserStore } from "../../utils/authService";
import Service from "../../utils/hrsService";

type Props = {};

// Load Data of Single
export async function loader({ params }) {
  const user = useUserStore.getState().user;
  let data = await Service.fetchNSSByPin(user?.user?.tag);
  return { data };
}

function PgNSSProfile({}: Props) {
  const { data }: any = useLoaderData();
  console.log(data);

  return (
    <section className="pr-4 md:col-span-2 bg-gradient-to-r from-white via-slate-50 to-slate-100">
      <div className="md:py-2 md:col-span-2 rounded-xl space-y-4">
        {/* Banner */}
        <div className="min-h-fit py-2 px-4 bg-blue-950/90 bg-[url('./assets/img/eagle.png')] bg-no-repeat bg-center  rounded-xl text-white ">
          <div className="w-5/6 mx-auto space-y-3">
            <h1 className="md:text-2xl font-noto">NSS PROFILE</h1>
          </div>
        </div>
        {/* Circular Messages */}
        <div className="space-y-2">
          <NSSBioCard
            label="Full Name"
            value={`${data.fname} ${data.mname && data.mname + " "}${
              data.lname
            }`}
            Icon={ImProfile}
          />
          <NSSBioCard
            label="Gender"
            value={data.gender == "M" ? "Male" : "Female"}
            Icon={FaTransgender}
          />
          <NSSBioCard
            label="Date of Birth"
            value={
              (data.dob && moment(data.dob).format("MMMM DD, YYYY")) ||
              "Not Set"
            }
            Icon={FaRegCalendar}
          />
          <NSSBioCard
            label="Hometown"
            value={data.hometown || "Not Set"}
            Icon={TbHomeCheck}
          />
          <NSSBioCard
            label="Phone Number"
            value={data.mobile || "Not Set"}
            Icon={FaPhoneAlt}
          />
          <NSSBioCard
            label="Email Address"
            value={data.email || "Not Set"}
            Icon={MdOutlineMarkEmailUnread}
          />
          <NSSBioCard
            label="Residential Address"
            value={data.address || "Not Set"}
            Icon={FaRegAddressCard}
          />
          <NSSBioCard
            label="NSS Number"
            value={data.nss_no}
            Icon={MdOutlineFiberPin}
          />
          <NSSBioCard
            label="NSS Service Period"
            value={
              (data.start_date &&
                moment(data.start_date).format("MMMM, YYYY")) ||
              "Not Set"
            }
            Icon={BsCalendarRange}
          />
          <NSSBioCard
            label="Assigned Department"
            value={data.department || "Not Set"}
            Icon={RiCommunityLine}
          />
          <NSSBioCard
            label="Ezwich Number"
            value={data.ezwich_no || "Not Set"}
            Icon={BiMoneyWithdraw}
          />
          <NSSBioCard
            label="Emergency Contact Information"
            value={data.emergency_contact || "Not Set"}
            Icon={BiMoneyWithdraw}
          />
        </div>
        {/* Documents & Latest Updates */}
      </div>
    </section>
  );
}

export default PgNSSProfile;
