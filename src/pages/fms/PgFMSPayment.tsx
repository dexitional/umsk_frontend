import React from "react";
import SubPageTitle from "../../components/fms/SubPageTitle";
// @ts-ignore
import { TbEdit, TbPrinter } from "react-icons/tb";
import { Link, Outlet, redirect, useLoaderData } from "react-router-dom";
import Service from "../../utils/fmsService";
import PaymentReceipt from "../../components/fms/PaymentReceipt";
const { REACT_APP_API_URL } = import.meta.env;

type Props = {};

// Loader for Single Project
export async function loader({ params }) {
  const data = await Service.fetchPayment(params.paymentId);
  return { data };
}

function PgFMSPayment({}: Props) {
  const { data }: any = useLoaderData();
  return (
    <main className="md:pl-10 p-3 md:p-6 space-y-3 md:space-y-10">
      <SubPageTitle title={``} page="PAYMENT RECEIPT" />
      <div className="p-3 md:p-6 border bg-slate-50/50 rounded-xl md:space-y-6 space-y-4 ">
        <section className="gap-y-2">
          <div className="p-2 w-full md:py-4 md:px-6 flex flex-col space-y-3 md:space-y-6 border rounded-md md:rounded-xl bg-white">
            <PaymentReceipt data={data}/>
          </div>
        </section>
      </div>
    </main>
  );
}

export default PgFMSPayment;
