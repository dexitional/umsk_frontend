import React from "react";
import { redirect } from "react-router-dom";
import Service from "../../utils/dricService";
import LASByGroup from "./LASByGroup";

type Props = {};

export async function action({ params }) {
  await Service.deleteFunder(params.funderId);
  return redirect("/dric/funders");
}

function LASFilter({}: Props) {
  return <LASByGroup />;
}

export default LASFilter;
