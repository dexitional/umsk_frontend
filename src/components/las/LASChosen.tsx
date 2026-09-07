import React from "react";
import { Form } from "react-router-dom";
import { useUserStore } from "../../utils/authService";

type Props = {
  data: any;
};

function LASChosen({ data }: Props) {
  const user = useUserStore((state) => state.user);

  return (
    <div className="relative px-3 py-6 border shadow  border-[#01A4A6] rounded-xl flex flex-col items-center justify-center space-y-6 text-center group">
      <div className="relative w-52 h-52 bg-[#d4dbe0] rounded-xl overflow-hidden">
        <img
          className="w-52 h-52 object-cover object-top"
          src={`https://cdn.ucc.edu.gh/photos/?tag=${data?.staff_no}`}
        />
      </div>
      {/* <div className="w-fit absolute -top-4 right-2">
            <FaCheckCircle className="h-7 w-7 text-green-700/60" />
        </div> */}
      <div className="space-y-1">
        <h1 className="text-zinc-500 leading-5 text-base capitalize">
          {data?.name?.toLowerCase()}
        </h1>
        <p className="leading-5 text-sm text-blue-950/60 font-medium capitalize">
          {data?.department?.toLowerCase()}
        </p>
      </div>
      {data ? (
        data.voted ? (
          <div className="px-4 py-1 bg-[#01A4A6] text-white border shadow-lg rounded-md font-semibold tracking-wider">
            Voted
          </div>
        ) : (
          <Form method="post">
            <input type="hidden" name="vote" value={data?.staff_no} />
            <input type="hidden" name="regno" value={user?.user?.tag} />
            <button className="px-4 py-1 bg-blue-950/60 text-white border shadow-lg rounded-md font-semibold tracking-wider">
              Submit Vote
            </button>
          </Form>
        )
      ) : (
        <div className="px-4 py-1 bg-[#01A4A6] text-white border shadow-lg rounded-md font-semibold tracking-wider">
          No Selection
        </div>
      )}
    </div>
  );
}

export default LASChosen;
