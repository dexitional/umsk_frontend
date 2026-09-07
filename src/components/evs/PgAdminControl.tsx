import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Service from "../../utils/evsService";
import ControlActionCard from "./ControlActionCard";
import ControlCard from "./ControlCard";

function PgAdminControl() {
  const { electionId } = useParams();
  const queryClient = useQueryClient();

  // 1. Fetch Election Data
  const { data: election, isLoading } = useQuery({
    queryKey: ["election", electionId],
    queryFn: () => Service.fetchElection(electionId!),
    enabled: !!electionId,
  });

  // 2. Setup Mutations
  // Shared invalidation logic to refresh the UI after any change
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["election", electionId] });

  const updateMutation = useMutation({
    mutationFn: (updateData: any) => Service.updateElection(election?.id, updateData),
    onSuccess: refresh,
  });

  const resetMutation = useMutation({
    mutationFn: () => Service.resetElection(election?.id),
    onSuccess: refresh,
  });

  const adminMutation = useMutation({
    mutationFn: (tag: string) => Service.updateAdmin(election?.id, tag),
    onSuccess: refresh,
  });

  const stageMutation = useMutation({
    mutationFn: () => Service.stageVoters(election?.id),
    onSuccess: refresh,
  });

  // 3. Event Handlers
  const onCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateMutation.mutate({ [e.target.name]: Number(e.target.checked) });
  };

  const onProcessChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateMutation.mutate({ [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    if (window.confirm("Reset Election? This will clear all votes.")) {
      resetMutation.mutate();
    }
  };

  const handleUpdateAdmin = () => {
    const tag = window.prompt("Please provide Administrator User Identification!");
    if (tag) adminMutation.mutate(tag);
  };

  const handleStageVoters = () => {
    if (window.confirm("Stage Voters For Election?")) {
      stageMutation.mutate();
    }
  };

  if (isLoading) return <div className="p-10 text-center font-bold">Loading Admin Controls...</div>;

  return (
    <div className="py-3 px-3 flex-1 h-full rounded bg-[#f1f1f1]/30 shadow-inner shadow-gray-500/30 space-y-6">
      <h1 className="px-4 py-2.5 flex flex-col md:flex-row md:items-center md:justify-between space-y-1 md:space-y-0 text-xl rounded bg-primary/80 font-semibold text-white">
        <span className="text-white">ADMIN CONTROLS</span>
        <div className="px-1 py-1 rounded border-2 border-white flex items-center space-x-2">
          <span className="px-1 text-sm">ELECTION PROCESS</span>
          <select
            className="p-0.5 px-1 rounded bg-purple-50 text-sm text-primary font-bold tracking-wider focus:ring-0 focus:outline-none"
            name="action"
            value={election?.action}
            onChange={onProcessChange}
            disabled={updateMutation.isPending}
          >
            <option value="STAGED">STAGED</option>
            <option value="STARTED">STARTED</option>
            <option value="ENDED">ENDED</option>
          </select>
        </div>
      </h1>

      <div className="py-4 px-2 rounded shadow-inner shadow-gray-500/20 bg-white space-y-4">
        <div className="px-2 py-2 bg-zinc-200/50 shadow-inner space-y-2">
          {/* Settings Toggles */}
          <div className="px-2 py-2 bg-white rounded">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 place-content-start overflow-y-scroll">
              {[
                { title: "PUBLIC MONITOR", action: "allowMonitor", desc: "Percentage statistics in realtime" },
                { title: "EC PUBLIC MONITOR", action: "allowEcMonitor", desc: "Percentage statistics in realtime", tag: "ADMIN" },
                { title: "VIP MONITOR", action: "allowVip", desc: "Actual statistics in realtime" },
                { title: "EC VIP MONITOR", action: "allowEcVip", desc: "Actual statistics in realtime", tag: "ADMIN" },
                { title: "FINAL RESULTS", action: "allowResult", desc: "Actual statistics in realtime" },
                { title: "EC FINAL RESULTS", action: "allowEcResult", desc: "Actual statistics in realtime", tag: "ADMIN" },
                { title: "VOTER STATUS", action: "allowMask", desc: "Voting status of eligible electors" },
                { title: "AUTO-STOP PROCESS", action: "autoStop", desc: "Automatically End Election on Close time" },
              ].map((cfg) => (
                <ControlCard
                  key={cfg.action}
                  onChange={onCheckChange}
                  title={cfg.title}
                  action={cfg.action}
                  desc={cfg.desc}
                  tag={cfg.tag}
                  data={election}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-2 py-2 bg-white rounded">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 place-content-start">
              <ControlActionCard
                onClick={handleReset}
                title={resetMutation.isPending ? "RESETTING..." : "RESET ELECTION"}
                tag="ACTION"
                desc="Reset active election & candidates votes"
              />
              <ControlActionCard
                onClick={handleUpdateAdmin}
                title={adminMutation.isPending ? "UPDATING..." : "UPDATE ADMIN USER"}
                tag="ACTION"
                desc="Add or Remove EC or Admin Access"
              />
              <ControlActionCard
                onClick={handleStageVoters}
                title={stageMutation.isPending ? "STAGING..." : "STAGE VOTERS"}
                tag="ACTION"
                desc="Add or Remove EC or Admin Access"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PgAdminControl;
