import moment from "moment";
import React from "react";
import { useLoaderData } from "react-router-dom";
import Service from "../../utils/amsService";
import { useUserStore } from "../../utils/authService";

type Props = {};

// Loader for Single Project
export async function loader({ params }) {
  const { user } = useUserStore.getState() ?? null;
  const serial = user?.user?.tag;
  const data = await Service.fetchVoucher(serial);
  return { data };
}

function PgStepNotice({}: Props) {
  const { data }: any = useLoaderData();
  console.log(data);
  return (
    <main className="p-2">
      <div className="p-3 border bg-slate-50/50 rounded-xl space-y-4">
        <section>
          <div className="p-2 w-fit md:w-full md:py-4 md:px-6 flex flex-col space-y-3 md:space-y-6 border rounded-md md:rounded-xl bg-white overflow-x-scroll">
            <ul>
              <li>Admission Notice</li>
              <li>
                Applications are currently{" "}
                <b>
                  {data.admission.applyPaused
                    ? "halted temporarily"
                    : moment(data.admission.applyEnd).isAfter(moment())
                    ? "closed"
                    : "opened and on-going"}
                  .
                </b>
              </li>
              <li>
                Please complete your application before midnight of{" "}
                <b>{moment(data.admission.applyEnd).format("LL")}.</b>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}

export default PgStepNotice;
