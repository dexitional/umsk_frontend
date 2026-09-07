import React from 'react'

type Props = {
    title: string;
}

function ListHeading({ title }: Props) {
  return (
    <span className="md:hidden print:hidden px-3 py-0.5 rounded-sm bg-slate-100 text-primary text-[0.65rem] font-poppins uppercase tracking-widest">{title}</span>
  )
}

export default ListHeading