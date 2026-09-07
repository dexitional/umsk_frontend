import React from "react";
import { BsArrowUpRightCircle } from "react-icons/bs";
import { Link, redirect, useLoaderData } from "react-router-dom";
import NSSNoticeCard from "../../components/nss/NSSNoticeCard";
import { useUserStore } from "../../utils/authService";
import Service from "../../utils/hrsService";

type Props = {};

export async function action({ request }) {
  const formData = await request.formData();
  let data = Object.fromEntries(formData);
  data.vote = Number(data.vote);
  let resp = await Service.postNSS(data);
  if (resp) {
    const loadStudentVote = useUserStore.getState().loadStudentVote;
    loadStudentVote();
  }
  return redirect(`/hrs/nss/dash`);
}

// Load Data of Single
export async function loader({ params }) {
  let notices = await Service.fetchNSSNotices();
  return { notices };
}

function PgNSSDash({}: Props) {
  const user = useUserStore((state) => state.user);
  const { notices }: any = useLoaderData();

  return (
    <section className="pr-4 md:col-span-2 bg-gradient-to-r from-white via-slate-50 to-slate-100">
      <div className="md:py-2 md:col-span-2 rounded-xl space-y-4">
        {/* Banner */}
        <div className="min-h-fit p-3 md:py-6 md:px-4 bg-blue-950/90 bg-[url('./assets/img/eagle.png')] bg-no-repeat bg-center  rounded-xl text-white ">
          <div className="w-5/6 mx-auto md:space-y-3">
            <h1 className="md:text-2xl font-noto">
              Welcome to the portal,{" "}
              <span className="capitalize">
                {user?.user?.fname.toLowerCase()}
              </span>{" "}
              !
            </h1>
            <div className="font-noto">
              <p>Dashboard of the National Service Portal.</p>
            </div>
          </div>
        </div>

        {/* Notice */}
        <div className="relative px-6 py-2 min-h-fit mx-auto rounded-md  border border-lime-200 bg-lime-100 shadow-lg">
          <p className="px-1 md:px-2 md:py-0.5 absolute top-0 right-3 bg-amber-400 text-blue-950/70 text-[0.55rem] md:text-xs font-bold tracking-widest">
            UNIT ASSIGNED
          </p>
          <p className="text-xs md:text-sm font-bold tracking-widest text-blue-950/70">
            {user.user.department}
          </p>
        </div>

        {/* Circular Messages */}
        <Link to={`/nss/notices`}>
          <div className="relative px-6  h-1 mx-auto rounded-full bg-gradient-to-l from-blue-950/60 via-blue-950/50 to-white shadow-lg">
            <p className="px-2 py-0.5 md:px-3 md:py-1 absolute top-1 right-1 rounded-b-md bg-blue-950/60 text-white text-xs md:text-sm font-bold tracking-widest flex items-center space-x-2">
              <span>NSS NOTICES</span>
              <BsArrowUpRightCircle className="h-5 w-5" />
            </p>
          </div>
        </Link>

        <div className="space-y-2">
          {notices &&
            notices
              .filter((r, i) => i <= 2)
              .map((row) => (
                <NSSNoticeCard
                  key={row.id}
                  id={row.id}
                  title={row.subject}
                  content={row.message}
                  date={row.created_at}
                />
              ))}
        </div>
        {/* Documents & Latest Updates */}
      </div>
    </section>
  );
}

export default PgNSSDash;
