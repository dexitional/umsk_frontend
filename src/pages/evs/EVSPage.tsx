import React from "react";
import { Outlet, useLocation, useNavigation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import EVSHeader from "../../components/evs/EVSHeader";
import PgSidebar from "../../components/evs/PgSidebar";
import Loader from "../../components/Loader";
import { useUserStore } from "../../utils/authService";
import Service from "../../utils/evsService";

function EVSPage() {
  const { electionId } = useParams();
  const user = useUserStore.getState().user;
  const location = useLocation();
  const pathname = location.pathname.split('/')[location.pathname.split('/').length-1]

  // 1. Fetch Election Data with TanStack Query
  const { data: election, isLoading } = useQuery({
    queryKey: ["election", electionId],
    queryFn: async () => {
      const data = await Service.fetchElection(electionId!);
      
      // Calculate admin status here so it's part of the cached object
      const isAdmin = !!data?.admins?.find(
        (r: string) => r?.toLowerCase() === user?.user?.tag?.toLowerCase()
      );

      return { ...data, isAdmin };
    },
    enabled: !!electionId && !!user, // Only run if we have the ID and User
  });

  // 2. Handle initial loading state
  if (isLoading) return <Loader />;

  return (
    <main className="w-full flex flex-col overflow-y-scroll">
      {/* Pass the fetched data to Header and Sidebar */}
      <EVSHeader data={election} />
      
      <section className="mx-1.5 md:mx-auto py-6 w-full md:max-w-6xl flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
        <div className="flex-1 relative">
         
           { (  election?.isAdmin && ( ['candidate','register'].includes(pathname))
                && (pathname == 'public' && election?.allowMonitor || (election?.allowEcMonitor && election.isAdmin))
                && (pathname == 'vip' && election?.allowVip || (election?.allowEcVip && election.isAdmin))
                && (pathname == 'result' && election?.allowResult || (election?.allowEcResult && election.isAdmin))
                && (pathname == 'control' && election.isAdmin)
                && ['candidate','register'].includes(pathname)
            ) 
            ? (<Outlet context={{ election }} />) 
            : null 
          } 
          <Outlet context={{ election }} />
          
        </div>
        <PgSidebar data={{...election, isLoading }} />
      </section>
    </main>
  );
}

export default EVSPage;
