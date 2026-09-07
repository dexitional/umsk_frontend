import React, { useEffect, useLayoutEffect } from "react";
import {
  TbSquareRoundedNumber1,
  TbSquareRoundedNumber1Filled,
  TbSquareRoundedNumber2,
  TbSquareRoundedNumber2Filled,
  TbSquareRoundedNumber3,
  TbSquareRoundedNumber3Filled,
  TbSquareRoundedNumber4,
  TbSquareRoundedNumber4Filled,
  TbSquareRoundedNumber5,
  TbSquareRoundedNumber5Filled,
  TbSquareRoundedNumber6,
  TbSquareRoundedNumber6Filled,
  TbSquareRoundedNumber7,
  TbSquareRoundedNumber7Filled,
  TbSquareRoundedNumber8,
  TbSquareRoundedNumber8Filled,
  TbSquareRoundedNumber9,
  TbSquareRoundedNumber9Filled,
} from "react-icons/tb";
import { Outlet, useLoaderData, useLocation } from "react-router-dom";
import Service from "../../utils/amsService";
import { useUserStore } from "../../utils/authService";

type Props = {};

export async function loader({ params }) {
  const data = await Service.fetchMyApplicant();
  return { data };
}

function AMSPSwitcher({}: Props) {
  
  const { data }: any = useLoaderData();
  const location: any = useLocation();
  const { pathname }: any = location;
  const tag = pathname?.replaceAll("/amsp/", "")?.replaceAll("apply/", "");
  const dash = pathname.includes('dash');
  const currentMeta = data?.meta?.find((r) => r.tag == tag);
  const metaNo = data?.meta?.length - 2;
  const currentNo = currentMeta?.num || 0;
  const prevUrl = `/amsp/${data?.meta?.find((r) => r.num == Math.max(0, currentNo - 1))?.tag || ""}`;
  const nextUrl = `/amsp/${data?.meta?.find((r) => r.num == Math.min(data?.meta?.length, currentNo + 1))?.tag || "review"}`;
  
  useEffect(() => {
    useUserStore.setState({ stepUrl: { prevUrl, nextUrl } });
  }, [currentNo]);

  return (
    <main className="p-2 md:py-6 max-w-6xl w-full space-y-4">
      {/* Steps */}
      <section className="w-full">
        {tag != "apply" && !dash && (
          <div className="mx-auto px-6 md:px-10 py-2 w-fit flex flex-wrap items-center justify-center md:space-x-10 space-x-4 bg-primary/10 rounded-full">
            {1 <= metaNo && currentNo != 1 && (
              <TbSquareRoundedNumber1 className="h-7 w-7 md:h-10 md:w-10 text-primary/80 bg-white rounded-2xl" />
            )}
            {1 <= metaNo && currentNo == 1 && (
              <TbSquareRoundedNumber1Filled className="h-7 w-7 md:h-10 md:w-10 text-primary/80 bg-white rounded-2xl" />
            )}
            {2 <= metaNo && currentNo != 2 && (
              <TbSquareRoundedNumber2 className="h-7 w-7 md:h-10 md:w-10 text-primary/80 bg-white rounded-2xl" />
            )}
            {2 <= metaNo && currentNo == 2 && (
              <TbSquareRoundedNumber2Filled className="h-7 w-7 md:h-10 md:w-10 text-primary/80 bg-white rounded-2xl" />
            )}
            {3 <= metaNo && currentNo != 3 && (
              <TbSquareRoundedNumber3 className="h-7 w-7 md:h-10 md:w-10 text-primary/80 bg-white rounded-2xl" />
            )}
            {3 <= metaNo && currentNo == 3 && (
              <TbSquareRoundedNumber3Filled className="h-7 w-7 md:h-10 md:w-10 text-primary/80 bg-white rounded-2xl" />
            )}
            {4 <= metaNo && currentNo != 4 && (
              <TbSquareRoundedNumber4 className="h-7 w-7 md:h-10 md:w-10 text-primary/80 bg-white rounded-2xl" />
            )}
            {4 <= metaNo && currentNo == 4 && (
              <TbSquareRoundedNumber4Filled className="h-7 w-7 md:h-10 md:w-10 text-primary/80 bg-white rounded-2xl" />
            )}
            {5 <= metaNo && currentNo != 5 && (
              <TbSquareRoundedNumber5 className="h-7 w-7 md:h-10 md:w-10 text-primary/80 bg-white rounded-2xl" />
            )}
            {5 <= metaNo && currentNo == 5 && (
              <TbSquareRoundedNumber5Filled className="h-7 w-7 md:h-10 md:w-10 text-primary/80 bg-white rounded-2xl" />
            )}
            {6 <= metaNo && currentNo != 6 && (
              <TbSquareRoundedNumber6 className="h-7 w-7 md:h-10 md:w-10 text-primary/80 bg-white rounded-2xl" />
            )}
            {6 <= metaNo && currentNo == 6 && (
              <TbSquareRoundedNumber6Filled className="h-7 w-7 md:h-10 md:w-10 text-primary/80 bg-white rounded-2xl" />
            )}
            {7 <= metaNo && currentNo != 7 && (
              <TbSquareRoundedNumber7 className="h-7 w-7 md:h-10 md:w-10 text-primary/80 bg-white rounded-2xl" />
            )}
            {7 <= metaNo && currentNo == 7 && (
              <TbSquareRoundedNumber7Filled className="h-7 w-7 md:h-10 md:w-10 text-primary/80 bg-white rounded-2xl" />
            )}
            {8 <= metaNo && currentNo != 8 && (
              <TbSquareRoundedNumber8 className="h-7 w-7 md:h-10 md:w-10 text-primary/80 bg-white rounded-2xl" />
            )}
            {8 <= metaNo && currentNo == 8 && (
              <TbSquareRoundedNumber8Filled className="h-7 w-7 md:h-10 md:w-10 text-primary/80 bg-white rounded-2xl" />
            )}
            {9 <= metaNo && currentNo != 9 && (
              <TbSquareRoundedNumber9 className="h-7 w-7 md:h-10 md:w-10 text-primary/80 bg-white rounded-2xl" />
            )}
            {9 <= metaNo && currentNo == 9 && (
              <TbSquareRoundedNumber9Filled className="h-7 w-7 md:h-10 md:w-10 text-primary/80 bg-white rounded-2xl" />
            )}
          </div>
        )}
        {tag == "apply" && (
          <div className="mx-auto px-6 md:px-10 py-2 w-fit flex flex-wrap items-center justify-center md:space-x-10 space-x-4 bg-primary/10 rounded-full">
            <span className="font-bold text-primary-dark/60">
              CONFIGURE APPLICATION MODE FOR ADMISSION
            </span>
          </div>
        )}
        { tag != "apply" && !dash && (
          <div className="px-2 py-1 mx-auto w-3/5 md:w-96 border-t-2 border-white rounded-b-xl font-bold text-xs text-center text-primary-dark bg-primary/30 tracking-widest">
            { currentMeta?.tag.toUpperCase() }
          </div>
        )}
      </section>
      <section className="w-full">
        <Outlet />
      </section>
    </main>
  );
}

export default AMSPSwitcher;
