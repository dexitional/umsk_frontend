import React from "react";
import SubPageTitle from "../../components/hrs/SubPageTitle";
// @ts-ignore
import moment from "moment";
import { BiMoneyWithdraw } from "react-icons/bi";
import { BsCalendarRange } from "react-icons/bs";
import {
  FaNewspaper,
  FaPhoneAlt,
  FaRegCalendar,
  FaTransgender,
} from "react-icons/fa";
import { FaRegAddressCard } from "react-icons/fa6";
import { ImProfile } from "react-icons/im";
import {
  MdLocationOn,
  MdOutlineFiberPin,
  MdOutlineMarkEmailUnread,
} from "react-icons/md";
import { RiCommunityLine } from "react-icons/ri";
import { TbEdit, TbHomeCheck } from "react-icons/tb";
import { Link, useLoaderData } from "react-router-dom";
import Logo from "../../assets/img/logo/ucc/logo.png";
import AISPBioCard from "../../components/aisp/AISPBioCard";
import Service from "../../utils/hrsService";

type Props = {};

export async function loader({ params }) {
  const data = await Service.fetchNSS(params.nssId);
  return { data };
}

function PgHRSNSSPerson({}: Props) {
  const { data }: any = useLoaderData();
  return (
    <main className="md:pl-10 p-3 md:p-6 space-y-3 md:space-y-10">
      <SubPageTitle title={``} page="NSS PROFILE" />
      <div className="p-3 md:p-6 border bg-slate-50/50 rounded-xl md:space-y-6 space-y-4 ">
        <section className="relative flex space-x-2 md:space-x-6">
          <div className="hidden md:block p-2 md:p-4 h-16 w-16 md:h-32 md:w-32 border rounded-xl shadow-lg bg-white">
            <img
              src={Logo}
              className="h-14 w-14 md:h-24 md:w-24 object-contain"
            />
          </div>
          <Link
            to={`edit`}
            className="p-1 md:py-1.5 md:px-2 absolute right-0 top-0 bg-slate-50 border border-gray-200 rounded flex"
          >
            {/* <span className="text-gray-400">EDIT</span> */}
            <TbEdit className="h-5 w-5 text-gray-300" />
          </Link>
          <div className="flex-1 flex flex-col space-y-4 md:space-y-3">
            <div className="flex space-x-2">
              <div className="block md:hidden p-2 md:p-4 h-16 w-16 border rounded-xl shadow-lg bg-white">
                <img src={Logo} className="h-12 w-12 object-contain" />
              </div>
              <h1 className="text-md md:text-3xl md:tracking-wide leading-5 font-semibold text-blue-950/70">
                {data?.fname} {data?.mname && data?.mname + " "}
                {data?.lname}
              </h1>
            </div>
            <div className="w-full flex flex-col md:flex-row md:items-center space-x-2 text-zinc-400 text-lg">
              <div className="flex items-center space-x-2">
                <span className="tracking-wider text-xs md:text-lg capitalize">
                  {data?.hometown}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                <span className="text-xs md:text-lg capitalize">
                  {data?.mobile}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
              </div>
              <div className="flex items-center space-x-1">
                <MdLocationOn className="h-5 w-5 text-blue-950/70" />
                <span className="text-sm md:text-lg capitalize">
                  {data?.department}
                </span>
              </div>
            </div>
            <p className="text-gray-400 md:text-gray-500 text-xs md:text-sm font-noto">
              {data?.address}
            </p>
          </div>
        </section>

        <section className="gap-y-2">
          <div className="p-2 md:py-4 md:px-6 flex flex-col space-y-3 md:space-y-6 border rounded-md md:rounded-xl bg-white">
            <div className="md:pl-6 space-y-4">
              <div className="space-y-2">
                <AISPBioCard
                  label="Full Name"
                  value={`${data.fname} ${data.mname && data.mname + " "}${
                    data.lname
                  }`}
                  Icon={ImProfile}
                />
                <AISPBioCard
                  label="Gender"
                  value={data.gender == "M" ? "MALE" : "FEMALE"}
                  Icon={FaTransgender}
                />
                <AISPBioCard
                  label="Date of Birth"
                  value={
                    (data.dob &&
                      moment(data.dob).format("MMMM DD, YYYY").toUpperCase()) ||
                    "Not Set"
                  }
                  Icon={FaRegCalendar}
                />
                <AISPBioCard
                  label="Hometown"
                  value={data.hometown || "Not Set"}
                  Icon={TbHomeCheck}
                />
                <AISPBioCard
                  label="Phone Number"
                  value={data.mobile || "Not Set"}
                  Icon={FaPhoneAlt}
                />
                <AISPBioCard
                  label="Email Address"
                  value={data.email?.toUpperCase() || "Not Set"}
                  Icon={MdOutlineMarkEmailUnread}
                />
                <AISPBioCard
                  label="Residential Address"
                  value={data.address.toUpperCase() || "Not Set"}
                  Icon={FaRegAddressCard}
                />
                <AISPBioCard
                  label="NSS Number"
                  value={data.nss_no}
                  Icon={MdOutlineFiberPin}
                />
                <AISPBioCard
                  label="NSS Start Period"
                  value={
                    (data.start_date &&
                      moment(data.start_date)
                        .format("MMMM, YYYY")
                        .toUpperCase()) ||
                    "Not Set"
                  }
                  Icon={BsCalendarRange}
                />
                <AISPBioCard
                  label="NSS End Period"
                  value={
                    (data.end_date &&
                      moment(data.end_date)
                        .format("MMMM, YYYY")
                        .toUpperCase()) ||
                    "Not Set"
                  }
                  Icon={BsCalendarRange}
                />
                <AISPBioCard
                  label="Assigned Department"
                  value={data.department || "Not Set"}
                  Icon={RiCommunityLine}
                />
                <AISPBioCard
                  label="Ezwich Number"
                  value={data.ezwich_no || "Not Set"}
                  Icon={BiMoneyWithdraw}
                />
                <AISPBioCard
                  label="Emergency Contact Information"
                  value={data.emergency_contact || "Not Set"}
                  Icon={BiMoneyWithdraw}
                />
              </div>
            </div>
          </div>
        </section>

        {data?.projects?.length ? (
          <section>
            {/* Project History */}
            <div className="p-2 md:py-4 md:px-6 flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-10 border rounded-md md:rounded-xl bg-white">
              <h1 className="py-0.5 px-2 md:px-3 w-fit text-xs md:text-base font-semibold rounded-md bg-blue-950/60 text-white tracking-widest uppercase -skew-x-6">
                PROJECTS FUNDED
              </h1>
              <div className="md:pl-6 space-y-4">
                {data?.projects?.map((row: any) => (
                  <div key={row.id} className="flex md:items-center space-x-6">
                    <FaNewspaper className="w-3 h-3 md:h-5 md:w-6 text-blue-950/70" />
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
                      <pre className="text-xs md:text-base text-gray-500">
                        {row.title}
                      </pre>
                      <span className="py-0.5 px-2 w-fit bg-slate-200 font-semibold text-[0.6rem] md:text-xs text-gray-500 rounded uppercase">
                        START - {moment(row.start).format("MMM DD, YYYY")}
                      </span>
                      <span className="py-0.5 px-2 w-fit bg-slate-200 font-semibold text-[0.6rem] md:text-xs text-gray-500 rounded uppercase">
                        END - {moment(row.end).format("MMM DD, YYYY")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

export default PgHRSNSSPerson;
