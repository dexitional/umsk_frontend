import React from "react";
import { BiEdit, BiTrash } from "react-icons/bi";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Service from "../../utils/evsService";
import { useIsElectionAdmin } from "../../utils/useIsElectionAdmin";

const { REACT_APP_API_URL } = import.meta.env;

type Props = {
  data?: any;
  title?: string;
  type?: string;
};

function EVSCandidateCard({ title, type, data }: Props) {
  const { electionId } = useParams();
  const queryClient = useQueryClient();
  const canManage = useIsElectionAdmin(electionId);
  // 1. Setup the Mutation
  const deleteMutation = useMutation({
    mutationFn: (candidateId: string) => Service.deleteCandidate(candidateId),
    onSuccess: () => {
      // Invalidate the specific query key used in PgEVSCandidates
      queryClient.invalidateQueries({ queryKey: ["election-candidates", electionId] });
    },
    onError: (error) => {
      console.error("Delete failed:", error);
      alert("Could not delete candidate. Please try again.");
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Do you want to delete this candidate?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="w-full space-y-3 rounded">
      <h1 className="text-sm font-bold font-roboto tracking-wider text-primary-dark/60 flex flex-col md:flex-row space-y-2 md:space-y-0 justify-between">
        <span className="px-3 py-0.5 rounded border border-primary/50">
          {title}
        </span>
        <div className="flex items-center justify-between space-x-3">
          <span className="px-3 py-0.5 w-fit rounded bg-primary/70 text-xs text-white font-bold flex items-center">
            {Math.max(0, data?.length - 1)}{" "}
            {type === "GENERAL" ? "CANDIDATES" : "OPTIONS"}
          </span>
        </div>
      </h1>

      <div className="w-full rounded-lg shadow-md text-xs overflow-x-scroll md:overflow-hidden bg-white">
        <div className={`px-3 py-2 bg-primary/10 text-primary-dark/70 font-bold grid ${type === "GENERAL" ? "grid-cols-8" : "grid-cols-7"} tracking-wider`}>
          <span className="hidden md:grid justify-self-center">ORDER #</span>
          <span className="hidden md:grid col-span-3">{type === "GENERAL" ? "NAME" : "OPTIONS"}</span>
          {type === "GENERAL" && <span className="hidden md:grid justify-self-center">TEASER</span>}
          <span className="hidden md:grid justify-self-center">VOTES</span>
          <span className="hidden md:grid justify-self-center">STATUS</span>
          <span className="hidden md:grid justify-self-center">ACTION</span>
        </div>

        {data
          ?.sort((a: any, b: any) => a.orderNo - b.orderNo)
          ?.filter((r: any) => r.orderNo > 0)
          ?.map((row: any) => {
            const isDeleting = deleteMutation.isPending && deleteMutation.variables === row.id;

            return (
              <div
                key={row.id}
                className={`px-3 py-2 border-b grid ${type === "GENERAL" ? "grid-cols-8" : "grid-cols-7"} font-medium text-xs text-primary/80 ${isDeleting ? 'opacity-40 pointer-events-none' : ''}`}
              >
                <span className="font-bold flex items-center space-x-2">
                  <Link
                    target="_blank"
                    to={`${REACT_APP_API_URL}/auth/pixo/?eid=${row?.portfolio?.electionId}&tag=${row?.id}`}
                  >
                    <img
                      crossOrigin="anonymous"
                      src={`${REACT_APP_API_URL}/auth/pixo/?eid=${row?.portfolio?.electionId}&tag=${row?.id}`}
                      className="h-8 w-8 border rounded-md bg-white object-contain"
                    />
                  </Link>
                  <span># {row?.orderNo}</span>
                </span>
                <span className="col-span-3 font-medium self-center">
                  {row?.name?.toUpperCase()}
                </span>
                {type === "GENERAL" && (
                  <span className="justify-self-center">
                    <span className="md:hidden text-primary-dark text-[0.65rem]">TEASER:&nbsp;</span>
                    {row.teaser}
                  </span>
                )}
                <span className="justify-self-center">
                  <span className="md:hidden text-primary-dark text-[0.65rem]">VOTES:&nbsp;</span>
                  {row.votes}
                </span>
                <span className="justify-self-center">
                  <span className="md:hidden text-primary-dark text-[0.65rem]">STATUS:&nbsp;</span>
                  {row.status ? "ENABLED" : "DISABLED"}
                </span>
                <span className="flex md:flex-row flex-col items-center md:justify-center space-y-3 md:space-y-0 md:space-x-2">
                  {canManage && row?.orderNo > 0 && (
                    <Link
                      to={`${row?.id}/edit?cache`}
                      className="px-2 py-0.5 w-fit rounded border border-primary flex items-center hover:bg-primary/5"
                    >
                      <BiEdit className="h-4 w-4" />
                    </Link>
                  )}
                  {canManage && row?.orderNo && row?.votes <= 0 ? (
                    <button
                      onClick={() => handleDelete(row.id)}
                      disabled={isDeleting}
                      className="px-2 py-0.5 w-fit rounded border border-red-400 text-red-500 flex items-center hover:bg-red-50 disabled:opacity-50"
                    >
                      <BiTrash className="h-4 w-4" />
                    </button>
                  ) : null}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default EVSCandidateCard;
