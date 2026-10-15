import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import moment from "moment";
import React, { forwardRef, useEffect, useLayoutEffect, useRef, useState } from "react";
import { HiOutlineArrowDownTray, HiOutlinePrinter } from "react-icons/hi2";
import Logo from "../../assets/img/logo.webp";
import Torch from "../../assets/img/torch.png";
const { REACT_APP_API_URL } = import.meta.env;

type Props = {
  data?: any;
};

// Standard PVC card (ISO/IEC 7810 ID-1, "CR80"), landscape, in mm.
export const CARD_W = 85.6;
export const CARD_H = 53.98;
// Render scale for the PDF: 85.6mm at 96dpi ≈ 324px, ×6 ≈ 580dpi --
// comfortably above the 300dpi card printers print at.
const CAPTURE_SCALE = 6;
// On-screen preview size.
const PREVIEW_ZOOM = 1.55;

const NAVY = "#0a1358";
const BLUE = "#1e3a8a";
const ACCENT = "#397ca6";
// Akatsico brand green (akaweb packages/ui tokens --brand-green); the light
// tint is for text on the navy footer, where the brand green is too dark.
const GREEN = "#008551";
const GREEN_LIGHT = "#5fd39a";

// The login page's torch (torch.png) is white, for dark backgrounds. On the
// white card it's recoloured navy on a canvas -- a CSS filter would do on
// screen, but html2canvas (the PDF capture) ignores CSS filters.
function useTintedImage(src: string, color: string) {
  const [tinted, setTinted] = useState<string>("");
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      ctx.globalCompositeOperation = "source-in";
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setTinted(canvas.toDataURL("image/png"));
    };
    img.src = src;
  }, [src, color]);
  return tinted;
}

function TorchWatermark({ className }: { className: string }) {
  const torch = useTintedImage(Torch, NAVY);
  // Height only: the width follows the image's own aspect ratio.
  return torch ? <img src={torch} alt="" className={`pointer-events-none absolute w-auto ${className}`} /> : null;
}

// html2canvas (the PDF capture) ignores object-fit, stretching an <img> to
// its box, and draws background images at screen resolution (blurry in
// print). So images stay plain <img>s sized to their own aspect ratio: the
// crest by height only, and the photo "cover"-cropped by hand below.

// Photo frame's inner size (mm) -- sized so the AKATSICO pill fits under it.
const PHOTO_W = 19.6;
const PHOTO_H = 24.4;

// Loads the student's photo up front (with CORS, for the PDF capture) and
// works out the cover crop -- the size and offset that fill PHOTO_W x
// PHOTO_H without distortion, centred.
function useStudentPhoto(studentId?: string) {
  const [photo, setPhoto] = useState<{ url: string; w: number; h: number; left: number; top: number } | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setPhoto(null);
    setFailed(false);
    if (!studentId) return setFailed(true);
    const src = `${REACT_APP_API_URL}/auth/photos/?tag=${encodeURIComponent(studentId)}`;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const scale = Math.max(PHOTO_W / img.naturalWidth, PHOTO_H / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      setPhoto({ url: src, w, h, left: (PHOTO_W - w) / 2, top: (PHOTO_H - h) / 2 });
    };
    img.onerror = () => setFailed(true);
    img.src = src;
  }, [studentId]);
  return { photo, failed };
}

const fullName = (d: any) => [d?.fname, d?.mname, d?.lname].filter(Boolean).join(" ");
const gender = (d: any) => {
  const g = String(d?.gender || "").toUpperCase();
  return g === "M" || g === "MALE" ? "MALE" : g === "F" || g === "FEMALE" ? "FEMALE" : g || null;
};
const issued = (d: any) => moment(d?.entryDate || new Date());
// As before: valid for four years from admission, to October.
const expires = (d: any) => issued(d).clone().add(4, "years").month(9);

