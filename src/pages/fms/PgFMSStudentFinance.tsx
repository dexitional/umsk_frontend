import React from "react";
import { Form, redirect, useLoaderData } from "react-router-dom";
import FMSFinanceCard from "../../components/fms/FMSFinanceCard";
import Service from "../../utils/fmsService";
import { useHasRole } from "../../utils/roles";

type Props = {};

export async function loader({ params }) {
  const data = await Service.fetchAccount(params.accountId);
  return { data };
}

// accounts/:accountId/fine — accountId is the student's id (see fetchAccount,
// which queries studentAccount by studentId == req.params.id).
export async function action({ params }) {
  await Service.lateCharge({ studentId: params.accountId });
  return redirect(`/fms/accounts/${params.accountId}`);
}

function PgFMSStudentFinance({}: Props) {
  const { data }: any = useLoaderData();
  const canChargeLateFine = useHasRole("fms", ["account::admin"]);

  return (
    <div className="flex w-full flex-1 flex-col space-y-8 md:space-y-8 ">
      {canChargeLateFine ? (
        <div className="flex justify-end px-6">
          <Form
            method="post"
            action="fine"
            onSubmit={(e) => {
              if (!confirm("Charge a late registration fine to this student?")) e.preventDefault();
            }}
          >
            <button
              type="submit"
              className="py-1.5 px-3 rounded-md border border-red-200 bg-red-50 text-red-500 text-xs font-semibold hover:bg-red-100"
            >
              Charge Late Fine
            </button>
          </Form>
        </div>
      ) : null}
      <FMSFinanceCard data={data} />
    </div>
  );
}

export default PgFMSStudentFinance;
