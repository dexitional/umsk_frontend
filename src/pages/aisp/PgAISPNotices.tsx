import React from "react";
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
    <div className="p-4 md:p-0 space-y-6 md:space-y-8">
      <AISPPageHeader title="NSS Notices" subtitle="Circulars and announcements" />
      <NoticeListView data={data} />
    </div>
  );
}

export default PgAISPNotices;
