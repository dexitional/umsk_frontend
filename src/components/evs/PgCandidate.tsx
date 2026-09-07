import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Service from "../../utils/evsService";
import CandidateCard from "./CandidateCard";

function PgCandidate() {
  const { electionId } = useParams();

  // 1. Fetch Election Data/Votes
  const { data, isLoading, isError } = useQuery({
    queryKey: ["election-data", electionId],
    queryFn: () => Service.fetchVotes(electionId!),
    enabled: !!electionId,
  });

  if (isLoading) return <div className="p-10 text-center font-bold">Loading Aspirants...</div>;
  if (isError) return <div className="p-10 text-center text-red-500">Error loading aspirants.</div>;

  const portfolios = data?.portfolios || [];

  return (
    <div className="py-3 px-3 flex-1 h-full rounded bg-[#f1f1f1]/30 shadow-inner shadow-gray-500/30 space-y-6">
      <h1 className="px-4 py-2.5 flex items-center justify-between text-xl rounded bg-primary/80 font-semibold text-white">
        <span className="text-white uppercase">Display of Aspirants</span>
      </h1>
      
      <div className="py-4 px-2 rounded shadow-inner shadow-gray-500/20 bg-white space-y-4">
        <div className="px-2 py-2 h-[31rem] bg-zinc-200/50 shadow-inner space-y-6 overflow-y-auto">
          {portfolios.map((row: any) => (
            <div
              key={row.id}
              className="px-2 py-2 flex-1 bg-white rounded space-y-2"
            >
              <h2 className="px-6 py-1 rounded text-xs md:text-lg text-center text-primary font-extrabold tracking-widest bg-slate-200/70">
                {row?.title?.toUpperCase()}
              </h2>
              
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 place-content-start">
                {row?.candidates
                  ?.filter((m: any) => m.orderNo !== 0)
                  ?.sort((a: any, b: any) => a.orderNo - b.orderNo)
                  .map((r: any) => (
                    <CandidateCard
                      key={r?.id}
                      data={r}
                      vtotal={data?.turnout || 0}
                    />
                  ))}
              </div>
            </div>
          ))}
          
          {portfolios.length === 0 && (
            <div className="text-center py-10 text-gray-400">No portfolios found for this election.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PgCandidate;
