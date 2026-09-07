import React from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { FaChartBar } from 'react-icons/fa'
import AISNavItem from '../../components/ais/AISNavItem'

type Props = {}

function AISPage({}: Props) {
  return (
    <div className="w-full h-screen flex flex-col">
    <Header />
    <main className="w-full flex flex-col overflow-y-scroll">
      <section className="mx-1.5 md:mx-auto w-full md:max-w-6xl flex">
         <div className="z-20 fixed w-64 h-screen bg-gradient-to-r from-white to-zinc-200/50 bg-opacity-5 flex flex-col space-y-16">
            <div className="my-2 p-4 rounded-l-md bg-gradient-to-l to-gray-200 via-white from-white">
                <div className="h-10 flex items-center justify-center space-x-2 font-sans text-xl rounded-t-md border-2 bg-white border-b-8 border-blue-950/70 text-blue-950/70 tracking-widest">
                    <span className="font-extrabold">ACADEMIC</span> 
                    <span className="font-mono">SYSTEM</span>
                </div>
            </div>   
            <div className="py-4 px-6 flex-1 flex flex-col space-y-4">
                
                <AISNavItem title="Dashboard" url="" Icon={FaChartBar} isActive={true} />
                <AISNavItem title="Funders" url="" Icon={FaChartBar} isActive={false} />
                <AISNavItem title="Projects" url="" Icon={FaChartBar} isActive={false} />
                <AISNavItem title="Investigators" url="" Icon={FaChartBar} isActive={false} />
                <AISNavItem title="Personnels" url="" Icon={FaChartBar} isActive={false} />
                <AISNavItem title="Reports" url="" Icon={FaChartBar} isActive={false} />

            </div>
         </div>
         <div className="flex-1 min-h-screen">

         </div>
      </section>
      
    </main>
    <Footer />
</div>
  )
}

export default AISPage