// "CHRISTABEL MAWUENYEGA AKPENE DZIFA" -> "CHRISTABEL M. A. DZIFA"
const nameWithMiddleInitials = (d: any) =>
   [d?.fname, ...String(d?.mname || "").trim().split(/\s+/).filter(Boolean).map((m: string) => `${m[0]}.`), d?.lname].filter(Boolean).join(" ");

const NAME_PX = 9.6;
const NAME_MIN_PX = 7;

// The student's name on one line: the full name if it fits, else with the
// middle names as initials, and only if that still overflows (a very long
// first/last name) the text steps down in size to NAME_MIN_PX. Measured on
// the rendered element, and re-checked once web fonts have loaded.
function FitName({ data }: { data: any }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const full = fullName(data) || "Student name";
  const short = nameWithMiddleInitials(data) || full;
  const [fit, setFit] = useState({ text: full, size: NAME_PX });

  useLayoutEffect(() => setFit({ text: full, size: NAME_PX }), [full]);
  useEffect(() => {
    let live = true;
    document.fonts?.ready.then(() => live && setFit({ text: full, size: NAME_PX }));
    return () => { live = false; };
  }, [full]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || el.scrollWidth <= el.clientWidth + 0.5) return;
    if (fit.text !== short) setFit({ text: short, size: NAME_PX });
    else if (fit.size > NAME_MIN_PX) setFit({ text: short, size: Math.max(NAME_MIN_PX, +(fit.size - 0.3).toFixed(1)) });
  }, [fit, short]);

  return (
    <h2 ref={ref} title={full} className="mt-[0.6mm] whitespace-nowrap font-black uppercase leading-[1.1]" style={{ color: NAVY, fontSize: `${fit.size}px` }}>
      {fit.text}
    </h2>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="min-w-0">
      <span className="block text-[5.8px] font-bold uppercase tracking-[0.1em] text-slate-500 leading-none">{label}</span>
      <span className="mt-[1.2px] block break-words text-[7.2px] font-extrabold leading-tight" style={{ color: NAVY }}>
        {value || "—"}
      </span>
    </div>
  );
}

