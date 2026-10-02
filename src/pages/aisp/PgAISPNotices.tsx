import React from "react";
import { HiOutlineMegaphone } from "react-icons/hi2";
import { useLoaderData } from "react-router-dom";
import AISPPageHeader from "../../components/aisp/AISPPageHeader";
import NoticeListView from "../../components/aisp/NoticeListView";
import Service from "../../utils/hrsService";

type Props = {};

export async function loader() {
  const data = await Service.fetchNSSNotices();
  return { data };
}

function PgAISPNotices({}: Props) {
  const { data }: any = useLoaderData();

  return (
    <div className="space-y-6 md:space-y-8">
      <AISPPageHeader photo="culture" eyebrow="Notices" title="NSS Notices" subtitle="Circulars and announcements" Icon={HiOutlineMegaphone} />
      <NoticeListView data={data} />
    </div>
  );
}

export default PgAISPNotices;
