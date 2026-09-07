import React, { useLayoutEffect } from "react";
import toast from "react-hot-toast";
import { redirect, useLoaderData } from "react-router-dom";
import AISPPageHeader from "../../components/aisp/AISPPageHeader";
import RegistrationListView from "../../components/aisp/RegistrationListView";
import RegistrationSlipView from "../../components/aisp/RegistrationSlipView";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";

type Props = {};

export async function loader() {
  const user = useUserStore.getState().user;
  const data = await Service.fetchRegistrationMount(user?.user?.tag);
  const slip = await Service.fetchRegistration(user?.user?.tag);
  const student = await Service.fetchStudent(user?.user?.tag);
  const fees = await Service.fetchStudentFinance(user?.user?.tag);

  if (student?.completeStatus) {
    toast("Program completed 💥💥💥", { className: "text-xl text-primary-dark" });
    return redirect("/aisp/profile");
  }
  return { data, slip, student, fees };
}

function PgAISPRegistrations({}: Props) {
  const { data, slip, student, fees }: any = useLoaderData();
  const runDefault = () => {
    // Update Compulsory & Locked Courses
    const cdata = data?.courses
      ?.filter((row: any) => row.type == "C" || (row.type == "E" && row.lock))
      ?.map((row: any) => row.code);
    useUserStore.setState({ courses: cdata });
  };
  const sum = fees?.reduce((sum: any, cur: any) => cur.amount + sum, 0);
  useLayoutEffect(() => runDefault(), []);

  return (
    <div className="p-4 md:p-0 space-y-6 md:space-y-8">
      <AISPPageHeader title="Course Registration" subtitle={data?.session?.toUpperCase()} />
      {!slip?.length ? (
        <RegistrationListView
          title={`${data?.session?.toUpperCase()} REGISTRATION PROCEDURE`}
          data={data}
        />
      ) : (
        <RegistrationSlipView
          title={`${data?.session?.toUpperCase()} REGISTRATION SLIP`}
          data={slip}
        />
      )}
    </div>
  );
}

export default PgAISPRegistrations;
