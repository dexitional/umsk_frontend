import React from 'react'
import { MdDataset } from 'react-icons/md'
import { Link } from "react-router-dom"

function ServiceCard({ title,Icon,link }) {
  return (
    <Link to={link} className="p-1 flex items-center space-x-4 rounded hover:bg-red-50/90 hover:cursor-pointer group">
        <div className="p-1 h-10 w-10 rounded bg-slate-200 group-hover:bg-red-100 flex items-center justify-center">
        { Icon 
            ? (<Icon className="w-6 h-6 md:w-6 md:h-6 text-zinc-500/80" />)
            : (<MdDataset className="w-6 h-6 md:w-6 md:h-6 text-zinc-500/80" />)
        }
        </div>
        <span className="text-sm text-zinc-600 font-medium">{title}</span>
    </Link>
  )
}

export default ServiceCard