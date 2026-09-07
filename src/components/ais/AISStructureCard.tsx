import React from 'react'

type Props = {
    data?: any;
    title?: string;
    
}

function AISStructureCard({ title,data }: Props) {
  return (
    <div className="w-full space-y-3 rounded">
    <h1 className="text-sm font-bold font-roboto tracking-wider text-primary-dark/60 flex flex-col md:flex-row md:justify-between space-y-2 md:space-y-0">
      <span className="px-3 py-0.5 rounded border border-primary/50">{title}</span>
      <span className="px-3 py-0.5 rounded bg-primary/70 text-xs text-white font-bold flex items-center">{data?.length} COURSES</span>
    </h1>
    <div className="w-full rounded-lg shadow-md text-xs overflow-x-scroll md:overflow-hidden">
          <div className="px-3 py-2 bg-primary/10 text-primary-dark/70 font-bold grid grid-cols-6 tracking-wider">
            <span >CODE</span>
            <span className="col-span-4">COURSE</span>
            <span>CR</span>
          </div>
          { data.map((row:any) => (
            <div className={`px-3 py-2 border-b grid grid-cols-6 font-medium text-xs ${row.type == 'E' ? 'text-primary-dark/80': 'text-primary/80'}`}>
              <span className="font-bold">{row.code}</span>
              <span className="col-span-4 font-medium">{row.course}&nbsp;&nbsp;&nbsp;&nbsp;<sub className="text-primary-accent/80"><em>{ row.type == 'E' ? '( ELECTIVE )':'' }</em></sub></span>
              <span>{row.credit}</span>
            </div>
          ))}
          {/* Totals */}
          {/* <div className="px-3 py-2 border-b grid grid-cols-8 font-bold text-xs text-primary-accent/80">
            <span>&nbsp;</span>
            <span className="col-span-4 font-bold">CGPA:&nbsp;&nbsp;&nbsp;{ cgpa && cgpa[index] || 0 }</span>
            <span>GPA:&nbsp;&nbsp;&nbsp;{gpa?.toFixed(1)}</span>
            <span>TCR:&nbsp;&nbsp;&nbsp;{ credit?.toFixed(1) }</span>
            <span>TGP:&nbsp;&nbsp;&nbsp;{ gradepoint?.toFixed(1) }</span>
          </div> */}
    </div>
 </div>
  )
}

export default AISStructureCard