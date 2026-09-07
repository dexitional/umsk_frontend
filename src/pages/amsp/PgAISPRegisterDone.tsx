import React from "react";
import { BsArrowUpRightCircle } from "react-icons/bs";
import { Link, useLoaderData } from "react-router-dom";
import AISPInstructCard from "../../components/aisp/AISPInstructCard";
import Service from "../../utils/hrsService";

type Props = {};

// Load Data of Single
export async function loader({ params }) {
  let data = { id: 0 };
  const id = params?.pin || 0;
  if (id != 0) data = await Service.fetchNSSByPin(id);
  return { data };
}

function PgAISPRegisterDone({}: Props) {
  const { data }: any = useLoaderData();
  console.log(data);

  return (
    <section className="pr-4 md:col-span-2 bg-gradient-to-r from-white via-slate-50 to-slate-100">
      <div className="md:py-2 md:col-span-2 rounded-xl space-y-4">
        {/* Banner */}
        <div className="min-h-fit py-6 px-4 bg-blue-950/90 bg-[url('./assets/img/eagle.png')] bg-no-repeat bg-center  rounded-xl text-white ">
          <div className="w-5/6 mx-auto space-y-3">
            <h1 className="text-2xl font-noto">
              Congratulations {data?.fname}!
            </h1>
            <div className="font-noto">
              <p>
                You have successfully been enrolled into our NSS System with{" "}
                <b>SSO Identity: {data?.nss_no}</b>, Please stay in-touch for
                more feeds and notices.
              </p>
            </div>
          </div>
        </div>

        {/* Notice */}
        <div className="relative px-6 py-2 min-h-fit mx-auto rounded-md  border border-lime-200 bg-lime-100 shadow-lg">
          <p className="px-2 py-0.5 absolute top-0 right-3 bg-amber-400 text-blue-950/70 text-xs font-bold tracking-widest">
            UNIT ASSIGNED
          </p>
          <p className="text-sm font-bold tracking-widest text-blue-950/70">
            {data?.department?.toUpperCase() || "NOT SET"}
          </p>
        </div>

        {/* Circular Messages */}
        <div>
          <div className="relative px-6  h-1 mx-auto rounded-full bg-gradient-to-l from-blue-950/60 via-blue-950/50 to-white shadow-lg">
            <p className="px-3 py-1 absolute top-1 right-1 rounded-b-md bg-blue-950/60 text-white text-sm font-bold tracking-widest flex items-center space-x-2">
              <span className="text-lg">GUIDE</span>
              <BsArrowUpRightCircle className="h-5 w-5" />
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <AISPInstructCard title="How To Log Into UCC NSS Portal">
            <p className="text-base text-gray-500 md:line-clamp-1">
              1. Goto{" "}
              <Link
                className="text-amber-700 italic"
                to={`https://ehub.vercel.app`}
              >
                https://ehub.vercel.app
              </Link>
            </p>
            <p className="text-base text-gray-500 md:line-clamp-2">
              2. Click on <b>Sign In with SSO Crendentials</b> and provide your{" "}
              <b>NSS NUMBER</b> as{" "}
              <em>
                <u>SSO Identity</u>
              </em>{" "}
              and your{" "}
              <em>
                <u>SSO Password</u>
              </em>{" "}
              provided during the registration created.
            </p>
            <p className="text-base text-gray-500 md:line-clamp-1">
              3. Click on <b>NSS Portal</b> to send you into the UCC NSS Portal.
            </p>
          </AISPInstructCard>
          <AISPInstructCard title="Benefits of UCC NSS Portal">
            <p className="text-base text-gray-500 md:line-clamp-1">
              1. Easy <b>correspondences</b> on events and excercises.
            </p>
            <p className="text-base text-gray-500 md:line-clamp-2">
              2. Effective <b>digital record</b> and profile with easy
              verification.
            </p>
            <p className="text-base text-gray-500 md:line-clamp-1">
              3. Easy access to <b>Electa voting system</b> for electing NSS
              leaders.
            </p>
            <p className="text-base text-gray-500 md:line-clamp-1">
              4. Easy access to <b>SMSFly system</b> for bulk messaging and
              engagement.
            </p>
          </AISPInstructCard>
          <div className="border rounded-xl bg-white"></div>
        </div>
        {/* Documents & Latest Updates */}
      </div>
    </section>
  );
}

export default PgAISPRegisterDone;
