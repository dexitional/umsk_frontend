import React from "react";
import { useLoaderData } from "react-router-dom";
import LetterTemplate from "../../components/ais/LetterTemplate";
import Service from "../../utils/aisService";

type Props = {};

export async function loader({ params }) {
  let ts = await Service.fetchTranswift(params.transwiftId);
  const docType =
    ts?.transact?.transtypeId == 6
      ? "att"
      : ts?.transact?.transtypeId == 9
      ? "pro"
      : ts?.transact?.transtypeId == 10
      ? "int"
      : "";
  let data = await Service.fetchLetter(docType);

  return { data: { ...ts, ...data } };
}

function PgDocument({}: Props) {
  const { data }: any = useLoaderData();

  return <LetterTemplate data={data} />;
}

export default PgDocument;
