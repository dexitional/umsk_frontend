import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Service from "../../utils/evsService";

const { REACT_APP_API_URL } = import.meta.env;

function PgEVSCandidateForm() {
  const { electionId, candidateId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = candidateId && candidateId !== "0";

  // 1. Fetch Loader Data (Candidate + Portfolios)
  const { data: initialData, isLoading } = useQuery({
    queryKey: ["candidate-form-data", candidateId || "new"],
    queryFn: async () => {
      const portfolios = await Service.fetchPortfolioList(electionId!);
      let candidate = { id: 0 };
      if (isEdit) {
        candidate = await Service.fetchCandidate(candidateId);
      }
      return { candidate, portfolios };
    },
    staleTime: 0, 
    gcTime: 0,   
  });

  const candidate:any = initialData?.candidate;
  const portfolios:any = initialData?.portfolios;

  // 2. Photo Preview State
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    if (candidate?.id) {
      setPhotoPreview(`${REACT_APP_API_URL}/auth/pixo/?eid=${candidate?.portfolio?.electionId}&tag=${candidate?.id}`);
    }
  }, [candidate]);

  // 3. Submit Mutation
  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      if (isEdit) {
        return Service.updateCandidate(candidateId, formData);
      } else {
        return Service.postCandidate(formData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["election-candidates", electionId] });
      navigate(`../../candidates`);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to save candidate");
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const photo = formData.get("photo") as File;
    if (photo?.size && !photo?.type?.match("image.*")) {
      toast.error("Please upload an image file only!");
      return;
    }

    // Prepare data (logic from your original action)
    formData.set("portfolioId", String(Number(formData.get("portfolioId"))));
    formData.set("orderNo", String(Number(formData.get("orderNo"))));
    formData.set("status", String(Number(1)));
    // formData.set("status", String(Number(formData.get("status"))));
    // Check if photo should be deleted from payload if empty
    if (!photo?.size) {
      formData.delete("photo");
    }

    mutation.mutate(formData);
  };

  if (isLoading) return <div className="p-10 text-center">Loading form...</div>;

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center space-y-8 md:space-y-8 ">
      <div className="flex w-full flex-1 flex-col space-y-8 md:space-y-10 ">
        <div className="p-2 md:px-6 md:py-2 border bg-slate-50/50 rounded-xl space-y-3">
          <section className="flex md:space-x-6">
            <h1 className="text-sm md:text-lg tracking-wide font-semibold text-primary/70">
              {isEdit ? "Update" : "Create"} Candidate
            </h1>
          </section>

          <form onSubmit={handleSubmit} className="">
            <div className="p-3 border rounded-lg md:rounded-xl bg-white space-y-3 md:space-x-6">
              <div className="p-3 grid md:grid-cols-2 gap-x-2 gap-y-3 md:gap-y-0 md:gap-x-4">
                
                {/* Photo Upload Section */}
                <div className="m-3 p-3 grid grid-cols-3 rounded border">
                  <img src={photoPreview || "/placeholder-user.png"} alt="" className="h-10 w-10 object-contain rounded" />
                  <label className="col-span-2 flex self-center w-28">
                    <input
                      type="file"
                      name="photo"
                      onChange={(e: any) => {
                        if (e.target.files[0]) {
                           setPhotoPreview(URL.createObjectURL(e.target.files[0]));
                        }
                      }}
                      className="file:px-3 file:bg-primary file:rounded file:text-white text-[10px]"
                    />
                  </label>
                </div>

                <label className="flex flex-col space-y-2">
                  <span className="text-sm md:text-base text-gray-500 font-medium">Candidate Name</span>
                  <input
                    name="name"
                    defaultValue={candidate?.name}
                    required
                    className="focus:ring-0 border focus:border-slate-300 border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md uppercase"
                  />
                </label>

                <label className="flex flex-col space-y-2">
                  <span className="text-sm md:text-base text-gray-500 font-medium">Teaser / Slogan</span>
                  <input
                    name="teaser"
                    defaultValue={candidate?.teaser}
                    className="focus:ring-0 border focus:border-slate-300 border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md uppercase"
                  />
                </label>

                <label className="flex flex-col space-y-2">
                  <span className="text-sm md:text-base text-gray-500 font-medium">Ballot Number</span>
                  <input
                    type="number"
                    name="orderNo"
                    defaultValue={candidate?.orderNo}
                    className="focus:ring-0 border focus:border-slate-300 border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md uppercase"
                  />
                </label>

                <label className="flex flex-col space-y-2">
                  <span className="text-sm md:text-base text-gray-500 font-medium">Portfolio</span>
                  <select
                    name="portfolioId"
                    defaultValue={candidate?.portfolioId}
                    required
                    className="focus:ring-0 border focus:border-slate-300 border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md"
                  >
                    <option value="" disabled>-- Choose --</option>
                    {portfolios?.map((row: any) => (
                      <option key={row.id} value={row.id}>
                        {row.title?.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </label>
                {/* <label className="flex flex-col space-y-2">
                    <span className="text-sm md:text-base text-gray-500 font-medium">Status</span>
                    <select arial-label="status" name="status" defaultValue={Number(candidate?.status)} required className="focus:ring-0 border focus:border-slate-300  border-primary-dark/10 bg-primary-dark/5 text-sm md:text-base text-gray-500 rounded-md">
                      <option selected disabled>-- Choose --</option>
                      <option value="0">DISABLED</option>
                      <option value="1">ENABLED</option>
                    </select>
                </label> */}

                <div className="w-full flex md:flex-row items-end flex-col justify-end md:space-x-2 space-x-0 space-y-2">
                  <button
                    disabled={mutation.isPending}
                    className="py-2 px-4 w-full rounded-md bg-primary/70 text-white font-semibold disabled:bg-gray-400"
                    type="submit"
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

export default PgEVSCandidateForm;
