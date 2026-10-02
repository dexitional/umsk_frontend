import React from "react";
import { HiOutlineArrowRightOnRectangle } from "react-icons/hi2";
import AISPLogoBox from "./AISPLogoBox";
import { AISPCrest, AISPPhotoBlend } from "./AISPPhotoBlend";
import AISPNav from "./AISPNav";
const { REACT_APP_API_URL } = import.meta.env;

type Props = {
  user: any;
  onSignout: () => void;
  onNavigate?: () => void;
};

function AISPSidebar({ user, onSignout, onNavigate }: Props) {
  const name = [user?.user?.fname, user?.user?.lname].filter(Boolean).join(" ").toLowerCase();
  return (
    <div className="relative h-full w-full flex flex-col overflow-hidden bg-gradient-to-b from-secondary via-[#0c1a63] to-primary-dark text-white">
      {/* Campus photo, crest watermark, glow + grid */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80">
        <AISPPhotoBlend photo="gate" fade="bottom" className="opacity-30" />
      </div>
      <AISPCrest className="-right-16 bottom-16 w-64 opacity-[0.07] mix-blend-luminosity rotate-[-8deg]" />
      <div className="pointer-events-none absolute inset-0 aisp-grid opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
      <div className="pointer-events-none absolute -top-24 -left-20 h-64 w-64 rounded-full bg-sky-500/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 -right-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative px-6 pt-7 pb-6">
        <AISPLogoBox />
      </div>

      <div className="relative flex-1 overflow-y-auto scrollbar-hide px-3 pb-6">
        <AISPNav onNavigate={onNavigate} />
      </div>

      <div className="relative p-4">
        <div className="p-3 rounded-2xl bg-white/[0.06] ring-1 ring-inset ring-white/10 backdrop-blur flex items-center gap-3">
          <img
            src={`${REACT_APP_API_URL}/auth/photos/?tag=${user?.user?.tag}`}
            alt=""
            className="h-10 w-10 shrink-0 rounded-xl object-cover bg-white/10 ring-2 ring-sky-400/40"
          />
          <div className="flex-1 min-w-0 leading-tight">
            <span className="block text-sm font-semibold capitalize truncate">{name || "Student"}</span>
            <span className="block text-[0.7rem] text-white/50 truncate">{user?.user?.tag}</span>
          </div>
          <button
            onClick={onSignout}
            title="Log out"
            className="h-9 w-9 shrink-0 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <HiOutlineArrowRightOnRectangle className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AISPSidebar;
