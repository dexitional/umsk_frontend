import React, { useEffect } from 'react'
// @ts-ignore
import Logo from '../../assets/img/logo.webp';
import { MdMeetingRoom, MdOutlineSupportAgent } from 'react-icons/md'
import { GiLetterBomb, GiVote } from 'react-icons/gi'
import AppCard from '../../components/AppCard'
import { ImProfile } from 'react-icons/im'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import ServiceCard from '../../components/ServiceCard'
import { useUserStore } from '../../utils/authService'
import { FaUsersViewfinder } from 'react-icons/fa6'
import { SiCashapp } from 'react-icons/si'
import { HiAcademicCap } from "react-icons/hi2";
import { RiLockPasswordFill } from 'react-icons/ri'

function HomeShims() {
  
  const { user, logout } = useUserStore(state => state)
  const evsRole =  user?.roles?.find((r: any) => r?.app?.toLowerCase() == 'evs')
  const isEvsAdmin =  user?.roles?.find((r: any) => r?.role?.toLowerCase() == 'election::admin')
  
  return (
    <div className="w-full h-screen flex flex-col justify-between">
        <Header user={user} logout={logout} />
        <main className="w-full flex-1 flex flex-col overflow-y-scroll">
          <section className="mx-auto py-6 w-full max-w-6xl space-y-2">
             <h1 className="px-6 md:px-0 text-zinc-400 font-medium md:font-semibold md:text-xl">Browse By Services</h1>
             <div className="p-3 md:p-0 w-full bg-blue-50/50 md:bg-transparent grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4">
                { evsRole && <ServiceCard title="General Elections Portal" Icon={GiVote} link="/evs/dash" /> }
                { [1].includes(user?.user?.group_id) && <ServiceCard title="Student Portal System" Icon={FaUsersViewfinder} link="/aisp" />}
                {/* <ServiceCard title="Staff Portal System" Icon={FaUsersViewfinder} link="#" /> */}
                {/* { [4,2].includes(user?.user?.group_id) && <ServiceCard title="Single-Sign-On (SSO)" Icon={MdOutlineSupportAgent} link="" /> } */}
                {/* <ServiceCard title="Support tickets & Request" Icon={MdOutlineSupportAgent} link="" /> */}
                {/* <ServiceCard title="Setup SSO on Account" Icon={GiLockedDoor} link="" />
                <ServiceCard title="Community Marketplace" Icon={FaShopify} link="" />
                <ServiceCard title="UCC Alumni Network" Icon={MdGroups2} link="" /> */}
                <ServiceCard title="Change Password" Icon={RiLockPasswordFill} link="/ais/changepwd" />
             </div>
          </section>

          { [2,4].includes(user?.user?.group_id) && 
          <section className="mx-auto py-6 w-full max-w-6xl space-y-4">
             <h1 className="px-6 md:px-0 text-zinc-400 font-medium md:font-semibold md:text-xl">Browse By Apps</h1>
             <div className="p-3 md:p-6 w-full bg-slate-50 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                 
                  { evsRole &&
                  <AppCard 
                      title="Electa Voting System"
                      desc="Elect leaders, decide on issues by voting and referendum." 
                      Icon={GiVote} 
                      links={[
                        { title:'General Elections Portal', url:'/evs/dash'},
                        ...(isEvsAdmin ? [{ title:'Manage Elections', url:'/evs/admin/elections'}] : []),
                      ]}
                  />
                  }

                  { user?.roles?.find((r: any) => r?.app?.toLowerCase() == 'desk') &&
                  <AppCard 
                      title="Helpdesk & Support System"
                      desc="Advanced support system for staff, students & public." 
                      Icon={MdOutlineSupportAgent} 
                      links={[
                        { title:'View admin console', url:'#'},
                      ]} 
                  />
                  }

                  { user?.roles?.find((r: any) => r?.app?.toLowerCase() == 'clock') &&
                  <AppCard 
                      title="Staff Attendance system"
                      desc="Staff daily attendance, clocking and duty logs." 
                      Icon={MdMeetingRoom} 
                      links={[
                        { title:'Goto application', url:'#'},
                      ]} 
                  />
                  }
                  
                  { user?.roles?.find((r: any) => r?.app?.toLowerCase() == 'ais') &&
                 <AppCard 
                    title="Academic Management System &reg;"
                    desc="Manage academic records, registration, assessment & graduation." 
                    Icon={HiAcademicCap} 
                    links={[
                      { title:'Goto Application', url:'/ais/students'},
                    ]} 
                 />
                 }

                 { user?.roles?.find((r: any) => r?.app?.toLowerCase() == 'fms') &&
                 <AppCard 
                    title="Finance Management System &reg;"
                    desc="Manage student financial records, payments, bills, charges and other transactions." 
                    Icon={SiCashapp} 
                    links={[
                      { title:'Goto Application', url:'/fms/accounts'},
                    ]} 
                 />
                 }

                 { user?.roles?.find((r: any) => r?.app?.toLowerCase() == 'hrs') &&
                 <AppCard 
                    title="HR Management System &reg;"
                    desc="Manage staff records, leave, promotions & reports." 
                    Icon={ImProfile} 
                    links={[
                      { title:'Goto Application', url:'#'},
                    ]} 
                 />
                 }
                
                { user?.roles?.find((r: any) => r?.app?.toLowerCase() == 'leta') &&
                 <AppCard 
                    title="LetaCabin &reg;"
                    desc="Manage organisation's letters and files efficiently." 
                    Icon={GiLetterBomb} 
                    links={[
                      { title:'Goto Application', url:'/dric/dash'},
                      { title:'New Setup', url:'#'},
                    ]} 
                 />
                 }

             </div>
          </section>
          }

        </main>
        <Footer />
    </div>
  )
}

export default HomeShims