import React from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Logo from "../assets/img/logo.webp";
import Service from "../../utils/evsService";
import EVSNavItem from "./EVSNavItem";
import { useUserStore } from "../../utils/authService";

const { REACT_APP_API_URL } = import.meta.env;

type Props = {
  data: any; // This is the initial data passed from the parent layout
};

function PgSidebar({ data: initialData }: Props) {
  
  const { electionId } = useParams();
  const user = useUserStore.getState().user;

  // 1. TanStack Query for live synchronization
  const { data: dm } = useQuery({
    queryKey: ["sidebar", electionId],
    queryFn: () => Service.fetchElection(electionId!),
    enabled: !!electionId,
    // Disable Caching
    gcTime: 0, 
    staleTime: 0,
    // Disable Auto-Refresh triggers
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: 'always', 
  });

  // Admin status check (assuming it's part of the data object)
  // const isAdmin = dm?.isAdmin;
  const isAdmin = !!dm?.admins?.find(
    (r: string) => r?.toLowerCase() === user?.user?.tag?.toLowerCase()
  );
  

  return (
    <div className="p-4 md:py-6 md:px-3 w-full md:w-64 h-fit rounded bg-[#f1f1f1]/30 shadow-inner shadow-gray-500/30 space-y-6">
      <img
        src={`${REACT_APP_API_URL}/auth/pixo?eid=${dm?.id}` || Logo}
        alt=""
        className="mx-auto w-28 h-28 object-contain"
      />
      
      <Link to="../dash">
        <button className="mt-4 py-2 w-full rounded-lg bg-primary/90 font-bold text-sm text-amber-200 text-center">
          GOTO ELECTIONS PAGE
        </button>
      </Link>

      <div className="p-3 rounded shadow-inner shadow-gray-500/20 bg-white space-y-2">
        <EVSNavItem url="candidate" title="CANDIDATES VIEW" />
        <EVSNavItem url="register" title="VOTERS REGISTER" />
        
        {/* Dynamic Navigation based on Live Status */}
        {(dm?.allowMonitor || (dm?.allowEcMonitor && isAdmin)) && (
          <EVSNavItem url="public" title="PUBLIC MONITOR" />
        )}
        
        {(dm?.allowVip || (dm?.allowEcVip && isAdmin)) && (
          <EVSNavItem url="vip" title="STRONG ROOM" />
        )}
        
        {isAdmin && (
          <EVSNavItem url="control" title="ADMIN CONTROLS" />
        )}
        
        {((dm?.allowResult || (dm?.allowEcResult && isAdmin)) && dm?.action === "ENDED") && (
          <EVSNavItem url="result" title="FINAL RESULTS" />
        )}
      </div>
    </div>
  );
}

export default PgSidebar;
