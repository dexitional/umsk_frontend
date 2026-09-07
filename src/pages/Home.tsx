import React from "react";
// @ts-ignore
import { FaUsersViewfinder } from "react-icons/fa6";
import { GiVote } from "react-icons/gi";
import { HiAcademicCap } from "react-icons/hi2";
import { PiStudentFill } from "react-icons/pi";
import { RiLockPasswordFill } from "react-icons/ri";
import { SiCashapp } from "react-icons/si";
import { useNavigation } from "react-router-dom";
import AppCard from "../components/AppCard";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ServiceCard from "../components/ServiceCard";
import { useUserStore } from "../utils/authService";

function Home() {
  const { user, logout } = useUserStore((state) => state);
  const evsRole = user?.roles?.find((r) => r?.appRole?.app?.tag?.toLowerCase() == "evs");
  const aisRole = user?.roles?.findLast((r) => r?.appRole?.app?.tag?.toLowerCase() == "ais");
  const isEvsAdmin = user?.roles?.find((r) => r?.appRole?.app?.tag?.toLowerCase() == "evs" && r?.isAdmin);
  const navigation = useNavigation();
  const loadModule: any = navigation?.location?.pathname.split("/").find((r: any) => ["ais", "fms", "evs", "ams"].includes(r));
  const aisPage = ['ais admin','ais registrar','ais dean','ais head'].includes(aisRole?.appRole?.title?.toLowerCase()) ? '/ais/dash' : ['ais assessor'].includes(aisRole?.appRole?.title?.toLowerCase()) ? '/ais/mysheets' :'/ais/students';
  // const aisPage = ['ais admin','ais registrar','ais dean','ais head'].includes(aisRole?.appRole?.title?.toLowerCase()) ? '/ais/dash' :  '/ais/mysheets';
  // console.log("evsRole", evsRole)
  // console.log("aisRole", aisRole)
  // console.log("aisPage", aisPage)
  // console.log("user", user);
  return (
    <div className="w-full h-screen flex flex-col justify-between">
      <Header user={user} logout={logout} />
      <main className="w-full flex-1 flex flex-col overflow-y-scroll">
        <section className="mx-auto py-6 w-full max-w-6xl space-y-2">
          <h1 className="px-6 md:px-0 text-zinc-400 font-medium md:font-semibold md:text-xl">
            Browse By Services
          </h1>
          <div className="p-3 md:p-0 w-full bg-blue-50/50 md:bg-transparent grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4">
            {evsRole && (
              <ServiceCard
                title="General Elections Portal"
                Icon={GiVote}
                link="/evs/dash"
              />
            )}
            {[1].includes(user?.user?.group_id) && (
              <ServiceCard
                title="Student Portal System"
                Icon={FaUsersViewfinder}
                link="/aisp"
              />
            )}
            {/* <ServiceCard title="Staff Portal System" Icon={FaUsersViewfinder} link="#" /> */}
            {[3].includes(user?.user?.group_id) && (
              <ServiceCard
                title="Admission Portal System"
                Icon={FaUsersViewfinder}
                link=""
              />
            )}
            {/* { [4,2].includes(user?.user?.group_id) && <ServiceCard title="Single-Sign-On (SSO)" Icon={MdOutlineSupportAgent} link="" /> } */}
            {/* <ServiceCard title="Support tickets & Request" Icon={MdOutlineSupportAgent} link="" /> */}
            {/* <ServiceCard title="Setup SSO on Account" Icon={GiLockedDoor} link="" />
                <ServiceCard title="Community Marketplace" Icon={FaShopify} link="" />
                <ServiceCard title="UCC Alumni Network" Icon={MdGroups2} link="" /> */}
            <ServiceCard
              title="Change Password"
              Icon={RiLockPasswordFill}
              link="/ais/changepwd"
            />
          </div>
        </section>

        {[2, 4].includes(user?.user?.group_id) && (
          <section className="mx-auto py-6 w-full max-w-6xl space-y-4">
            <h1 className="px-6 md:px-0 text-zinc-400 font-medium md:font-semibold md:text-xl">
              Browse By Apps
            </h1>
            <div className="p-3 md:p-6 w-full bg-slate-50 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
              {evsRole && (
                <AppCard
                  title="Electa Voting System"
                  desc="Elect leaders, decide on issues by voting and referendum."
                  Icon={GiVote}
                  links={[
                    { title: "General Elections Portal", url: "/evs/dash" },
                    { title: "Manage Elections", url: "/evs/admin/elections" },
                  ]}
                  tag="evs"
                  page={loadModule}
                />
              )}

              {/* { user?.roles?.find(r => r?.appRole?.app?.tag?.toLowerCase() == 'desk') &&
                  <AppCard 
                      title="Helpdesk & Support System"
                      desc="Advanced support system for staff, students & public." 
                      Icon={MdOutlineSupportAgent} 
                      links={[
                        { title:'View admin console', url:'#'},
                      ]} 
                  />
                  } */}

              {/* { user?.roles?.find(r => r?.appRole?.app?.tag?.toLowerCase() == 'clock') &&
                  <AppCard 
                      title="Staff Attendance system"
                      desc="Staff daily attendance, clocking and duty logs." 
                      Icon={MdMeetingRoom} 
                      links={[
                        { title:'Goto application', url:'#'},
                      ]} 
                  />
                  } */}

              {user?.roles?.find(
                (r) => r?.appRole?.app?.tag?.toLowerCase() == "ams"
              ) && (
                <AppCard
                  title="Admission Management System &reg;"
                  desc="Manage new admission applications and new enrolments."
                  Icon={PiStudentFill}
                  links={[{ title: "Goto Application", url: "/ams/dash" }]}
                  tag="ams"
                  page={loadModule}
                />
              )}

              { user?.roles?.find((r) => r?.appRole?.app?.tag?.toLowerCase() == "ais") && (
                <AppCard
                  title="Academic Management System &reg;"
                  desc="Manage academic records, registration, assessment & graduation."
                  Icon={HiAcademicCap}
                  links={[{ title: "Goto Application", url: aisPage }]}
                  tag="ais"
                  page={loadModule}
                />
              )}

              {user?.roles?.find(
                (r) => r?.appRole?.app?.tag?.toLowerCase() == "fms"
              ) && (
                <AppCard
                  title="Finance Management System &reg;"
                  desc="Manage student financial records, payments, bills, charges and other transactions."
                  Icon={SiCashapp}
                  links={[{ title: "Goto Application", url: "/fms/accounts" }]}
                  tag="fms"
                  page={loadModule}
                />
              )}

              {/* { user?.roles?.find(r => r?.appRole?.app?.tag?.toLowerCase() == 'hrs') &&
                 <AppCard 
                    title="HR Management System &reg;"
                    desc="Manage staff records, leave, promotions & reports." 
                    Icon={ImProfile} 
                    links={[
                      { title:'Goto Application', url:'#'},
                    ]} 
                 />
                 } */}

              {/* { user?.roles?.find(r => r?.appRole?.app?.tag?.toLowerCase() == 'leta') &&
                 <AppCard 
                    title="LetaCabin &reg;"
                    desc="Manage organisation's letters and files efficiently." 
                    Icon={GiLetterBomb} 
                    links={[
                      { title:'Goto Application', url:'/dric/dash'},
                      { title:'New Setup', url:'#'},
                    ]} 
                 />
                 } */}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Home;
