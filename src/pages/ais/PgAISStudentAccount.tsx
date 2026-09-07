import React from "react";
import { useLoaderData } from "react-router-dom";
import AISAccountCard from "../../components/ais/AISAccountCard";
import Service from "../../utils/aisService";

type Props = {};

export async function loader({ params }) {
  const data = await Service.fetchStudent(params.studentId);
  return { data };
}

function PgAISStudentAccount({}: Props) {
  const { data }: any = useLoaderData();

  return (
    <div className="flex w-full flex-1 flex-col space-y-8 md:space-y-8 ">
      <AISAccountCard data={data} />
    </div>
  );
}

export default PgAISStudentAccount;
