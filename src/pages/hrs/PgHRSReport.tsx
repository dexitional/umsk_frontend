import React from 'react'
import PageTitle from '../../components/hrs/PageTitle'
import ReportListView from '../../components/hrs/ReportListView'

type Props = {}

function PgHRSReport({}: Props) {
  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
    <PageTitle title="Reports" createtext="" createlink="" setView={() => null} view={''} />
    <div className="">
      {/* <h1>Projects Report</h1>
      <p>Coming soon ...</p> */}
      {/* 
      <div>
          * List of all projects [project name, project objective, amount, funder, principal investigator, co-investigator phases, percentage complete] - completed | in-progress
          * List of Investigators [ name, staff number, department , number of projects as principal, as co-investigator]
          * List of funders [ name,country,location, number of projects, total funded ]
          * List of personel [ name, indentity number, department , number of project activities ]
      </div> 
      */}
      <div>
        <ReportListView />
      </div>

    </div>
  </div>
  )
}

export default PgHRSReport