import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineEye, HiOutlinePencilSquare } from "react-icons/hi2";
import RichHtmlField from "../../components/ais/RichHtmlField";
import { useLoaderData, useNavigate } from "react-router-dom";
import AdmissionLetterSheet from "../../components/ais/admission/AdmissionLetterSheet";
import Service from "../../utils/aisService";
import { ADMISSION_PLACEHOLDERS, defaultLetterTemplate } from "../../utils/util";

// Create / edit an admission letter template. Templates are tied to a
// programme (category UG by default) and use ::tokens filled per student.
export async function loader({ params }) {
  const [programs, sessions, letter] = await Promise.all([
    Service.fetchProgramList(),
    Service.fetchSessionList(),
    params.letterId ? Service.fetchAdmissionLetter(params.letterId) : null,
  ]);
  return { programs: Array.isArray(programs) ? programs : [], session: (sessions || []).find((s: any) => s.default) || null, letter };
}

const CATEGORIES = [
  { value: "UG", label: "Undergraduate (UG)" },
  { value: "DP", label: "Diploma (DP)" },
  { value: "CP", label: "Certificate (CP)" },
  { value: "PG", label: "Postgraduate (PG)" },
];

function PgAISAdmissionLetterForm() {
  const { programs, session, letter }: any = useLoaderData();
  const navigate = useNavigate();
  const [category, setCategory] = useState(letter?.category || "UG");
  const [programId, setProgramId] = useState(letter?.programId || "");
  const [title, setTitle] = useState(letter?.title || "");
  const [status, setStatus] = useState(letter ? !!letter.status : true);
  const [signature, setSignature] = useState(letter?.signature || "");
  const [signatory, setSignatory] = useState(letter?.signatory || "");
  const [template, setTemplate] = useState(letter?.template || "");
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  const options = programs.filter((p: any) => p.category === category || p.id === programId);
  const program = programs.find((p: any) => p.id === programId);
  const sample = useMemo(
    () => ({ id: "26010001", indexno: "", fname: "Ama", mname: "Serwaa", lname: "Mensah", gender: "F", semesterNum: 1, address: "P. O. Box 1, Akatsi", hometown: "Akatsi", phone: "0240000000", title: { label: "Miss" }, program: program || { longName: "Programme name" } }),
    [program]
  );

  const pickSignature = async (e: any) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.match("image.*")) return toast.error("Please choose an image file for the signature.");
    if (f.size > 2 * 1024 * 1024) return toast.error("Signature image is too large (max 2 MB).");
    setSignature(await Service.convertBase64(f));
  };

  const save = async (e: any) => {
    e.preventDefault();
    if (!programId) return toast.error("Choose a programme.");
    if (!signature) return toast.error("Upload a signature image.");
    setSaving(true);
    const resp = await Service.saveAdmissionLetter(letter?.id, { category, programId, title, status, signature, signatory, template });
    setSaving(false);
    if (resp) navigate("/ais/admission-letters");
  };

  const copyToken = (t: string) => {
    navigator.clipboard?.writeText(t);
    toast.success(`${t} copied`);
  };

  const field = "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-primary/40 focus:ring-0";

  return (
    <form onSubmit={save} className="md:pl-10 p-4 md:p-6 space-y-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-800 md:text-xl">{letter ? "Edit" : "New"} Admission Letter</h1>
          <p className="text-xs text-slate-400">The active letter of a programme is printed for its newly admitted first years.</p>
        </div>
        <button type="button" onClick={() => setPreview((v) => !v)} className="flex items-center gap-1.5 self-start rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
          {preview ? <HiOutlinePencilSquare className="h-4 w-4" /> : <HiOutlineEye className="h-4 w-4" />} {preview ? "Back to editing" : "Preview with sample student"}
        </button>
      </div>

      {preview ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <AdmissionLetterSheet letter={{ title, signature, signatory, template }} session={session} student={sample} />
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-3">
          <div className="space-y-5 xl:col-span-2">
            <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-2 md:p-5">
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Category</span>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={field}>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Programme</span>
                <select value={programId} onChange={(e) => setProgramId(e.target.value)} required className={field}>
                  <option value="" disabled>
                    -- Choose programme --
                  </option>
                  {options.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.longName || p.shortName}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1.5 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Title</span>
                <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. 2026/2027 Undergraduate Admission" className={field} />
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" checked={status} onChange={(e) => setStatus(e.target.checked)} className="rounded border-slate-300 text-primary focus:ring-primary/30" />
                Active (printed for this programme)
              </label>
            </section>

            <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <label className="flex-1 space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Signature image</span>
                  <input type="file" accept="image/*" onChange={pickSignature} className={field} />
                </label>
                <div className="flex h-16 w-44 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50">
                  {signature ? <img src={signature} className="h-14 object-contain" alt="Signature" /> : <span className="text-xs text-slate-400">No signature</span>}
                </div>
              </div>
              <RichHtmlField labelClassName="text-xs font-semibold uppercase tracking-wider text-slate-500" label="Signatory" value={signatory} onChange={setSignatory} placeholder="Name, title (e.g. Registrar)" rows={4} />
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
              <RichHtmlField
                label="Letter template"
                labelClassName="text-xs font-semibold uppercase tracking-wider text-slate-500"
                value={template}
                onChange={setTemplate}
                rows={22}
                editorClassName="[&_.ql-editor]:min-h-[22rem]"
                action={
                  !template?.replace(/<[^>]*>/g, "").trim() ? (
                    <button type="button" onClick={() => setTemplate(defaultLetterTemplate)} className="text-xs font-semibold text-primary hover:underline">
                      Use sample template
                    </button>
                  ) : null
                }
              />
            </section>
          </div>

          <aside className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 xl:sticky xl:top-4 xl:self-start">
            <h2 className="text-sm font-semibold text-slate-700">Placeholders</h2>
            <p className="text-xs text-slate-400">Type these into the template; each is replaced with the student's details. Click to copy.</p>
            <div className="max-h-[32rem] space-y-1 overflow-auto pr-1">
              {ADMISSION_PLACEHOLDERS.map(([token, label]) => (
                <button type="button" key={token} onClick={() => copyToken(token)} className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1 text-left hover:bg-slate-50">
                  <code className="text-xs text-primary">{token}</code>
                  <span className="truncate text-[0.7rem] text-slate-400">{label}</span>
                </button>
              ))}
            </div>
          </aside>
        </div>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark disabled:opacity-60">
          {saving ? "Saving…" : "Save letter"}
        </button>
        <button type="button" onClick={() => navigate("/ais/admission-letters")} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default PgAISAdmissionLetterForm;
