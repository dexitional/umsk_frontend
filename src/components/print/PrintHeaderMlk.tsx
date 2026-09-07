import React from 'react';
import Logo2 from '../../assets/img/ctvet.png';
import Logo from '../../assets/img/logo/aucc/logo.png';

type Props = {}

function PrintHeaderMlk({}: Props) {
  return (
    <div className="hidden print:flex md:flex flex-col">
        <span className="m-0 p-0 text-[2.5rem] print:text-[2rem] text-[#008e46] font-[san-serif] font-semibold  md:leading-[4rem] text-center">MARTIN LUTHER HEALTH TRAINING  COLLEGE </span>
        <div className="my-8 mx-auto print:my-4 print:w-full md:w-[90%] max-w-4xl flex flex-row justify-center">
            <div className="w-48 print:w-48 flex item-center justify-center">
                <img className="h-32 print:h-[7rem]" src={Logo2} />
            </div>
            <div className="flex-1 space-y-10 print:space-y-4 print:text-xs">
                <div className="flex justify-center text-slate-900 tracking-wider">
                    <p className="print:leading-[17px] font-[arial] text-xl print:text-xs text-center leading-6">KINTAMPO  - GHANA<br/>Academic Affairs Office<br/>Post Office Box KH 176, Kintampo<br/>{/*Tel. +233 (0)  244283606*/}</p>
                </div>
                <div className="flex justify-center">
                    <p className="print:leading-[17px] font-[san-serif] text-2xl print:text-xs text-center tracking-wider leading-[1.2rem]">TRANSCRIPT OF ACADEMIC RECORDS</p>
                </div>
            </div>
            <div className="w-48 print:w-48 flex item-center justify-center">
                <img className="h-32 print:h-[7rem]" src={Logo} />
            </div>
        </div>
    </div>
  )
}

export default PrintHeaderMlk