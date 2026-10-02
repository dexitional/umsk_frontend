import React from "react";
import { IconType } from "react-icons";
import { AISPCrest, AISPPhotoBlend, CampusPhoto } from "./AISPPhotoBlend";

type Props = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  Icon?: IconType;
  // Renders the header as a brand banner with this campus photo blended in.
  photo?: CampusPhoto;
  children?: React.ReactNode;
};

function AISPPageHeader({ title, subtitle, eyebrow, Icon, photo, children }: Props) {
  if (photo) {
    return (
      <section className="aisp-rise relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-secondary via-primary to-sky-800 text-white shadow-xl shadow-primary/20">
        <AISPPhotoBlend photo={photo} className="opacity-50" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-secondary/80 via-secondary/30 to-transparent" />
        <div className="pointer-events-none absolute inset-0 aisp-grid opacity-50 [mask-image:linear-gradient(to_right,black,transparent_60%)]" />
        <AISPCrest className="hidden sm:block right-6 top-1/2 -translate-y-1/2 h-36 md:h-44 opacity-[0.18] mix-blend-luminosity" />

        <div className="relative px-6 py-7 md:px-9 md:py-9 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div className="flex items-start gap-4 min-w-0">
            {Icon ? (
              <div className="hidden sm:flex h-12 w-12 shrink-0 rounded-2xl bg-white/[0.15] ring-1 ring-inset ring-white/25 backdrop-blur items-center justify-center">
                <Icon className="h-6 w-6" />
              </div>
            ) : null}
            <div className="min-w-0">
              {eyebrow ? (
                <span className="block mb-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-sky-200">
                  {eyebrow}
                </span>
              ) : null}
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{title}</h1>
              {subtitle ? <p className="mt-1.5 max-w-2xl text-sm text-sky-100/80">{subtitle}</p> : null}
            </div>
          </div>
          {children ? <div className="relative flex flex-wrap items-center gap-2 md:mr-40">{children}</div> : null}
        </div>
      </section>
    );
  }

  return (
    <div className="aisp-rise flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div className="flex items-start gap-4 min-w-0">
        {Icon ? (
          <div className="hidden sm:flex h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-sky-500 to-primary text-white items-center justify-center shadow-lg shadow-primary/25">
            <Icon className="h-6 w-6" />
          </div>
        ) : null}
        <div className="min-w-0">
          {eyebrow ? (
            <span className="block mb-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-sky-600">
              {eyebrow}
            </span>
          ) : null}
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-1.5 max-w-2xl text-sm text-slate-500">{subtitle}</p>
          ) : null}
        </div>
      </div>
      {children ? <div className="flex flex-wrap items-center gap-2">{children}</div> : null}
    </div>
  );
}

export default AISPPageHeader;
