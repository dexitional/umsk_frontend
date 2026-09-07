import React from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";
import RegistrationListItem from "./RegistrationListItem";

type Props = {
  data?: any;
  title?: string;
};

function RegistrationListView({ title, data }: Props) {
  const navigate = useNavigate();

  // Update Compulsory & Locked Courses
  // const courses = data?.courses
  //  ?.filter((row: any) => row.type == "C" || (row.type == "E" && row.lock))
  //  ?.map((row: any) => row.code);

  const courses = useUserStore((state) => state.courses);
 
  const chosenCredit = data?.courses?.reduce((sum, cur) => {
    const isChosen = courses.find((course: any) => course == cur.code);
    if (isChosen) return sum + cur.credit;
    return sum + 0;
  }, 0);

  const reset = () => {
    const cdata = data?.courses
      ?.filter((row: any) => row.type == "C" || (row.type == "E" && row.lock))
      ?.map((row: any) => row.code);
    useUserStore.setState({ courses: cdata });
    // useUserStore.setState({ courses: [] })
  };

  const submit = async () => {
    const cdata = data?.courses?.filter((row: any) => {
      const isChosen = courses.find((course: any) => course == row.code);
      return !!isChosen;
    });

    if (cdata.length) {
      const resp = await Service.postRegistration(cdata);
      if (resp?.totalCourses) navigate("/print/registration");
      //console.log(resp?.totalCourses);
    } else {
      toast.error("Please select your courses");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-sm font-bold text-primary">{title}</h1>
        {courses?.length ? (
          <button
            onClick={reset}
            className="w-fit px-4 py-2 rounded-lg bg-slate-100 text-primary text-xs font-semibold hover:bg-slate-200 transition-colors"
          >
            Restart Selection
          </button>
        ) : (
          <div className="w-fit px-3 py-1.5 rounded-full bg-primary-accent/10 text-primary-accent text-xs font-semibold">
            Please choose your courses and submit
          </div>
        )}
      </div>
      <div className="px-4 py-3 rounded-xl bg-primary/5 text-primary/80 font-medium text-xs md:text-sm">
        Please note that compulsory courses are automatically selected.
      </div>
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-3 hidden md:grid grid-cols-6 gap-4 items-center border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <div>Code</div>
          <div className="col-span-2">Course</div>
          <div>Credit</div>
          <div>Type</div>
          <div className="text-right">Action</div>
        </div>
        <div>
          {data?.courses &&
            data?.courses?.map((row: any, i: number) => (<RegistrationListItem key={i} row={row} />))}
          {!data?.courses?.length && (
            <div className="py-10 text-center text-slate-400 text-xs font-semibold uppercase tracking-widest">
              No Record ...
            </div>
          )}
        </div>
        {courses && (
          <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-6 gap-3 md:items-center border-t border-slate-100 bg-slate-50/50">
            <div className="md:col-span-2">
              {courses?.length ? (
                <button
                  onClick={submit}
                  className="px-5 py-2 w-full md:w-auto bg-primary-accent rounded-lg text-white font-semibold text-xs tracking-wider uppercase hover:bg-primary-accent/90 transition-colors"
                >
                  Submit Registration
                </button>
              ) : null}
            </div>
            <div className="md:col-span-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span>
                Chosen Credits:&nbsp;
                <span className="text-primary-accent">
                  {chosenCredit}
                </span>
              </span>
            </div>
            <div className="md:col-span-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span>
                Maximum Credits:&nbsp;
                <span className="text-primary-accent">Not Set</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RegistrationListView;
