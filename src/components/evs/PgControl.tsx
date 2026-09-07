import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import Service from "../../utils/evsService";
import ControlCard from "./ControlCard";

function PgControl() {
  const { electionId } = useParams();
  const queryClient = useQueryClient();

  // 1. Fetch Election Data
  const { data: election, isLoading } = useQuery({
    queryKey: ["election", electionId],
    queryFn: () => Service.fetchElection(electionId!),
    enabled: !!electionId,
  });

  // 2. Setup Mutation for Updates
  const updateMutation = useMutation({
    mutationFn: (updateData: any) => Service.updateElection(election?.id, updateData),
    onSuccess: () => {
      // Invalidate the cache to trigger an auto-refetch of fresh data
      queryClient.invalidateQueries({ queryKey: ["election", electionId] });
    },
    onError: (error) => {
      console.error("Update failed:", error);
      alert("Failed to update control setting.");
    }
  });

  const onCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.checked);
    updateMutation.mutate({ [e.target.name]: value });
  };

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    updateMutation.mutate({ [e.target.name]: value });
  };

  if (isLoading) return <div className="p-10 text-center">Loading Controls...</div>;

  return (
    <div className="py-3 px-3 flex-1 h-full rounded bg-[#f1f1f1]/30 shadow-inner shadow-gray-500/30 space-y-6">
      <h1 className="px-4 py-2.5 flex flex-col md:flex-row md:items-center md:justify-between space-y-1 md:space-y-0 text-xl rounded bg-primary/80 font-semibold text-white">
        <span className="text-white">ADMIN CONTROLS</span>
        
        <div className="px-1 py-1 rounded border-2 border-white flex items-center space-x-2">
          <span className="px-1 text-sm">ELECTION PROCESS</span>
          <select
            className="p-0.5 px-1 rounded bg-purple-50 text-sm text-primary font-bold tracking-wider focus:ring-0 focus:outline-none disabled:opacity-50"
            name="action"
            value={election?.action}
            onChange={onChange}
            disabled={updateMutation.isPending}
          >
            <option value="STAGED">STAGED</option>
            <option value="STARTED">STARTED</option>
            <option value="ENDED">ENDED</option>
          </select>
        </div>
      </h1>

      <div className="py-4 px-2 rounded shadow-inner shadow-gray-500/20 bg-white space-y-4">
        <div className="px-2 py-2 bg-zinc-200/50 shadow-inner">
          <div className="px-2 py-2 bg-white rounded">
            {/* 
               Adding a visual indicator if something is updating 
            */}
            {updateMutation.isPending && (
              <div className="text-xs text-blue-500 font-bold animate-pulse mb-2">Updating settings...</div>
            )}
            
            <form className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 place-content-start overflow-y-scroll">
              <ControlCard
                onChange={onCheckChange}
                title="PUBLIC MONITOR"
                action="allowMonitor"
                desc="Percentage statistics in realtime"
                data={election}
              />
              <ControlCard
                onChange={onCheckChange}
                title="EC PUBLIC MONITOR"
                tag="ADMIN"
                action="allowEcMonitor"
                desc="Percentage statistics in realtime"
                data={election}
              />
              <ControlCard
                onChange={onCheckChange}
                title="VIP MONITOR"
                action="allowVip"
                desc="Actual statistics in realtime"
                data={election}
              />
              <ControlCard
                onChange={onCheckChange}
                title="EC VIP MONITOR"
                tag="ADMIN"
                action="allowEcVip"
                desc="Actual statistics in realtime"
                data={election}
              />
              <ControlCard
                onChange={onCheckChange}
                title="FINAL RESULTS"
                action="allowResult"
                desc="Actual statistics in realtime"
                data={election}
              />
              <ControlCard
                onChange={onCheckChange}
                title="EC FINAL RESULTS"
                tag="ADMIN"
                action="allowEcResult"
                desc="Actual statistics in realtime"
                data={election}
              />
              <ControlCard
                onChange={onCheckChange}
                title="VOTER STATUS"
                action="allowMask"
                desc="Voting status of eligible electors"
                data={election}
              />
              <ControlCard
                onChange={onCheckChange}
                title="AUTO-STOP PROCESS"
                action="autoStop"
                desc="Automatically End Election on Close time"
                data={election}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PgControl;
