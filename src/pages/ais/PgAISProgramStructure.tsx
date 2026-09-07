import React from "react";
import { BsActivity } from "react-icons/bs";
import { useLoaderData } from "react-router-dom";
import AISStructureCard from "../../components/ais/AISStructureCard";
import Service from "../../utils/aisService";

type Props = {};

export async function loader({ params }) {
  const data = await Service.fetchProgramStructure(params.programId);
  return { data };
}

function PgAISProgramStructure({}: Props) {
  const { data }: any = useLoaderData();
  const meta = data?.meta;
  console.log(data);

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center space-y-8 md:space-y-8 ">
      <div className="flex w-full flex-1 flex-col space-y-8 md:space-y-10 ">
        {/* <div>{JSON.stringify(data?.meta)}</div> */}
        {data &&
          data?.data &&
          Array.from(data?.data).map(([title, row]: any, i: number) => (
            <div key={title} className="px-2 py-2 space-y-3">
              <AISStructureCard title={title.toUpperCase()} data={row} />

              {meta[title] && (
                <div className="p-2 border rounded-lg bg-primary/5 flex items-center space-x-3">
                  {meta[title]?.map((d: any) => (
                    <div className="px-4 py-3 relative border rounded-lg bg-white md:w-fit flex flex-col space-y-1 font-roboto font-medium text-[0.8rem] md:text-sm text-gray-500/90">
                      {d.major?.longName && (
                        <span>
                          <span className="px-2 py-0.5 bg-primary/20 text-primary-dark/80 rounded-sm">
                            {d.major?.longName}
                          </span>
                        </span>
                      )}
                      <span className="flex items-center space-x-2.5">
                        <span>Mininum Registration Credit</span>
                        <span className="px-1.5 py-0.5 bg-primary/60 text-white rounded-full">
                          {d.minCredit}
                        </span>
                      </span>
                      <span className="flex items-center space-x-2">
                        <span>Maximun Registration Credit</span>{" "}
                        <span className="px-1.5 py-0.5 bg-primary/60 text-white rounded-full">
                          {d.maxCredit}
                        </span>
                      </span>
                      {d.maxElectiveNum && (
                        <span>
                          Maximum Number of Electives for Registration:{" "}
                          {d.maxElectiveNum || "None"}
                        </span>
                      )}
                      <span></span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        {!data?.data?.length ? (
          <div className="p-10 border border-primary/10 rounded-xl flex flex-col items-center justify-center space-y-3">
            <BsActivity className="h-20 w-20 text-primary/30 border rounded-md" />
            <span className="text-primary/40 font-medium">
              No Academic Statement ...
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default PgAISProgramStructure;
