import React from 'react'

type Props = {
    title: string;
}

// Inline field label shown only on small screens, where list rows stack.
function ListHeading({ title }: Props) {
  return (
    <span className="md:hidden print:hidden text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-slate-400">{title}</span>
  )
}

export default ListHeading
