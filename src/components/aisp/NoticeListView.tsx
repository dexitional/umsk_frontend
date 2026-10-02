import React from 'react'
import { HiOutlineMegaphone } from 'react-icons/hi2';
import AISPEmpty from './AISPEmpty';
import NoticeListItem from './NoticeListItem';

type Props = {
  data: any;
}

function NoticeListView({ data }: Props) {
  return (
    <section className="aisp-rise aisp-card overflow-hidden">
      <div className="aisp-thead grid-cols-7">
          <div className="col-span-4">Title</div>
          <div>Reference</div>
          <div>Date</div>
          <div className="text-right">Action</div>
      </div>
      <div>
        { data && data?.map((row:any) => (<NoticeListItem key={row.id} data={row} />))}
        { !data?.length && (
          <AISPEmpty title="No messages" message="New circulars and announcements will appear here." Icon={HiOutlineMegaphone} />
        )}
      </div>
    </section>
  )
}

export default NoticeListView
