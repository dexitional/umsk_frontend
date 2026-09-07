import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useUserStore } from "../../utils/authService";
import Service from "../../utils/evsService";
import VoterCard from "./VoterCard";

function PgRegister() {
  const { electionId } = useParams();
  const [keyword, setKeyword] = useState("");
  const user = useUserStore.getState().user;

  // 1. Fetch Election Data
  const { data: election, isLoading, isError } = useQuery({
    queryKey: ["election", electionId],
    queryFn: () => Service.fetchElection(electionId!),
    enabled: !!electionId, // Only run if ID exists
  });

  // 2. Handle "Send Pins" Mutation
  const sendPinsMutation = useMutation({
    mutationFn: () => Service.sendElectionPins(election?.id),
  });

  // 2. Handle "Send Pins" Mutation
  const sendReminderMutation = useMutation({
    mutationFn: () => Service.sendElectionReminder(election?.id),
  });


  const isAdmin = !!election?.admins?.find(
    (r: string) => r?.toLowerCase() === user?.user?.tag?.toLowerCase()
  );

  if (isLoading) return <div className="p-10 text-center">Loading Register...</div>;
  if (isError) return <div className="p-10 text-center text-red-500">Error loading data.</div>;

  return (
    <div className="py-3 px-3 flex-1 h-full rounded bg-[#f1f1f1]/30 shadow-inner shadow-gray-500/30 space-y-6">
      <h1 className="px-4 py-2.5 flex items-center justify-between text-xl rounded bg-primary/80 font-semibold text-white">
        <span className="text-white">VOTERS REGISTER</span>
        <div className="flex items-center space-x-2">
          <span className="p-0.5 px-2 rounded bg-purple-50 text-base text-primary font-extrabold tracking-wider">
            {election?.voterData?.length || 0}
          </span>
          { isAdmin && (
            <button
              onClick={() => sendPinsMutation.mutate()}
              disabled={sendPinsMutation.isPending}
              className="p-1 px-2 rounded text-sm font-bold bg-primary-accent tracking-wider disabled:opacity-50"
            >
              {sendPinsMutation.isPending ? "SENDING..." : "SEND PINS"}
            </button>
          )}
           { isAdmin && (
            <button
              onClick={() => sendReminderMutation.mutate()}
              disabled={sendReminderMutation.isPending}
              className="p-1 px-2 rounded text-sm font-bold bg-primary-accent tracking-wider disabled:opacity-50"
            >
              {sendReminderMutation.isPending ? "PUSHING REMINDERS..." : "PUSH REMINDERS"}
            </button>
          )}

        </div>
      </h1>

      <div className="py-4 px-2 rounded shadow-inner shadow-gray-500/20 bg-white space-y-4">
        <div className="mx-2 px-6 py-1 rounded-full text-base text-center text-blue-950 font-medium tracking-widest bg-slate-200/70">
          <input
            type="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search Register with keyword ..."
            className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none"
          />
        </div>

        <div className="px-2 py-2 bg-zinc-200/50 shadow-inner">
          <div className="px-2 py-2 bg-white rounded">
            <div className="w-full h-96 grid grid-cols-1 md:grid-cols-2 gap-2 place-content-start overflow-y-scroll">
              {election?.voterData
                ?.filter(
                  (r: any) =>
                    r?.tag?.toLowerCase().includes(keyword.toLowerCase()) ||
                    r?.name?.toLowerCase().includes(keyword.toLowerCase())
                )
                ?.map((row: any, i: number) => (
                  <VoterCard
                    key={i} 
                    data={row}
                    vmask={election?.allowMask}
                    isAdmin={isAdmin}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PgRegister;
