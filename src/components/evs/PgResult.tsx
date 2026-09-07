import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Service from "../../utils/evsService";
import CandidateCard from "./CandidateCard";
import CandidateCardNo from "./CandidateCardNo";
import { useReactToPrint } from "react-to-print";
import { useElectionSocket } from "../../utils/useElectionSocket";

function PgResult() {
  const { electionId } = useParams();
  const printRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Election Results
  const { data: fetchedData, isLoading, isError } = useQuery({
    queryKey: ["election-data", electionId],
    queryFn: () => Service.fetchVotes(electionId!),
    enabled: !!electionId,
  });

  // 2. Real-time updates — results were previously only as fresh as the
  // app-wide 30s poll; this election already pushes on every vote via the
  // same channel PgPublic/PgStrongroom use.
  const [data, setData] = useState(fetchedData);
  useElectionSocket(electionId, ["election-data", electionId], setData);
  const liveData = data ?? fetchedData;

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  if (isLoading) return <div className="p-10 text-center font-bold">Calculating Results...</div>;
  if (isError) return <div className="p-10 text-center text-red-500">Failed to load results.</div>;

  const voterCount = liveData?.voterCount || 0;
  const turnoutCount = liveData?.turnout || 0;

  return (
    <div 
      ref={printRef} 
      className="py-3 px-3 flex-1 h-full rounded bg-[#f1f1f1]/30 print:bg-transparent print:border-2 shadow-inner shadow-gray-500/30 space-y-6"
    >
      <div>
        <h1 className="px-4 py-2.5 flex items-center justify-between print:justify-center rounded print:rounded-xl bg-primary/80 print:bg-transparent print:border-4 font-semibold">
          <span className="text-white text-lg md:text-xl print:text-2xl print:text-gray-700 print:font-black">
            FINAL ELECTION RESULTS
          </span>
          <button 
            onClick={handlePrint} 
            className="p-0.5 px-2 print:hidden rounded bg-purple-50 text-base text-primary font-bold tracking-wider"
          >
            PRINT
          </button>
        </h1>
        <h1 className="px-4 py-0.5 mx-auto w-3/5 flex items-center justify-between print:justify-center rounded-b-xl print:bg-gray-200 print:border-4 print:border-t-0 font-semibold">
          <span className="text-white print:text-gray-700 print:font-bold text-center">
            {liveData?.election?.title?.toUpperCase()}
          </span>
        </h1>
      </div>

      <div className="py-4 px-2 rounded shadow-inner shadow-gray-500/20 bg-white space-y-4">
        {/* Statistics Bar */}
        <div className="mx-2 px-10 py-3 rounded flex flex-col md:flex-row print:flex-row items-center justify-center space-x-4 text-sm md:text-lg text-center text-primary font-bold tracking-widest bg-slate-100/70">
          <div className="flex flex-col space-y-1 text-sm md:text-base">
            <span className="px-3 py-0.5 rounded bg-slate-500 text-white w-fit">ELIGIBLE VOTERS</span>
            <span>{voterCount}</span>
          </div>
          <div className="flex flex-col space-y-1 text-sm md:text-base">
            <span className="px-3 py-0.5 rounded bg-green-600 text-white w-fit">TURNOUT</span>
            <span>{turnoutCount}</span>
          </div>
          <div className="flex flex-col space-y-1 text-sm md:text-base">
            <span className="px-3 py-0.5 rounded bg-slate-500 text-white w-fit">ABSENT</span>
            <span>{voterCount - turnoutCount}</span>
          </div>
        </div>

        {/* Portfolios and Results */}
        <div className="px-2 py-2 h-[31rem] print:h-full bg-zinc-200/50 shadow-inner space-y-3 overflow-y-auto print:overflow-hidden">
          {liveData?.portfolios?.map((row: any) => {
            // Find the highest vote count in this portfolio to determine winners
            const maxVotes = Math.max(...row.candidates.map((c: any) => c.votes || 0));
            
            return (
              <div key={row.id} className="px-2 py-2 flex-1 bg-white rounded space-y-2 print:break-after-page">
                <h2 className="px-6 py-1 rounded text-xs md:text-lg print:text-lg text-center text-primary font-extrabold tracking-widest bg-primary-200/70">
                  {row?.title?.toUpperCase()}
                </h2>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-2 place-content-start">
                  {row?.candidates?.map((r: any) => {
                    const isWinner = r.votes > 0 && r.votes === maxVotes;
                    const CardComponent = r.orderNo === 0 ? CandidateCardNo : CandidateCard;

                    return (
                      <CardComponent
                        key={r?.id}
                        data={r}
                        vtotal={turnoutCount}
                        showResult
                        winner={isWinner}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PgResult;
