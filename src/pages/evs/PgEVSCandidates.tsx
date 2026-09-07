import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { BsActivity } from "react-icons/bs";
import { ImPlus } from "react-icons/im";
import { Link, useParams } from "react-router-dom";
import EVSCandidateCard from "../../components/evs/EVSCandidateCard";
import Service from "../../utils/evsService";
import { useIsElectionAdmin } from "../../utils/useIsElectionAdmin";

function PgEVSCandidates() {
  const { electionId } = useParams();
  const queryClient = useQueryClient();
  const canManage = useIsElectionAdmin(electionId);

  // 1. Fetch Candidates/Votes with Caching
  const { data, isLoading } = useQuery({
    queryKey: ["election-candidates", electionId],
    queryFn: () => Service.fetchVotes(electionId!),
    enabled: !!electionId
  });



  if (isLoading) return <div className="p-10 text-center font-bold">Loading Candidates...</div>;

  const portfolios = data?.portfolios || [];

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center space-y-8 md:space-y-8 ">
      <div className="flex w-full flex-1 flex-col space-y-8 md:space-y-10 ">
        {/* Always visible, regardless of whether any candidates exist yet —
            previously only reachable via a button buried inside
            EVSCandidateCard, which never rendered when the list was empty. */}
        {canManage && (
          <div className="flex items-center justify-between">
            <h1 className="text-sm md:text-lg font-semibold text-primary-dark/70 uppercase tracking-wide">
              Candidates / Options
            </h1>
            <Link
              to="create"
              className="py-2 px-3 md:px-4 rounded-md bg-primary/90 text-white text-xs md:text-sm font-medium flex items-center space-x-2"
            >
              <ImPlus className="h-3 w-3" />
              <span>Add Candidate / Option</span>
            </Link>
          </div>
        )}
        {/*
           If EVSCandidateCard has a delete button, pass the mutation.mutate function
           down to it so it can trigger the deletion.
        */}
        {portfolios?.length > 0 ? (
          portfolios?.map((row: any) => (
            <EVSCandidateCard
              key={row?.id || row?.title}
              title={row?.title?.toUpperCase()}
              data={row?.candidates}
            />
          ))
        ) : (
          <div className="p-10 border border-primary/10 rounded-xl flex flex-col items-center justify-center space-y-3">
            <BsActivity className="h-20 w-20 text-primary/30 border rounded-md" />
            <span className="text-primary/40 font-medium">No Records ...</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default PgEVSCandidates;
