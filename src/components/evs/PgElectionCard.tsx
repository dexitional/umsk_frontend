import moment from "moment";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/img/logo.png";
import { useUserStore } from "../../utils/authService";
const { REACT_APP_API_URL } = import.meta.env;

type Props = {
  data: any;
};

function PgElectionCard({ data }: Props) {
  const navigate = useNavigate();
  const { user } = useUserStore.getState();
  const isVoter = !!data.voterData.find(
    (r: any) => r?.tag?.toLowerCase() == user?.user?.tag?.toLowerCase()
  );

  return (
    <div className="space-y-2">
      <div className="px-4 py-2 md:py-1 md:px-3 w-full md:w-64 rounded bg-[#f1f1f1]/30 shadow-inner shadow-gray-500/30 space-y-6">
        <div className="text-center text-base md:text-lg text-primary font-bold font-mono">
          {data?.title}
        </div>
      </div>
      <div className="p-4 md:py-6 md:px-3 w-full md:w-64 h-fit rounded bg-[#f1f1f1]/30 shadow-inner shadow-gray-500/30 space-y-6">
        <img
          src={`${REACT_APP_API_URL}/auth/pixo?eid=${data?.id}` || Logo}
          alt=""
          className="mx-auto w-28 h-28 object-contain"
        />
        <div className="py-2 px-2 rounded shadow-inner shadow-gray-500/20 bg-white gap-y-2 grid grid-cols-2 place-content-center overflow-hidden">
          <h3 className="py-1 bg-primary/80 font-bold text-sm text-white text-center flex items-center justify-center">
            VOTERS
          </h3>
          <h3 className="py-1 text-lg md:text-lg text-center border border-primary/80 text-primary font-bold">
            {data?.voterData?.length}
          </h3>
          <h3 className="py-1 bg-primary/80 font-bold text-sm text-white text-center flex items-center justify-center">
            TURNOUT
          </h3>
          <h3 className="py-1 text-lg md:text-lg text-center border border-primary/80 text-primary font-bold">
            {data?.turnout}
          </h3>
          <h3 className="py-1 bg-primary/80 font-bold text-sm text-white text-center flex items-center justify-center">
            STATUS
          </h3>
          <h3 className="py-1 text-sm md:text-sm text-center border border-primary/80 text-primary font-bold">
            {data?.action}
          </h3>
          <div className="p-2 col-span-2 rounded font-roboto border border-primary/80 space-y-2">
            <div className="w-full flex items-center justify-between">
              <span className="py-0.5 px-1.5 rounded bg-primary/80 text-white text-xs tracking-widest font-bold inline-block uppercase">
                Start
              </span>{" "}
              <span className="font-extrabold text-primary tracking-wide text-sm inline-block align-right uppercase">
                {data.startAt &&
                  moment(data.startAt).format("MMM DD, YYYY HH:mm")}
              </span>
            </div>
            <div className="w-full flex items-center justify-between">
              <span className="py-0.5 px-1.5 rounded bg-primary/80 text-white text-xs tracking-widest font-bold inline-block uppercase">
                End
              </span>{" "}
              <span className="font-extrabold text-primary tracking-wide text-sm inline-block align-right uppercase">
                {data.endAt && moment(data.endAt).format("MMM DD, YYYY HH:mm")}
              </span>
            </div>
          </div>
        </div>
        <div className="p-3 rounded shadow-inner shadow-gray-500/20 bg-white space-y-2">
          {["STARTED"].includes(data?.action) && !data.voteStatus && isVoter ? (
            <Link
              to={`/evs/${data?.id}/voting`}
              className={`block hover:bg-primary/90 bg-red-900 ring-2 ring-primary/80 border-2 border-white text-white py-1 px-3.5 w-full rounded-lg focus:ring-0 focus:outline-none font-bold text-base text-center font-noto`}
            >
              CLICK TO VOTE
            </Link>
          ) : null}
          {data.voteStatus ? (
            <span
              className={`block hover:bg-green-600/90 bg-green-600 ring-2 ring-green-600/80 border-2 border-white text-white py-1 px-3.5 w-full rounded-lg focus:ring-0 focus:outline-none font-bold text-base text-center font-noto`}
            >
              VOTED
            </span>
          ) : null}
          <Link
            to={`/evs/${data?.id}/register`}
            className={`block bg-primary/80 text-white py-1.5 px-3.5 w-full rounded focus:ring-0 focus:outline-none font-bold text-sm text-center font-noto`}
          >
            ELECTION CENTRE
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PgElectionCard;
