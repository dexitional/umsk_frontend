import moment from "moment";
import React from "react";
import toast from "react-hot-toast";
import { exportToExcel } from "react-json-to-excel";
import { redirect, useLoaderData } from "react-router-dom";
import LASResultCard from "../../components/las/LASResultCard";
import LASWinner from "../../components/las/LASWinner";
import RankedCandidate from "../../components/las/RankedCandidate";
import { useUserStore } from "../../utils/authService";
import Service from "../../utils/evsService";
const user = useUserStore.getState().user;

type Props = {};

export async function action({ request, params }) {
  const loadStudentVote = useUserStore((state) => state.loadStudentVote);
  const formData = await request.formData();
  let data = Object.fromEntries(formData);
  data.vote = Number(data.vote);
  data.regno = user?.user?.tag;
  let resp = await Service.postVote(data);
  if (resp) {
    loadStudentVote();
    return redirect(`/las/dash`);
  }
  return false;
}

export async function loader({ params, request }) {
  const voters = await Service.fetchVoters();
  const candidates = await Service.fetchVotes();
  return { voters, candidates };
}

function PgLASResult({}: Props) {
  const { voters, candidates }: any = useLoaderData();
  //  useEffect(() => {
  //     if(data.length) useUserStore.setState({ lasChosen: data[0] })
  //  },[])

  const winner = candidates && candidates[0];
  const second = candidates && candidates[1];
  const third = candidates && candidates[2];

  const exportData = async (report: string) => {
    if (report == "candidates") {
      if (candidates) {
        exportToExcel(
          candidates,
          "candidates_" + moment().format("DDMMYYHHmmSS")
        );
      } else {
        toast.error("No data to export !!");
      }
    }

    if (report == "voters") {
      if (voters) {
        exportToExcel(voters, "voters_" + moment().format("DDMMYYHHmmSS"));
      } else {
        toast.error("No data to export !!");
      }
    }
  };

  return (
    <main className="p-4 md:p-8 grid grid-cols-1 gap-y-3 md:gap-y-10">
      <section className="grid md:grid-cols-3 gap-4"></section>

      <section className="grid md:grid-cols-3 gap-4">
        <section className="md:col-span-2">
          <div className="py-4 px-2 md:px-6 md:py-4 bg-blue-50/40 rounded-2xl">
            <h1 className="text-sm md:text-2xl tracking-widest text-center font-noto font-semibold text-blue-950/60">
              BEST LECTURER AWARD STATISTICS
            </h1>
          </div>
        </section>
        <section className="hidden md:flex flex-col items-center col-span-1 ">
          <div className="p-6 min-h-fit w-full border rounded-3xl"></div>
        </section>
      </section>

      {/* Election Section */}
      <section className="md:p-4 grid md:grid-cols-3 gap-4 rounded-2xl bg-blue-50/40">
        <div className="py-2 md:col-span-2 rounded-xl bg-white/80">
          {/* <h1 className="px-3 py-1 w-fit -skew-x-12  rounded bg-blue-950/50 text-white font-bold tracking-wider">Search & Filter Candidates</h1> */}
          <div className="p-1 md:py-2 md:px-3 grid gap-y-3 overflow-y-scroll [&_dl]:border-b [&_dl]:border-dashed [&_dl]:border-spacing-60 [&_dl]:border-blue-200/60 [&_dl]:pb-4 last:[&_dl]:border-0 last:[&_dl]:pb-0">
            <LASResultCard exportData={exportData} />
          </div>
          <div className="px-3 py-4 grid gap-1">
            <h1 className="px-3 py-1 w-fit -skew-x-12  rounded bg-green-950/50 text-white font-bold tracking-wider">
              Top 3 Ranked By Voting
            </h1>
            <div className="px-2 md:px-3 py-2 grid md:grid-cols-3 gap-3">
              {winner && (
                <RankedCandidate
                  count={1}
                  data={winner}
                  total={voters.length}
                />
              )}
              {second && (
                <RankedCandidate
                  count={2}
                  data={second}
                  total={voters.length}
                />
              )}
              {third && (
                <RankedCandidate count={3} data={third} total={voters.length} />
              )}
            </div>
            <div className=""></div>
          </div>
        </div>

        <div className="p-0 md:p-4 rounded-xl bg-white/80">
          <h1 className="px-2 md:px-3 py-1 w-fit -skew-x-12  rounded bg-green-950/50 text-white font-bold tracking-wider">
            Best Lecturer Award Winner
          </h1>
          <div className="p-2 md:py-4  min-h-fit grid gap-y-6 overflow-y-scroll [&_dl]:border-b [&_dl]:border-dashed [&_dl]:border-spacing-60 [&_dl]:border-pink-200/60 [&_dl]:pb-4 last:[&_dl]:border-0 last:[&_dl]:pb-0">
            <LASWinner data={winner} total={voters.length} />
          </div>
        </div>
      </section>
    </main>
  );
}

export default PgLASResult;
