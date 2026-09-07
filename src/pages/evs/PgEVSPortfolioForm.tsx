import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Service from "../../utils/evsService";

function PgEVSPortfolioForm() {
  const { electionId, portfolioId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = portfolioId && portfolioId !== "0";

  // 1. Fetch Existing Portfolio Data (if editing)
  const { data: portfolio, isLoading } = useQuery({
    queryKey: ["portfolio", portfolioId],
    queryFn: () => Service.fetchPortfolio(portfolioId!),
    enabled: !!isEdit,
    staleTime: 0, 
    gcTime: 0,   
  });

  // 2. Mutation for Create/Update
  const mutation = useMutation({
    mutationFn: async (formData: any) => {
      if (isEdit) {
        return Service.updatePortfolio(portfolioId, formData);
      } else {
        return Service.postPortfolio(formData);
      }
    },
    onSuccess: () => {
      // Invalidate the list so it refetches the new/updated data
      queryClient.invalidateQueries({ queryKey: ["portfolios", electionId] });
      // Navigate back to the list
      navigate(`../../portfolios`);
    },
    onError: (error) => {
      console.error("Save failed:", error);
      alert("Failed to save portfolio. Please try again.");
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload:any = Object.fromEntries(formData);
    
    // Process data to match your API expectations
    payload.electionId = Number(electionId);
    payload.status = payload.status === "1"; 

    mutation.mutate(payload);
  };

  if (isEdit && isLoading) return <div className="p-10 text-center font-bold">Loading Data...</div>;

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center space-y-8 md:space-y-8 ">
      <div className="flex w-full flex-1 flex-col space-y-8 md:space-y-10 ">
        <div className="p-2 md:px-6 md:py-2 border bg-slate-50/50 rounded-xl space-y-3">
          <section className="flex md:space-x-6">
            <h1 className="text-sm md:text-lg tracking-wide font-semibold text-primary/70">
              {isEdit ? "Update" : "Create"} Portfolio
            </h1>
          </section>

          <form onSubmit={handleSubmit} className="">
            <div className="p-3 border rounded-lg md:rounded-xl bg-white space-y-3 md:space-x-6">
              <div className="p-3 grid md:grid-cols-3 gap-x-2 gap-y-3 md:gap-y-0 md:gap-x-4">
                <label className="flex flex-col space-y-2">
                  <span className="text-sm md:text-base text-gray-500 font-medium">
                    Portfolio title
                  </span>
                  <input
                    name="title"
                    defaultValue={portfolio?.title}
                    required
                    disabled={mutation.isPending}
                    className="focus:ring-0 border focus:border-slate-300 border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md uppercase disabled:opacity-50"
                  />
                </label>

                <label className="flex flex-col space-y-2">
                  <span className="text-sm md:text-base text-gray-500 font-medium">
                    Portfolio Status
                  </span>
                  <select
                    name="status"
                    defaultValue={portfolio ? (portfolio.status ? "1" : "0") : ""}
                    required
                    disabled={mutation.isPending}
                    className="focus:ring-0 border focus:border-slate-300 border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md disabled:opacity-50"
                  >
                    <option value="" disabled>-- Choose --</option>
                    <option value="0">DISABLED</option>
                    <option value="1">ENABLED</option>
                  </select>
                </label>

                <div className="w-full flex md:flex-row items-end flex-col justify-end md:space-x-2 space-x-0 space-y-2">
                  <button
                    className="py-2 px-4 md:w-40 w-full rounded-md bg-primary/70 text-white font-semibold disabled:bg-gray-400"
                    type="submit"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "SAVING..." : "SAVE"}
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Cancel changes?")) navigate(-1);
                    }}
                    className="py-2 px-4 md:w-20 w-full rounded-md bg-slate-50 border text-sm text-gray-600"
                    type="button"
                    disabled={mutation.isPending}
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PgEVSPortfolioForm;
