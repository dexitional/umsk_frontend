import React from "react";
import { useLoaderData } from "react-router-dom";
import AISIDCard from "../../components/ais/AISIDCard";
import Service from "../../utils/aisService";

type Props = {};

export async function loader({ params }) {
  const data = await Service.fetchStudent(params.studentId);
  return { data };
}

function PgAISStudentIDCard({}: Props) {
  const { data }: any = useLoaderData();
  return (
    <div className="flex w-full flex-1 flex-col space-y-8 md:space-y-8 ">
      <AISIDCard data={data} />
    </div>
  );
}

export default PgAISStudentIDCard;
