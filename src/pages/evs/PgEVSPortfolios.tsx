import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BsActivity } from "react-icons/bs";
import { ImPlus } from "react-icons/im";
import EVSPortfolioCard from "../../components/evs/EVSPortfolioCard";
import Service from "../../utils/evsService";
import { useIsElectionAdmin } from "../../utils/useIsElectionAdmin";

function PgEVSPortfolios() {
  const { electionId } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const canManage = useIsElectionAdmin(electionId);

  // 1. Fetch Portfolios
  const { data, isLoading } = useQuery({
    queryKey: ["portfolios", electionId],
    queryFn: () => Service.fetchPortfolios(electionId!),
    enabled: !!electionId,
  });


  if (isLoading) return <div className="p-10 text-center font-bold">Loading...</div>;

  const isGeneral = data && data[0]?.election?.type === "GENERAL";

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center space-y-8 md:space-y-8 ">
      <div className="flex w-full flex-1 flex-col space-y-8 md:space-y-10 ">
        {/* Always visible, regardless of whether any portfolios exist yet —
            this was previously only reachable via a button buried inside
            EVSPortfolioCard, which never rendered when the list was empty. */}
        {canManage && (
          <div className="flex items-center justify-between">
            <h1 className="text-sm md:text-lg font-semibold text-primary-dark/70 uppercase tracking-wide">
              Portfolios / Positions
            </h1>
            <Link
              to="create"
              className="py-2 px-3 md:px-4 rounded-md bg-primary/90 text-white text-xs md:text-sm font-medium flex items-center space-x-2"
            >
              <ImPlus className="h-3 w-3" />
              <span>Add Portfolio / Position</span>
            </Link>
          </div>
        )}
        {data && data.length > 0 ? (
          <EVSPortfolioCard
            title={isGeneral ? "PORTFOLIOS" : "ISSUES"}
            data={data}
          />
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

export default PgEVSPortfolios;