// Front: crest + college band, photo, name, programme and key details.
export const IDCardFront = forwardRef<HTMLDivElement, { data: any }>(function IDCardFront({ data }, ref) {
  const { photo, failed: photoFailed } = useStudentPhoto(data?.id);
  const initials = [data?.fname, data?.lname].filter(Boolean).map((n: string) => n[0]).join("").toUpperCase();
  return (
    // data-photo-ready: the photo has loaded (or there is none) -- cardsToPdf
    // waits for it so no card is captured with a blank photo frame.
    <div ref={ref} data-photo-ready={photo || photoFailed ? "true" : "false"} className="relative overflow-hidden bg-white font-roboto" style={{ width: `${CARD_W}mm`, height: `${CARD_H}mm` }}>
      {/* Watermark: the college torch */}
      <TorchWatermark className="-right-[1mm] top-[13mm] h-[42mm] opacity-[0.11]" />

      {/* Header band */}
      <div className="relative flex items-center gap-[2.6mm] px-[3mm]" style={{ height: "14.5mm", background: `linear-gradient(110deg, ${NAVY} 0%, ${BLUE} 70%, ${ACCENT} 100%)` }}>
        <div className="flex h-[10.5mm] w-[10.5mm] shrink-0 items-center justify-center rounded-full bg-white">
          <img src={Logo} alt="Akatsi College of Education crest" className="h-[9.2mm] w-auto max-w-[9.6mm]" />
        </div>
        <div className="min-w-0 leading-none">
          <span className="block whitespace-nowrap text-[10.8px] font-black uppercase tracking-[0.1em] text-white">Akatsi College of Education</span>
          <span className="mt-[1.3mm] block whitespace-nowrap text-[7.8px] font-bold uppercase tracking-[0.3em]" style={{ color: "#c6ddeb" }}>
            Student Identity Card
          </span>
        </div>
      </div>
      {/* Accent stripe */}
      <div className="flex h-[0.9mm]">
        <div className="flex-[3]" style={{ background: GREEN }} />
        <div className="flex-1" style={{ background: ACCENT }} />
      </div>

      {/* Body */}
      <div className="relative flex gap-[3mm] px-[3mm] pt-[2.6mm]">
        <div className="shrink-0">
          <div className="rounded-[1.6mm] bg-white p-[0.5mm]" style={{ border: `0.3mm solid ${ACCENT}` }}>
            <div className="relative overflow-hidden rounded-[1.1mm]" style={{ width: `${PHOTO_W}mm`, height: `${PHOTO_H}mm` }}>
            {photo ? (
              <img
                src={photo.url}
                crossOrigin="anonymous"
                alt={fullName(data)}
                className="absolute max-w-none"
                style={{ width: `${photo.w}mm`, height: `${photo.h}mm`, left: `${photo.left}mm`, top: `${photo.top}mm` }}
              />
            ) : photoFailed ? (
              <div className="flex h-full w-full items-center justify-center text-[16px] font-black text-white" style={{ background: BLUE }}>
                {initials || "?"}
              </div>
            ) : (
              <div className="h-full w-full bg-slate-100" />
            )}
            </div>
          </div>
          <div className="mt-[1mm] h-[3.8mm] rounded-full text-center text-[6.4px] font-black uppercase leading-[3.8mm] tracking-[0.12em]" style={{ background: GREEN, color: "#ffffff" }}>
            <span data-pdf-nudge="1.1">AKATSICO</span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <span className="block text-[5.8px] font-bold uppercase tracking-[0.1em] text-slate-500 leading-none">Name</span>
          <FitName data={data} />
          <p className="mt-[1mm] text-[7.4px] font-semibold leading-[1.22] text-slate-600">
            {data?.program?.longName || data?.program?.shortName || "Programme"}
          </p>
          <div className="mt-[2mm] grid grid-cols-3 gap-x-[1.8mm] gap-y-[1.6mm]">
            <Field label="Student ID" value={data?.id} />
            <Field label="Index No." value={data?.indexno} />
            <Field label="Gender" value={gender(data)} />
            <Field label="Issued" value={issued(data).format("MMM YYYY").toUpperCase()} />
            <Field label="Expires" value={expires(data).format("MMM YYYY").toUpperCase()} />
            <Field label="Nationality" value={data?.country?.nationality} />
          </div>
        </div>
      </div>

      {/* Footer band */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-[3mm]" style={{ height: "4.2mm", background: NAVY }}>
        <span data-pdf-nudge className="leading-[4.2mm] text-[5px] font-semibold tracking-[0.12em] text-white/90">www.akatsico.edu.gh</span>
        {/* Hall of residence (student.instituteAffliate); left out when not recorded. */}
        {data?.instituteAffliate ? (
          <span data-pdf-nudge className="ml-[3mm] truncate leading-[4.2mm] text-[5px] font-bold uppercase tracking-[0.12em]" style={{ color: GREEN_LIGHT }}>
            Hall: {data.instituteAffliate}
          </span>
        ) : null}
      </div>
    </div>
  );
});

// Back: ownership statement, return address and signature lines.
export const IDCardBack = forwardRef<HTMLDivElement, { data: any }>(function IDCardBack({ data }, ref) {
  return (
    <div ref={ref} className="relative overflow-hidden bg-white font-roboto" style={{ width: `${CARD_W}mm`, height: `${CARD_H}mm` }}>
      <TorchWatermark className="right-[1mm] top-[5mm] h-[44mm] opacity-[0.09]" />
      <div className="flex h-[3.2mm]">
        <div className="flex-1" style={{ background: `linear-gradient(110deg, ${NAVY}, ${BLUE})` }} />
      </div>
      <div className="flex h-[0.7mm]">
        <div className="flex-[3]" style={{ background: GREEN }} />
        <div className="flex-1" style={{ background: ACCENT }} />
      </div>

      <div className="relative px-[5mm] pt-[2.6mm] text-center">
        <p className="text-[5.4px] font-semibold uppercase tracking-[0.2em] text-slate-400">This card is the property of</p>
        <p className="mt-[0.5mm] text-[9px] font-black uppercase tracking-[0.05em]" style={{ color: NAVY }}>
          Akatsi College of Education
        </p>
        <p className="mx-auto mt-[1.4mm] max-w-[70mm] text-[5.6px] leading-[1.45] text-slate-600">
          The holder, whose photograph appears overleaf, is a registered student of the College. This card is not transferable and must be
          produced on request.
        </p>

        <div className="mx-auto mt-[2mm] max-w-[72mm] rounded-[1.2mm] px-[2.5mm] py-[1.6mm]" style={{ background: "#f4f8fb", border: `0.2mm solid #c6ddeb` }}>
          <p className="text-[5.2px] font-bold uppercase tracking-[0.16em]" style={{ color: ACCENT }}>
            If found, please return to
          </p>
          <p className="mt-[0.6mm] text-[6px] font-bold" style={{ color: NAVY }}>
            The Registrar, Akatsi College of Education
          </p>
          <p className="text-[5.4px] leading-[1.4] text-slate-600">Akatsi, Volta Region, Ghana · GPS: VX-0021-0401</p>
          <p className="text-[5.4px] leading-[1.4] text-slate-600">Tel: +233 25 675 4949 / +233 24 538 3769 · registrar@akatsico.edu.gh</p>
        </div>

      </div>

      <div className="absolute inset-x-0 bottom-[7mm] mx-auto w-[32mm] text-center">
        <div className="border-t-[0.2mm] border-slate-400" />
        <span className="mt-[0.5mm] block text-[4.8px] font-semibold uppercase tracking-[0.14em] text-slate-400">Authorised signatory</span>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center" style={{ height: "4.2mm", background: NAVY }}>
        <span data-pdf-nudge className="leading-[4.2mm] text-[5px] font-semibold tracking-[0.12em] text-white/90">
          www.akatsico.edu.gh · {data?.id || ""}
        </span>
      </div>
    </div>
  );
});

// html2canvas renders a clone of the page. On the clone: the preview's zoom
// transform is removed (or the capture comes out scaled), and Tailwind's
// `img { display: block }` is undone -- with it html2canvas draws text below
// its real baseline, clipping it. Text in the short pill/footer boxes still
// lands low in html2canvas, so [data-pdf-nudge="<mm>"] lifts it by that much
// there only (default 0.8mm).
export async function renderFace(el: HTMLElement) {
  return html2canvas(el, {
    scale: CAPTURE_SCALE,
    useCORS: true,
    backgroundColor: "#ffffff",
    onclone: (doc) => {
      doc.querySelectorAll<HTMLElement>("[data-card-zoom]").forEach((z) => (z.style.transform = "none"));
      const style = doc.createElement("style");
      style.textContent = "img { display: inline-block; }";
      doc.head.appendChild(style);
      doc.querySelectorAll<HTMLElement>("[data-pdf-nudge]").forEach((n) => {
        n.style.position = "relative";
        n.style.top = `-${Number(n.dataset.pdfNudge) || 0.8}mm`;
      });
    },
  });
}

// Waits (up to `timeoutMs`) until a card front's photo has loaded or failed.
async function photoReady(front: HTMLElement, timeoutMs = 10000) {
  const until = Date.now() + timeoutMs;
  while (front.dataset.photoReady !== "true" && Date.now() < until) await new Promise((r) => setTimeout(r, 100));
}

// One PDF of CR80 pages -- front then back for each card, in order, ready
// for double-sided printing on a PVC card printer (print at 100%).
export async function cardsToPdf(
  cards: { front: HTMLElement; back: HTMLElement }[],
  meta: { title: string },
  onProgress?: (done: number, total: number) => void
) {
  await document.fonts?.ready;
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: [CARD_W, CARD_H], compress: true });
  for (let i = 0; i < cards.length; i++) {
    await photoReady(cards[i].front);
    for (const [j, face] of [cards[i].front, cards[i].back].entries()) {
      const canvas = await renderFace(face);
      if (i > 0 || j > 0) pdf.addPage([CARD_W, CARD_H], "landscape");
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, CARD_W, CARD_H);
    }
    onProgress?.(i + 1, cards.length);
  }
  pdf.setProperties({ title: meta.title, subject: "Student ID Cards (CR80)", author: "Akatsi College of Education", creator: "AKATSICO UMS" });
  return pdf;
}

