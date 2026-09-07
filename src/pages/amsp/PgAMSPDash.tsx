import React from "react";
import { BsArrowUpRightCircle } from "react-icons/bs";
import { Link, redirect, useLoaderData } from "react-router-dom";
import AISPNoticeCard from "../../components/aisp/AISPNoticeCard";
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
  return redirect(`/aisp/dash`);
}

// Load Data of Single
export async function loader({ params }) {
  let notices = await Service.fetchNSSNotices();
  return { notices };
}

function PgAMSPDash({}: Props) {
  const user = useUserStore((state) => state.user);
  const { notices }: any = useLoaderData();

  return (
    <section className="pr-4 md:col-span-2 bg-gradient-to-r from-white via-slate-50 to-slate-100">
      <div className="md:py-2 md:col-span-2 rounded-xl space-y-4">
        {/* Banner */}
        <div className="min-h-fit p-3 md:py-6 md:px-4 bg-primary-dark/90 bg-[url('./assets/img/eagle.png')] bg-no-repeat bg-center  rounded-xl text-white ">
          <div className="w-5/6 mx-auto md:space-y-1">
            <h1 className="text-lg md:text-2xl font-noto">
              Welcome to the portal,{" "}
              <span className="capitalize">
                {user?.user?.fname.toLowerCase()}
              </span>{" "}
              !
            </h1>
            <div className="font-roboto flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 text-xs md:text-sm">
              {/* <p>Dashboard of the MLK Student Portal.</p> */}
              <p className="px-2 py-0.5 w-fit rounded bg-primary-accent/90">
                STUDENT NUMBER:&nbsp;&nbsp;<b>{user?.user?.tag}</b>
              </p>
              <p className="px-2 py-0.5 w-fit rounded bg-primary/90">
                INDEX NUMBER:&nbsp;&nbsp;<b>{user?.user?.tag}</b>
              </p>
            </div>
          </div>
        </div>

        {/* Notice */}
        <div className="relative px-6 py-2 pt-3 md:pt-2 min-h-fit mx-auto rounded-md  border border-lime-200 bg-lime-100 shadow-lg">
          <p className="px-1 md:px-2 md:py-0.5 absolute top-0 right-3 bg-primary-accent/50 text-primary-dark text-[0.55rem] md:text-xs font-bold tracking-widest">
            PROGRAM
          </p>
          <p className="text-xs md:text-sm font-bold tracking-widest text-primary/70">
            {user?.user?.descriptor}
          </p>
        </div>

        {/* Circular Messages */}
        <Link to={`/nss/notices`}>
          <div className="relative px-6  h-1 mx-auto rounded-full bg-gradient-to-l from-primary/90 via-primary/50 to-white shadow-lg">
            <p className="px-2 py-0.5 md:px-3 md:py-1 absolute top-1 right-1 rounded-b-md bg-primary/80 text-white text-xs md:text-sm font-bold tracking-widest flex items-center space-x-2">
              <span>MLK NOTICES</span>
              <BsArrowUpRightCircle className="h-5 w-5" />
            </p>
          </div>
        </Link>

        <div className="space-y-2">
          {notices &&
            notices
              .filter((r, i) => i <= 2)
              .map((row) => (
                <AISPNoticeCard
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

export default PgAMSPDash;
