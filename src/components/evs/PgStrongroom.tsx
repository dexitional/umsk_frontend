import React, { useEffect, useRef, useState } from "react";
import { Chart } from "react-google-charts";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Service from "../../utils/evsService";
import { useElectionSocket } from "../../utils/useElectionSocket";

const NOTICE_WAV_PATH = '/sounds/notice.wav';

function PgStrongroom() {
  const { electionId } = useParams();
  const [ pageview, setPageview ] = useState(0);

  // Sound Ref and Handler
  const playRef: any = useRef();
  const handlePlay = () => {
    const audio = new Audio(NOTICE_WAV_PATH);
    audio.play().catch(error => console.error("Playback failed:", error));
  };

  const { data: mdata, isLoading } = useQuery({
    queryKey: ["election-monitor", electionId],
    queryFn: () => Service.fetchVotes(electionId!),
    enabled: !!electionId,
    // staleTime: Infinity
  });

  // `data` starts null and only ever gets set by a socket push — `mdata`
  // (the query result) resolves after this initial render, but useState's
  // initial-value argument is only read once at mount, so without this
  // fallback the page would show nothing until the first vote came in even
  // though the query already has data.
  const [ data, setData ] = useState(mdata);
  const liveData = data ?? mdata;
  const portfolios = liveData?.portfolios || [];

  // 2. Real-time updates, with a sound alert on each push
  useElectionSocket(electionId, ["election-monitor", electionId], (newData) => {
    if (playRef.current) playRef.current.click();
    setData(newData);
  });

  // 3. Auto-Carousel Logic
  useEffect(() => {
    if (portfolios.length > 0) {
      const timer = setTimeout(() => setPageview((prev) => (prev + 1) % portfolios.length), 5000);
      return () => clearTimeout(timer);
    }
  }, [pageview, portfolios.length]);

  
  const getChartData = (index: number) => {
    const header = [["Candidate", "Votes"]];
    const portfolio = portfolios[index];
    if (!portfolio) return header;

    const candidateData = portfolio.candidates
      ?.filter((r: any) => r.votes > 0)
      ?.sort((a: any, b: any) => b.votes - a.votes)
      ?.map((d: any) => [d?.teaser?.toUpperCase() || d?.name?.toUpperCase() || "N/A", d?.votes]);

    return [...header, ...(candidateData || [])];
  }

  if (isLoading) return <div className="p-10 text-center font-bold">Initializing Strongroom...</div>;

  return (
    <div className="py-3 px-3 flex-1 h-full rounded bg-[#f1f1f1]/30 shadow-inner shadow-gray-500/30 space-y-3 md:space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <h1 className="px-4 py-2.5 col-span-3 text-xl rounded bg-primary/80 font-bold text-white flex flex-col space-y-2 md:space-y-0 md:flex-row justify-between">
          <span>STRONGROOM MONITOR</span>
          {/* <span className="animate-pulse">TURNOUT: {data?.turnout || 0}</span> */}
          <div className="flex items-center space-x-2">
            <span className="p-1 px-2 rounded text-sm font-bold bg-primary-accent tracking-wider disabled:opacity-50">TURNOUT</span>
            <span className={`p-0.5 px-2 rounded bg-purple-50 text-base text-primary font-extrabold tracking-wider ${isLoading && 'animate-pulse backdrop:blur-md'}`}>{isLoading ? '--' : (liveData?.turnout || '++')}</span>
          </div>
        </h1>
        {/* Hidden button for Audio Activation */}
        <button 
          onClick={handlePlay} 
          ref={playRef} 
          className="px-4 py-2 col-span-1 bg-white border-2 border-primary/20 hover:bg-slate-50 text-primary font-bold text-xs rounded-md shadow-sm transition-all"
        >
          🔔 ACTIVATE SOUND
        </button>
      </div>
      
      <div className="py-2 md:py-4 px-2 rounded shadow-inner shadow-gray-500/20 bg-white space-y-4">
        <div className="pt-2 flex items-center justify-center space-x-2">
          {portfolios.map((_, i) => (
            <div
              key={i}
              className={`h-4 w-4 md:h-6 md:w-6 rounded-full border-4 transition-colors duration-500 ${
                pageview === i ? "bg-primary/80" : "bg-slate-100"
              }`}
            />
          ))}
        </div>

        {portfolios.map((row: any, i: number) =>
          pageview === i ? (
            <div key={row.id} className="p-2 md:px-3 md:py-3 bg-zinc-200/50 shadow-inner space-y-2 md:space-y-4 animate-in fade-in duration-700">
              <h3 className="px-6 py-3.5 bg-white text-xs md:text-lg md:text-left text-center rounded shadow-inner shadow-gray-500/20 font-bold text-red-900">
                {row?.title?.toUpperCase()}
              </h3>
              <div className="px-4 py-4 bg-white text-xl rounded shadow-sm">
                <Chart
                  chartType="PieChart"
                  data={getChartData(i)}
                  options={{ 
                    is3D: true,
                    chartArea: { width: '90%', height: '90%' },
                    legend: { position: 'bottom' },
                    animation: { startup: true, duration: 1000, easing: 'out' }
                  }}
                  width={"100%"}
                  height={"400px"}
                />
              </div>
            </div>
          ) : null
        )}
        
        {portfolios.length === 0 && (
          <div className="p-10 text-center text-gray-400 font-medium">Waiting for voting data...</div>
        )}
      </div>
    </div>
  );
}

export default PgStrongroom;
