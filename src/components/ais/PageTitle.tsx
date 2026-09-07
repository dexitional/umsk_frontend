import React, { useLayoutEffect } from "react";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { ImPlus } from "react-icons/im";
import { PiListNumbersBold } from "react-icons/pi";
import { Link, useSearchParams } from "react-router-dom";
import { useUserStore } from "../../utils/authService";

type Props = {
  title: string;
  createtext?: string;
  createlink?: string;
  setView: (arg: string) => void;
  view: string;
  pages?: any;
};

function PageTitle({
  title,
  createtext,
  createlink,
  setView,
  view,
  pages,
}: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  pages = isNaN(Math.max(1, pages)) ? 1 : Math.max(1, pages);

  const onSearchChange = async (e) => {
    const { name, value } = e?.target;
    if (name == "search" && value == "") {
      searchParams.delete("search");
      searchParams.delete("page");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ [name]: value });
    }
  };

  const prev = () => {
    setSearchParams((searchParam) => {
      searchParam.set("page", Math.max(1, +page - 1).toString());
      return searchParam;
    });
  };

  const next = () => {
    setSearchParams((searchParam) => {
      searchParam.set("page", (+page + 1).toString());
      return searchParam;
    });
  };

  const goto = () => {
    const inps = window.prompt("Goto Page:");
    if (inps) {
      const pg = +inps;
      setSearchParams((searchParam) => {
        searchParam.set(
          "page",
          (pg > 0 && pg < (pages || 0) + 1 ? pg : 1).toString()
        );
        return searchParam;
      });
    }
  };

  const setLimit = () => {
    const lm = useUserStore.getState().limit;
    const inps = window.prompt(
      `Limit To: [${lm[title?.replaceAll(" ", "")?.trim()?.toLowerCase()]}]`
    );
    if (inps) {
      let pg = +inps;
      pg = pg > 0 && pg < 100 ? pg : 9;

      setSearchParams((searchParam) => {
        useUserStore.setState({
          limit: {
            ...lm,
            [title?.replaceAll(" ", "")?.trim()?.toLowerCase()]: pg,
          },
        });
        searchParam.set("limit", pg.toString());
        return searchParam;
      });
      window.location.reload();
    }
  };

  const loadLimit = () => {
    const lm = useUserStore.getState().limit;
    const isExist = lm[title?.replaceAll(" ", "")?.trim()?.toLowerCase()];
    if (!isExist || isExist == undefined)
      useUserStore.setState({
        limit: {
          ...lm,
          [title?.replaceAll(" ", "")?.trim()?.toLowerCase()]: 9,
        },
      });
  };

  useLayoutEffect(() => {
    loadLimit();
  }, []);

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
      <h1 className="text-sm md:text-xl text-primary-dark/70 font-medium uppercase tracking-widest">
        {title}
      </h1>
      <div className="flex items-center space-x-2 space-y-1 flex-wrap md:flex-nowrap md:space-y-0">
        {view ? (
          <div className="p-1 w-fit rounded border md:border-2 flex items-center justify-between space-x-1">
            <div className="flex items-center space-x-1">
              <button
                disabled={page == 1}
                onClick={prev}
                className={`bg-blue-50 md:h-8 md:w-8 h-6 w-6 rounded border flex items-center justify-center group`}
              >
                <BiSolidLeftArrow className="h-4 w-4 md:h-5 md:w-5 group-disabled:text-red-950/10 text-primary/70" />
              </button>
              <button
                className={`bg-slate-50 md:h-8 md:w-fit h-6 w-fit rounded border flex items-center justify-center`}
                onClick={goto}
              >
                <span className="px-2 w-fit h-4 md:h-5 font-semibold text-[0.65rem] md:text-sm text-primary-dark/30">
                  {page}
                </span>
              </button>
              <button
                disabled={page == pages}
                onClick={next}
                className={`bg-blue-50 md:h-8 md:w-8 h-6 w-6 rounded border flex items-center justify-center group`}
              >
                <BiSolidRightArrow className="h-4 w-4 md:h-5 md:w-5 group-disabled:text-red-950/10 text-primary/70" />
              </button>
              <button
                className={`bg-amber-50 md:h-8 md:w-fit h-6 w-fit rounded border flex items-center justify-center`}
              >
                <span className="px-2 w-fit h-4 md:h-5 font-semibold text-[0.65rem] md:text-sm text-primary-dark/30">
                  {pages}
                </span>
              </button>
            </div>
            <div className="relative">
              {/* <input type="search" name="search" placeholder="Search Record ..." onChange={searchRecord} className="w-40 md:h-8 h-6 bg-slate-50 border border-slate-100 placeholder:text-gray-400 focus:border-slate-50 focus:outline-none rounded " /> */}
              <input
                type="search"
                name="search"
                placeholder="Search Record ..."
                onChange={onSearchChange}
                className="w-[40vw] md:w-52 md:h-8 h-6 font-roboto text-sm md:text-base placeholder:text-sm md:placeholder:text-base text-gray-500 placeholder:text-gray-400/80 bg-slate-50 border border-slate-100  focus:ring-0 focus:border-slate-300 focus:outline-none rounded "
              />
            </div>
            <button
              onClick={setLimit}
              className={`${
                view == "card" ? "bg-slate-200" : "bg-slate-50"
              } md:h-8 md:w-8 h-6 w-6 rounded border flex items-center justify-center`}
            >
              <PiListNumbersBold className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
            </button>
            {/* <button onClick={() => setView('list')} className={`${view == 'list' ? 'bg-slate-200':'bg-slate-50'} md:h-8 md:w-8 h-6 w-6 rounded border flex items-center justify-center`}>
                    <GiHamburgerMenu className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
                </button>
                <button onClick={() => setView('card')} className={`${view == 'card' ? 'bg-slate-200':'bg-slate-50'} md:h-8 md:w-8 h-6 w-6 rounded border flex items-center justify-center`}>
                    <MdDashboard className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
                </button> */}
          </div>
        ) : null}

        {createlink && createtext ? (
          <Link
            to={createlink || "#"}
            className="py-0 md:py-2 px-3 md:px-4 h-9 md:h-10 rounded-md border bg-primary/90 flex items-center space-x-3"
          >
            <ImPlus className="text-white h-3 w-3 md:h-4 md:w-4" />
            <span className="flex text-white text-sm md:text-base font-medium">
              {createtext}
            </span>
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export default PageTitle;
