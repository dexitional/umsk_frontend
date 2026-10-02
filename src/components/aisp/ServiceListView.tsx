import React from 'react'
import { HiOutlineDocumentText } from 'react-icons/hi2';
import AISPEmpty from './AISPEmpty';
import ServiceListItem from './ServiceListItem';

type Props = {
  data: any;
}

function ServiceListView({ data }: Props) {
  return (
    <section className="aisp-rise aisp-card overflow-hidden">
      <div className="aisp-thead grid-cols-8">
          <div className="col-span-2">Document</div>
          <div>Transact ID</div>
          <div>Type</div>
          <div>Quantity</div>
          <div>Status</div>
          <div>Created On</div>
          <div className="text-right">Action</div>
      </div>
      <div>
        { data && data?.map((row:any) => (<ServiceListItem key={row.id} data={row} />))}
        { !data?.length && (
          <AISPEmpty
            title="No requests yet"
            message="Pay for a transcript or certificate at the bank or via USSD and your request will show up here."
            Icon={HiOutlineDocumentText}
          />
        )}
      </div>
    </section>
  )
}

export default ServiceListView
