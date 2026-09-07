import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Service from "../../utils/evsService";

type Props = {
  data: any;
};

function EVSHeader({ data }: Props) {
  const [period, setPeriod] = useState("");
  const [stop, setStop] = useState(moment().isSameOrBefore(data.endAt));
  const navigate = useNavigate();

  const endElectionMutation = useMutation({
    mutationFn: () => Service.updateElection(data?.id, { action: "ENDED" }),
    onSuccess: () => navigate(0),
  });

  useEffect(() => {
    // Previously created with setInterval(..., []) and never cleared — the
    // countdown kept ticking (and could still fire the auto-stop mutation)
    // after this header unmounted. Recreating it per data/stop change and
    // clearing on cleanup keeps exactly one interval alive at a time.
    const interval = setInterval(() => {
      const time = moment(data.endAt).diff(moment(), "seconds");
      const time1 = moment(data.endAt).diff(moment(), "minutes");
      let hh = Math.floor(time / 3600);
      hh = hh < 0 ? 0 : hh;
      let mm = Math.round(time1 % 60);
      mm = mm < 0 ? 0 : mm;
      let ss = Math.round(time % 60);
      ss = ss < 0 ? 0 : ss;
      const output = `${hh.toString().length == 1 ? "0" + hh : hh}:${
        mm.toString().length == 1 ? "0" + mm : mm
      }:${ss.toString().length == 1 ? "0" + ss : ss}`;
      setPeriod(output);
      // Auto-stop Feature
      if (data.autoStop && output == "00:00:00" && stop) {
        setStop(false);
        endElectionMutation.mutate();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [data, stop]);

  return (
    <section className="mx-1.5 md:mx-auto py-6 w-full md:max-w-5xl flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-6">
      <div className="py-1.5 px-2.5 md:flex-1 h-full flex flex-row items-center justify-between space-x-2 md:space-x-10 rounded bg-[#f1f1f1]/30 shadow-inner shadow-gray-500/30">
        {/* <button onClick={()=> setElection(null) } className="px-1.5 md:px-3 py-1 flex items-center rounded  bg-amber-400 text-gray-800 tracking-wider font-bold uppercase">
                <FaChevronLeft className="w-4 h-4 text-black md:hidden" />
                <span className="hidden md:flex">Prev</span>
            </button> */}
        <h3 className="px-3 py-1.5 md:py-1 flex-1 rounded text-center text-xs md:text-lg font-bold tracking-widest text-blue-950 bg-slate-200/70">
          {data?.title}
        </h3>
        {/* <button onClick={()=> setElection(null) } className="px-1.5 md:px-3 py-1 flex items-center rounded bg-amber-400 text-gray-800 tracking-wider font-bold uppercase">
                <FaChevronRight className="w-4 h-4 text-black md:hidden" />
                <span className="hidden md:flex">Next</span>
            </button> */}
      </div>
      <div className="flex items-center space-x-3">
        <div className="px-4 py-2 md:py-1 md:px-3 w-full md:w-64 rounded bg-[#f1f1f1]/30 shadow-inner shadow-gray-500/30 space-y-6">
          <div className="text-center text-xl md:text-3xl text-blue-950 font-bold font-mono">
            {period}
          </div>
        </div>
        {/* <div className="px-4 py-2 md:py-1 md:px-3 w-full md:w-20 rounded bg-[#f1f1f1]/30 shadow-inner shadow-gray-500/30 space-y-6">
              <div className="text-center text-xl md:text-3xl text-blue-950 font-bold font-mono">stop</div>
          </div> */}
      </div>
    </section>
  );
}

export default EVSHeader;