export const openPdf = (pdf: jsPDF) => window.open(URL.createObjectURL(pdf.output("blob")), "_blank");

function AISIDCard({ data }: Props) {
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState<"" | "open" | "download">("");

  // Two-page PDF, each page exactly one CR80 card (front, then back), for a
  // PVC card printer or a print shop. Print it at 100% / "Actual size".
  const makePdf = async (mode: "open" | "download") => {
    if (!frontRef.current || !backRef.current) return;
    setBusy(mode);
    try {
      const pdf = await cardsToPdf([{ front: frontRef.current, back: backRef.current }], { title: `Student ID Card - ${fullName(data)}` });
      if (mode === "download") pdf.save(`AKATSICO-ID-${data?.id || "card"}.pdf`);
      else openPdf(pdf);
    } finally {
      setBusy("");
    }
  };

  const zoomBox = { width: `${CARD_W * PREVIEW_ZOOM}mm`, height: `${CARD_H * PREVIEW_ZOOM}mm` };
  const zoomInner: React.CSSProperties = { transform: `scale(${PREVIEW_ZOOM})`, transformOrigin: "top left" };

  return (
    <div className="w-full flex flex-col xl:flex-row gap-6">
      <section className="flex flex-col gap-5 overflow-x-auto">
        {[
          { label: "Front", node: <IDCardFront ref={frontRef} data={data} /> },
          { label: "Back", node: <IDCardBack ref={backRef} data={data} /> },
        ].map(({ label, node }) => (
          <div key={label} className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</span>
            <div style={zoomBox} className="relative rounded-[5mm] overflow-hidden shadow-xl shadow-slate-900/[0.15] ring-1 ring-slate-200">
              <div data-card-zoom style={zoomInner} className="absolute left-0 top-0">
                {node}
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="flex-1 flex flex-col gap-3 xl:max-w-xs">
        <button
          onClick={() => makePdf("open")}
          disabled={!!busy}
          className="h-12 rounded-full flex items-center gap-3 pl-1.5 pr-5 bg-secondary-accent/5 border border-secondary-accent/20 shadow disabled:opacity-60"
        >
          <HiOutlinePrinter className="text-secondary-accent h-9 w-9 p-1.5 bg-white border-2 border-secondary-accent/20 rounded-full" />
          <span className="font-semibold text-sm md:text-base text-secondary-accent">{busy === "open" ? "Preparing PDF ..." : "Open ID Card PDF"}</span>
        </button>
        <button
          onClick={() => makePdf("download")}
          disabled={!!busy}
          className="h-12 rounded-full flex items-center gap-3 pl-1.5 pr-5 bg-white border border-slate-200 shadow-sm disabled:opacity-60"
        >
          <HiOutlineArrowDownTray className="text-slate-600 h-9 w-9 p-1.5 bg-slate-50 border-2 border-slate-200 rounded-full" />
          <span className="font-semibold text-sm md:text-base text-slate-600">{busy === "download" ? "Preparing PDF ..." : "Download PDF"}</span>
        </button>
        <p className="text-xs leading-relaxed text-slate-400">
          Two pages, front then back, each exactly one standard PVC card (CR80, 85.6 × 54 mm). Print at <b>100% / Actual size</b>, double-sided, on a card
          printer.
        </p>
      </section>
    </div>
  );
}

export default AISIDCard;
