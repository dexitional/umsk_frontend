import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "../utils/authService";
import Logo from "../assets/img/logo.png";
import "./Guide.css";

type SectionId = "overview" | "ams" | "ais" | "fms" | "amsp" | "aisp" | "roles" | "faq";

const TITLES: Record<SectionId, [string, string, string]> = {
  overview: ["Guide", "Overview", "What the Unified Portal is and how its parts fit together."],
  ams: ["Admissions", "AMS — Admissions", "Vouchers, applicants, shortlisting, matriculation, and admission letters."],
  ais: ["Academics", "AIS — Academics", "Students, calendars, assessment, resits, and graduation."],
  fms: ["Finance", "FMS — Finance", "Bills, charges, payments, and financial reporting."],
  amsp: ["Self-service", "Applicant Portal", "The application experience, from voucher to submitted form."],
  aisp: ["Self-service", "Student Portal", "The enrolled student's self-service home."],
  roles: ["Reference", "Roles & Duties", "Every permission tag in the system and what it grants."],
  faq: ["Reference", "FAQ", "Common questions, answered."],
};

const img = (name: string) => `/guide/${name}.png`;

type Props = {};

// Same landing-page logic App.jsx uses for /dash and /login — a student or
// applicant clicking "Back to Portal" from the guide should return to their
// own home, not the staff dashboard they may not have access to.
function homePath(user: any) {
  if (user?.user?.group_id == 1) return "/aisp/profile";
  if (user?.user?.group_id == 3) return "/amsp/dash";
  return "/dash";
}

function Guide({}: Props) {
  const { user } = useUserStore((state: any) => state);
  const backTo = homePath(user);
  const [active, setActive] = useState<SectionId>(() => {
    const hash = (location.hash || "").replace("#", "");
    return (Object.keys(TITLES) as SectionId[]).includes(hash as SectionId) ? (hash as SectionId) : "overview";
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState<"all" | "ams" | "ais" | "fms">("all");
  const [faqQuery, setFaqQuery] = useState("");

  useEffect(() => {
    if (history.replaceState) history.replaceState(null, "", "#" + active);
    window.scrollTo({ top: 0 });
  }, [active]);

  const go = (id: SectionId) => {
    setActive(id);
    setSidebarOpen(false);
  };

  const [crumb, title, dek] = TITLES[active];
  const q = faqQuery.trim().toLowerCase();

  return (
    <div className="gd-page">
      <div className="gd-topbar">
        <div className="gd-brand"><img src={Logo} alt="AUCB" className="gd-mark" /> AUCB Portal Guide</div>
        <div className="gd-topbar-actions">
          <Link to={backTo} className="gd-back-link">← Back to Portal</Link>
          <button className="gd-burger" aria-label="Open menu" onClick={() => setSidebarOpen((s) => !s)}>☰</button>
        </div>
      </div>
      {sidebarOpen && <div className="gd-scrim" onClick={() => setSidebarOpen(false)} />}
      <div className="gd-app">
        <nav className={`gd-sidebar ${sidebarOpen ? "gd-open" : ""}`}>
          <div className="gd-sidebar-head">
            <div className="gd-brand">
              <img src={Logo} alt="AUCB" className="gd-mark" />
              <div>
                <div className="gd-name">AUCB Unified Portal</div>
                <div className="gd-sub">Operational Guide</div>
              </div>
            </div>
            <Link to={backTo} className="gd-back-link">← Back to Portal</Link>
          </div>

          <div className="gd-navgroup">
            <NavItem id="overview" active={active} onClick={go} label="Overview" />
          </div>

          <div className="gd-navgroup">
            <div className="gd-navlabel">Modules</div>
            <NavItem id="ams" active={active} onClick={go} label="Admissions (AMS)" />
            <NavItem id="ais" active={active} onClick={go} label="Academics (AIS)" />
            <NavItem id="fms" active={active} onClick={go} label="Finance (FMS)" />
          </div>

          <div className="gd-navgroup">
            <div className="gd-navlabel">Self-service</div>
            <NavItem id="amsp" active={active} onClick={go} label="Applicant Portal" />
            <NavItem id="aisp" active={active} onClick={go} label="Student Portal" />
          </div>

          <div className="gd-navgroup">
            <div className="gd-navlabel">Reference</div>
            <NavItem id="roles" active={active} onClick={go} label="Roles & Duties" />
            <NavItem id="faq" active={active} onClick={go} label="FAQ" />
          </div>

          <div className="gd-sidebar-foot">AUCB &middot; Unified Portal (ehub) &middot; Internal reference</div>
        </nav>

        <div className="gd-main">
          <header className="gd-pagehead">
            <div>
              <div className="gd-crumbs">{crumb}</div>
              <h1>{title}</h1>
              <div className="gd-dek">{dek}</div>
            </div>
          </header>

          <div className="gd-content">
            {active === "overview" && (
              <section className="gd-page-section gd-active">
                <p className="gd-lede">The Unified Portal is one login surface over three back-office systems — Admissions, Academics, and Finance — plus two self-service portals for applicants and students. This guide explains what each part does, who is allowed to do it, and how the pieces hand off to one another.</p>

                <div className="gd-stat-row">
                  <div className="gd-stat"><div className="gd-n">3</div><div className="gd-l">Staff modules</div></div>
                  <div className="gd-stat"><div className="gd-n">2</div><div className="gd-l">Self-service portals</div></div>
                  <div className="gd-stat"><div className="gd-n">60+</div><div className="gd-l">Distinct permission tags</div></div>
                  <div className="gd-stat"><div className="gd-n">1</div><div className="gd-l">Login, all systems</div></div>
                </div>

                <div className="gd-block">
                  <h2>How a person moves through the system</h2>
                  <div className="gd-block-dek">The same person can pass through all three back-office modules as their status changes — this is the spine the rest of the guide hangs off.</div>
                  <div className="gd-flow">
                    <div className="gd-node">Applicant applies (AMSP)</div><span className="gd-arrow">→</span>
                    <div className="gd-node">Shortlisted (AMS)</div><span className="gd-arrow">→</span>
                    <div className="gd-node">Admitted / Matriculated (AMS)</div><span className="gd-arrow">→</span>
                    <div className="gd-node">Active student (AIS)</div><span className="gd-arrow">→</span>
                    <div className="gd-node">Billed &amp; pays fees (FMS)</div><span className="gd-arrow">→</span>
                    <div className="gd-node">Graduates (AIS)</div>
                  </div>
                  <p>Once admitted, the same person also gets a Student Portal (AISP) login, and their financial record lives in FMS from that point forward — the three staff modules are not silos, they are stages of one lifecycle.</p>
                </div>

                <div className="gd-block">
                  <h2>The three modules, at a glance</h2>
                  <div className="gd-module-grid">
                    <div className="gd-module-chip"><div className="gd-mc-title">AMS — Admissions</div><div className="gd-mc-role">Vouchers, applicants, shortlisting, matriculation, admission letters</div></div>
                    <div className="gd-module-chip"><div className="gd-mc-title">AIS — Academics</div><div className="gd-mc-role">Students, courses, calendars, assessment, resits, graduation</div></div>
                    <div className="gd-module-chip"><div className="gd-mc-title">FMS — Finance</div><div className="gd-mc-role">Bills, charges, payments, receipts, debtors, financial reports</div></div>
                  </div>
                </div>

                <div className="gd-block">
                  <h2>Signing in</h2>
                  <p>Every user — staff, applicant, or student — signs in from the same landing page using one of three options: <b>Sign In with Staff Credentials</b> (username + password, for AMS/AIS/FMS staff), <b>Apply with Admission Voucher</b> (serial + PIN, for applicants), or <b>Sign In with Student Access</b> (student ID + password, for enrolled students). What you land on afterwards depends entirely on the permission tags attached to your account — see <LinkTo id="roles" onClick={go}>Roles &amp; Duties</LinkTo>.</p>
                </div>

                <div className="gd-callout gd-callout-note"><span className="gd-ic">Note</span><div>This guide mirrors each module's own navigation menu, so the section order here matches what you'll actually see in the sidebar once you're signed in with the matching role.</div></div>
              </section>
            )}

            {active === "ams" && (
              <section className="gd-page-section gd-active">
                <p className="gd-lede">Admissions runs the pipeline from a purchased voucher to a fully matriculated student: applicant intake, shortlisting, admission, and the letters and vouchers that go with it.</p>

                <div className="gd-block">
                  <div className="gd-eyebrow">Dashboard</div>
                  <h2>Admissions overview</h2>
                  <p>Landing page for every AMS user. Shows applicants / shortlisted / submitted / admitted counts for the active admission round, an admission funnel, voucher sales totals, applicants by gender and stage, and top programmes by applicant volume.</p>
                  <Shot name="ams-dash" alt="AMS dashboard" caption="AMS Dashboard — admission funnel, voucher sales, top programmes." />
                </div>

                <div className="gd-block">
                  <div className="gd-eyebrow">Workflow</div>
                  <h2>Applicant → Shortlist → Admission</h2>
                  <div className="gd-block-dek">The core admissions pipeline, in order.</div>
                  <ol className="gd-steps">
                    <li><div className="gd-step-body"><b>Voucher sold.</b> A voucher is issued (Voucher Module) with a serial and PIN, which the applicant uses to log into the Applicant Portal and start their form.</div></li>
                    <li><div className="gd-step-body"><b>Applicant completes the form.</b> Personal info, guardian, education, results, documents, and programme choice, tracked step-by-step in the Applicant Portal (see the <LinkTo id="amsp" onClick={go}>Applicant Portal</LinkTo> section). Staff can view progress from <b>Applicant Module</b> and open any applicant's record directly.</div></li>
                    <li><div className="gd-step-body"><b>Shortlisting.</b> Once submitted, a <code>shortlist::admin</code>/<code>shortlist::clerk</code> user reviews the application from <b>Shortlist Module</b> and shortlists qualifying applicants.</div></li>
                    <li><div className="gd-step-body"><b>Admission.</b> A <code>matriculant::clerk</code> user opens the shortlisted record and processes admission: choose programme, entry year, and session. This creates the student's account, institutional email, and billing record, and flips their status to Admitted — it cannot be undone from the screen, so the form asks for confirmation first.</div></li>
                    <li><div className="gd-step-body"><b>Admission letter.</b> Once admitted, the applicant (now a matriculant) can print their personalised admission letter, pulled from the letter template tied to their category and programme.</div></li>
                  </ol>
                </div>

                <div className="gd-block">
                  <div className="gd-eyebrow">Applicant Module &amp; Shortlist Module</div>
                  <h2>Reviewing an applicant</h2>
                  <p>Each applicant's record shows their full application form as a printable document — personal information, guardian details, education history, results, uploaded documents, and programme choices — exactly as the admissions committee would review it on paper.</p>
                  <div className="gd-shot-row">
                    <Shot name="ams-applicants" alt="AMS applicants list" caption="Applicant Module — searchable list, filterable by stage." />
                    <Shot name="ams-applicant-detail" alt="AMS applicant detail" caption="An applicant's full submitted form, ready for review." />
                  </div>
                  <div className="gd-shot-row">
                    <Shot name="ams-shortlists" alt="AMS shortlists list" caption="Shortlist Module — everyone shortlisted for the active round, admitted or not." />
                    <Shot name="ams-shortlist-detail" alt="AMS shortlist detail" caption="A shortlisted applicant's form, with their in-progress status." />
                  </div>
                </div>

                <div className="gd-block">
                  <div className="gd-eyebrow">Admitted Students</div>
                  <h2>Matriculant records &amp; admission letters</h2>
                  <p>Once admitted, a student's record shows their programme, level, and a live-rendered admission letter — the signature, signatory, and every placeholder (reference number, programme name, fees, session dates) are filled in from their actual record, not typed by hand.</p>
                  <Shot name="ams-matriculant-detail" alt="AMS matriculant detail" caption="Admitted Students — a matriculant's record with rendered admission letter." />
                </div>

                <div className="gd-block">
                  <div className="gd-eyebrow">Letters Module</div>
                  <h2>Letter templates</h2>
                  <p>Admission letters are built from reusable templates (one per category/programme group), edited with a rich-text editor. Type any placeholder below directly into the template text — each one resolves automatically to the actual student/programme/session data when the letter is printed, so the same template works for every student it applies to.</p>
                  <div className="gd-tablewrap">
                    <table>
                      <thead><tr><th>Placeholder</th><th className="gd-wrap">Resolves to</th></tr></thead>
                      <tbody>
                        <tr><td><code>::reference</code></td><td className="gd-wrap">The student's reference number (applicant serial / student ID).</td></tr>
                        <tr><td><code>::program_name</code></td><td className="gd-wrap">Programme name, lower-cased for use mid-sentence (e.g. "bachelor of arts in communication studies").</td></tr>
                        <tr><td><code>::program_name_big</code></td><td className="gd-wrap">Programme name exactly as stored, for headings (e.g. "BACHELOR OF ARTS IN COMMUNICATION STUDIES").</td></tr>
                        <tr><td><code>::admission_title</code></td><td className="gd-wrap">The admission round's title (e.g. "2026 September Admissions").</td></tr>
                        <tr><td><code>::cert_condition</code></td><td className="gd-wrap">The qualifying certificate condition for this applicant's entry type (e.g. "WASSCE Certificate").</td></tr>
                        <tr><td><code>::start_level</code></td><td className="gd-wrap">The entry level (100 / 200 / 300), derived from the student's starting semester.</td></tr>
                        <tr><td><code>::session_year</code></td><td className="gd-wrap">The academic session's year (e.g. "2026").</td></tr>
                        <tr><td><code>::register_start</code></td><td className="gd-wrap">Course registration opening date.</td></tr>
                        <tr><td><code>::register_end</code></td><td className="gd-wrap">Course registration closing date.</td></tr>
                        <tr><td><code>::orient_start</code></td><td className="gd-wrap">Orientation date.</td></tr>
                        <tr><td><code>::lecture_start</code></td><td className="gd-wrap">First day of lectures.</td></tr>
                        <tr><td><code>::medical_start</code></td><td className="gd-wrap">Medical screening opening date.</td></tr>
                        <tr><td><code>::medical_end</code></td><td className="gd-wrap">Medical screening closing date.</td></tr>
                        <tr><td><code>::matriculate_start</code></td><td className="gd-wrap">Matriculation date.</td></tr>
                        <tr><td><code>::payment_end</code></td><td className="gd-wrap">Fee payment deadline.</td></tr>
                        <tr><td><code>::fee_amount</code></td><td className="gd-wrap">The programme's fee, spelled out in words with the figure alongside (e.g. "One Thousand Six Hundred Cedis ( GH¢1600 )").</td></tr>
                        <tr><td><code>::discount_amount</code></td><td className="gd-wrap">The fee after the applicable discount is subtracted, same words-plus-figure format.</td></tr>
                        <tr><td><code>::bank_account</code> / <code>::account_name</code></td><td className="gd-wrap">The bank account name/number fees should be paid into (same value, two aliases).</td></tr>
                        <tr><td><code>::signature</code></td><td className="gd-wrap">The signatory's signature, inserted as an image.</td></tr>
                        <tr><td><code>::signatory</code></td><td className="gd-wrap">The signatory's name and title block (e.g. "Pius Kwame Agyekum (Mr.), Director, Academic Affairs").</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <Shot name="ams-letter-detail" alt="AMS letter template" caption="An admission letter template, with real signature and signatory." />
                </div>

                <div className="gd-block">
                  <div className="gd-eyebrow">Voucher Module</div>
                  <h2>Admission vouchers</h2>
                  <p>Vouchers are what applicants buy to unlock a serial + PIN and start an application. Staff can sell, recover (reassign), and reset vouchers here.</p>
                  <Shot name="ams-vouchers" alt="AMS vouchers" caption="Voucher Module — sale status and recovery." />
                </div>

                <div className="gd-block">
                  <div className="gd-eyebrow">System Reports</div>
                  <h2>Admissions reporting</h2>
                  <p>Modern, filterable report views for admissions data, with export — used for board reporting, marketing/agent performance, and reconciliation against voucher sales.</p>
                  <Shot name="ams-reports" alt="AMS reports" caption="System Reports — admissions analytics." />
                </div>

                <div className="gd-block">
                  <div className="gd-eyebrow">Also in this module</div>
                  <h2>Session Module &amp; Storage Tools</h2>
                  <p><b>Session Module</b> manages admission rounds (e.g. "2026 September Admissions") — their application windows, prefixes, and which one is currently active. <b>Storage Tools</b> is an admin utility that migrates legacy applicant photo/document blobs out of the database and onto disk.</p>
                </div>
              </section>
            )}

            {active === "ais" && (
              <section className="gd-page-section gd-active">
                <p className="gd-lede">Academics runs everything from the moment a student is active through to graduation: the academic calendar, course/programme structure, assessment, resits, deferments, and staff administration.</p>

                <div className="gd-block">
                  <div className="gd-eyebrow">Dashboard</div>
                  <h2>Academic overview</h2>
                  <p>Active/deferred/completed/graduated student counts, a student-population breakdown, the list of live academic sessions with registration counts, and top departments by enrolment.</p>
                  <Shot name="ais-dash" alt="AIS dashboard" caption="AIS Dashboard — student population and session registration status." />
                </div>

                <div className="gd-block">
                  <div className="gd-eyebrow">Academic Calendar</div>
                  <h2>Managing a semester</h2>
                  <p>Each calendar entry is one semester of one academic year, with every key date (orientation, registration, lectures, exams, medical screening, matriculation, fees deadline) and a set of one-time activation actions, plus two repeatable reminder actions.</p>
                  <ul className="gd-steps">
                    <li><div className="gd-step-body"><b>Activate Session</b> — marks this calendar as the currently active one for its stream.</div></li>
                    <li><div className="gd-step-body"><b>Progress Levels</b> — advances every active student to their next semester/level.</div></li>
                    <li><div className="gd-step-body"><b>Setup Scoresheets</b> — generates the assessment sheets lecturers will submit scores against.</div></li>
                    <li><div className="gd-step-body"><b>Activate Late Entries</b> — opens a grace window for late course registration.</div></li>
                    <li><div className="gd-step-body"><b>Registration Reminder</b> — texts every student who hasn't registered for this semester yet. GTEC requires registration each semester or the student risks automatic deferment; the button shows exactly how many students are affected before sending.</div></li>
                    <li><div className="gd-step-body"><b>Resit Reminder</b> — texts every student with an outstanding resit course from this semester that hasn't been registered or paid for, for the same GTEC-compliance reason.</div></li>
                  </ul>
                  <Shot name="ais-calendar-detail" alt="AIS calendar detail" caption="A semester's calendar, with the two reminder actions alongside the setup actions." />
                </div>

                <div className="gd-block">
                  <div className="gd-eyebrow">Student Module</div>
                  <h2>Student records</h2>
                  <p>Every enrolled student's full record — programme, level, contact info, guardian, academic and financial history — with tabs for profile, academic statement, finance statement, account management, and ID card printing.</p>
                  <div className="gd-shot-row">
                    <Shot name="ais-students" alt="AIS students list" caption="Student Module — searchable roster." />
                    <Shot name="ais-student-detail" alt="AIS student detail" caption="A single student's academic record." />
                  </div>
                </div>

                <div className="gd-block">
                  <div className="gd-eyebrow">Assessment Sheet &amp; Assessor Sheet</div>
                  <h2>Scores and grading</h2>
                  <p>Each course/semester gets an assessment sheet. Course lecturers (<code>mysheet::assessor</code>) enter scores on <b>Assessor Sheet</b>, submitted sheets are reviewed and published by registry/deans (<code>sheet::hod</code>, <code>sheet::dean</code>, <code>sheet::admin</code>) on <b>Assessment Sheet</b>. Publishing releases results to students; a separate reverse action lets a mistake be pulled back before publish.</p>
                  <Shot name="ais-sheets" alt="AIS assessment sheets" caption="Assessment Sheet — the score-capture and publish workflow." />
                </div>

                <div className="gd-block">
                  <div className="gd-eyebrow">Resit Session, Resit Module &amp; My Resits</div>
                  <h2>Handling resits</h2>
                  <p>A resit session groups all resit-eligible course registrations for a period. Course heads (<code>resit::assessor</code>) capture resit scores from <b>My Resits</b> — cards grouped by course, scoped to only the courses they're responsible for. Saving a score marks the resit "taken" and writes the score into the assessment table in one step.</p>
                  <Shot name="ais-resit-session-detail" alt="AIS resit session" caption="A resit session — registered courses and capture status." />
                </div>

                <div className="gd-block">
                  <div className="gd-eyebrow">Also in this module</div>
                  <h2>The rest of Academics</h2>
                  <div className="gd-module-grid">
                    <div className="gd-module-chip"><div className="gd-mc-title">Course / Program / Department / Faculty / Curriculum</div><div className="gd-mc-role">The academic structure everything else hangs off — course catalogue, degree programmes, and which department/faculty owns them.</div></div>
                    <div className="gd-module-chip"><div className="gd-mc-title">Progression / Registration / Evaluation Logs</div><div className="gd-mc-role">Audit trails of level progressions, course registrations, and course evaluations.</div></div>
                    <div className="gd-module-chip"><div className="gd-mc-title">Backlog Module</div><div className="gd-mc-role">Tracks outstanding/failed courses a student still needs to clear.</div></div>
                    <div className="gd-module-chip"><div className="gd-mc-title">Graduation Session / Module / Logs</div><div className="gd-mc-role">Manages a graduating cohort end-to-end — eligibility checks, clean-list, certificate printing.</div></div>
                    <div className="gd-module-chip"><div className="gd-mc-title">Transwift Module</div><div className="gd-mc-role">Transcript and document-request processing for students and alumni.</div></div>
                    <div className="gd-module-chip"><div className="gd-mc-title">Deferment Module</div><div className="gd-mc-role">Records and manages student deferrals from a semester or programme.</div></div>
                    <div className="gd-module-chip"><div className="gd-mc-title">Circular Module</div><div className="gd-mc-role">Broadcast notices to students and staff.</div></div>
                    <div className="gd-module-chip"><div className="gd-mc-title">Staff / Job / Unit Module</div><div className="gd-mc-role">HR administration — staff records, job titles, organisational units.</div></div>
                    <div className="gd-module-chip"><div className="gd-mc-title">User Roles</div><div className="gd-mc-role">Assigns the permission tags documented in <LinkTo id="roles" onClick={go}>Roles &amp; Duties</LinkTo> to staff accounts.</div></div>
                  </div>
                </div>
              </section>
            )}

            {active === "fms" && (
              <section className="gd-page-section gd-active">
                <p className="gd-lede">Finance tracks every cedi owed and paid: mass fee bills, one-off charges, payments and receipts, and the running balance behind every student.</p>

                <div className="gd-block">
                  <div className="gd-eyebrow">Dashboard</div>
                  <h2>Collections overview</h2>
                  <p>Today / this week / this month / this year collection totals, a revenue mix by payment type, and a month-by-month breakdown across every payment category — academic fees, vouchers, resits, graduation, transcripts, and more.</p>
                  <Shot name="fms-dash" alt="FMS dashboard" caption="FMS Dashboard — collections and revenue mix." />
                </div>

                <div className="gd-block">
                  <div className="gd-eyebrow">Workflow</div>
                  <h2>Publish a fee bill for a session</h2>
                  <ol className="gd-steps">
                    <li><div className="gd-step-body">Open <b>Student Bills</b> → Create. Set title, currency, amount, discount, student category (Ghanaian / International), payment quota, target programme, target session, and bank account.</div></li>
                    <li><div className="gd-step-body">Open the new bill's <b>Actions</b> tab and click <b>Publish Bill</b> to activate it against its target group — or use <b>Attach To Student</b> to bill someone individually.</div></li>
                    <li><div className="gd-step-body">Check the <b>Receivers</b> tab to confirm who was billed, and <b>Activity</b> for a history of publish events (amount, discount, recipient counts).</div></li>
                    <li><div className="gd-step-body">If needed, <b>Revoke Bill</b> un-publishes it, or <b>Remove From Student</b> detaches one student.</div></li>
                  </ol>
                  <Shot name="fms-bills" alt="FMS bills" caption="Student Bills — every fee bill, published or pending." />
                </div>

                <div className="gd-block">
                  <div className="gd-eyebrow">Fees Payments &amp; Other Payments</div>
                  <h2>Recording a payment</h2>
                  <p><b>Fees Payments</b> records academic fee payments against a student's bill — student ID, amount, bank transaction ID, and reference — and produces a two-page printable official receipt. <b>Other Payments</b> uses the same form for non-fee transactions: graduation, resit, late fine, English proficiency, attestation, and transcript fees, distinguished by payment type.</p>
                  <Shot name="fms-payments" alt="FMS payments" caption="Fees Payments — every payment received, with printable receipts." />
                </div>

                <div className="gd-block">
                  <div className="gd-eyebrow">Student Accounts &amp; Student Debtors</div>
                  <h2>Balances and statements</h2>
                  <p>Every student's running ledger — bills, charges, and payments in one chronological table, ending in a net debt/balance figure. From here staff can <b>retire</b> (zero out) a resolved balance or <b>charge a late-registration fine</b>. <b>Student Debtors</b> is the filtered view of who currently owes money, for follow-up.</p>
                  <div className="gd-shot-row">
                    <Shot name="fms-accounts" alt="FMS accounts" caption="Student Accounts — balances at a glance." />
                    <Shot name="fms-debtors" alt="FMS debtors" caption="Student Debtors — who to follow up with." />
                  </div>
                </div>

                <div className="gd-block">
                  <div className="gd-eyebrow">Also in this module</div>
                  <h2>Configuration &amp; reporting</h2>
                  <div className="gd-module-grid">
                    <div className="gd-module-chip"><div className="gd-mc-title">Student Charges</div><div className="gd-mc-role">Ad-hoc charges outside a mass bill — fees, fines, graduation, resit.</div></div>
                    <div className="gd-module-chip"><div className="gd-mc-title">Voucher Sales</div><div className="gd-mc-role">Read-only log of admission voucher purchases.</div></div>
                    <div className="gd-module-chip"><div className="gd-mc-title">Voucher Prices &amp; Service Costs</div><div className="gd-mc-role">Set the price of admission vouchers and priced services (e.g. transcript fee).</div></div>
                    <div className="gd-module-chip"><div className="gd-mc-title">System Reports</div><div className="gd-mc-role">Filterable exports for periodic financial reporting and reconciliation.</div></div>
                  </div>
                  <div className="gd-callout gd-callout-note"><span className="gd-ic">Naming note</span><div>The <b>Voucher Sales</b> menu item and the backend's <code>/vsales</code> endpoint refer to two different things internally (a legacy naming carry-over) — the actual voucher-sales data comes from a separate endpoint. Doesn't affect how the screen works, just a heads-up if you're ever cross-referencing with the API.</div></div>
                </div>
              </section>
            )}

            {active === "amsp" && (
              <section className="gd-page-section gd-active">
                <p className="gd-lede">Where an applicant fills out and submits their own application, from the serial and PIN on their voucher through to a printable submitted form.</p>

                <div className="gd-block">
                  <div className="gd-eyebrow">Signing in</div>
                  <h2>Voucher login</h2>
                  <p>An applicant signs in with <b>Apply with Admission Voucher</b> using the serial and PIN printed on their voucher. This lands them on the portal's welcome screen, which shows whether applications are currently open and the submission deadline.</p>
                  <Shot name="amsp-dash" alt="AMSP welcome" caption="Applicant Portal — welcome screen with the application deadline." />
                </div>

                <div className="gd-block">
                  <div className="gd-eyebrow">Workflow</div>
                  <h2>Completing an application</h2>
                  <ol className="gd-steps">
                    <li><div className="gd-step-body">Upload a photo, choose admission group and application type, then step through the form: <b>Personal Information</b>, <b>Guardian Information</b>, <b>Education History</b>, <b>Results</b>, <b>Supporting Documents</b>, <b>Programme Choice</b>, and — where applicable — <b>Employment</b> and <b>Referees</b>.</div></li>
                    <li><div className="gd-step-body">Each step saves independently, so an applicant can leave and come back without losing progress.</div></li>
                    <li><div className="gd-step-body">The <b>Review</b> step shows the entire form as it will be submitted, with an edit link back to any section.</div></li>
                    <li><div className="gd-step-body">Clicking <b>Finalize Application to Complete</b> submits it for shortlisting — after this, editing is locked.</div></li>
                  </ol>
                  <Shot name="amsp-profile" alt="AMSP profile step" caption="Personal Information — the first step of the application." />
                </div>

                <div className="gd-block">
                  <div className="gd-eyebrow">Review &amp; print</div>
                  <h2>The submitted form</h2>
                  <p>At any point, the applicant can print their form exactly as staff will see it during shortlisting — useful for checking everything was entered correctly before submitting.</p>
                  <Shot name="amsp-review" alt="AMSP review" caption="Review — the full application, ready to finalize." />
                </div>
              </section>
            )}

            {active === "aisp" && (
              <section className="gd-page-section gd-active">
                <p className="gd-lede">The enrolled student's self-service home: profile, fees, registration, results, and a few academic services, all from one dashboard.</p>

                <div className="gd-block">
                  <div className="gd-eyebrow">Dashboard</div>
                  <h2>Student Portal home</h2>
                  <p>A card-based landing page linking to every self-service action: My Profile, Fees &amp; Charges, Course Registration, Academic Results, Service Requests, Course Evaluation, Elections Portal, and Change Password — plus a printable semester registration slip and any active notices.</p>
                  <Shot name="aisp-dash" alt="AISP dashboard" caption="Student Portal — the self-service home." />
                </div>

                <div className="gd-block">
                  <div className="gd-eyebrow">Fees &amp; Charges</div>
                  <h2>Checking a balance</h2>
                  <p>Shows the same ledger finance staff see on the FMS side — every bill, charge, and payment against the student — so a student can check their balance before registering or graduating without contacting the finance office.</p>
                  <Shot name="aisp-fees" alt="AISP fees" caption="Fees & Charges — the student's own statement." />
                </div>

                <div className="gd-block">
                  <div className="gd-eyebrow">Academic Results</div>
                  <h2>Viewing results</h2>
                  <p>Once a course's assessment sheet is published (see <LinkTo id="ais" onClick={go}>Academics — Assessment Sheet</LinkTo>), the result appears here automatically — nothing further needed from the student.</p>
                  <Shot name="aisp-results" alt="AISP results" caption="Academic Results — published grades." />
                </div>

                <div className="gd-block">
                  <div className="gd-eyebrow">Also on this portal</div>
                  <h2>The rest of the Student Portal</h2>
                  <p><b>Course Registration</b> lets a student register for the active semester (see the Registration Reminder in <LinkTo id="ais" onClick={go}>Academics</LinkTo> for what happens if this is skipped). <b>Service Requests</b> covers transcript and document requests. <b>Course Evaluation</b> collects end-of-semester feedback. <b>Elections Portal</b> links out to student elections when running.</p>
                </div>
              </section>
            )}

            {active === "roles" && (
              <section className="gd-page-section gd-active">
                <p className="gd-lede">Access is granted per feature, not per module — a person can hold any combination of these tags. Every tag follows the same shape: <code>feature::level</code> (e.g. <code>bill::admin</code>). "-ug" / "-pg" suffixes scope a tag to undergraduate or postgraduate records only.</p>

                <div className="gd-role-filter">
                  <button className={roleFilter === "all" ? "gd-active" : ""} onClick={() => setRoleFilter("all")}>All modules</button>
                  <button className={roleFilter === "ams" ? "gd-active" : ""} onClick={() => setRoleFilter("ams")}>Admissions (AMS)</button>
                  <button className={roleFilter === "ais" ? "gd-active" : ""} onClick={() => setRoleFilter("ais")}>Academics (AIS)</button>
                  <button className={roleFilter === "fms" ? "gd-active" : ""} onClick={() => setRoleFilter("fms")}>Finance (FMS)</button>
                </div>

                {(roleFilter === "all" || roleFilter === "ams") && (
                  <div className="gd-block">
                    <h2>Admissions (AMS) roles</h2>
                    <div className="gd-tablewrap">
                      <table>
                        <thead><tr><th>Tag</th><th className="gd-wrap">Grants</th></tr></thead>
                        <tbody>
                          <tr><td><code>applicant::admin-ug</code> / <code>-pg</code></td><td className="gd-wrap">Full applicant management for that category: view, create, edit, and shortlist applicants.</td></tr>
                          <tr><td><code>applicant::clerk-ug</code> / <code>-pg</code></td><td className="gd-wrap">View-only access to applicants in that category.</td></tr>
                          <tr><td><code>shortlist::admin-ug</code> / <code>-pg</code></td><td className="gd-wrap">Full shortlist management: view, create, process (admit), reverse.</td></tr>
                          <tr><td><code>shortlist::clerk-ug</code> / <code>-pg</code></td><td className="gd-wrap">View-only access to the shortlist.</td></tr>
                          <tr><td><code>matriculant::clerk-ug</code> / <code>-pg</code></td><td className="gd-wrap">Process admissions and manage matriculant (admitted student) records for that category.</td></tr>
                          <tr><td><code>session::admin</code></td><td className="gd-wrap">Manage admission sessions/rounds.</td></tr>
                          <tr><td><code>voucher::admin</code></td><td className="gd-wrap">Full voucher management: create, sell, recover, reset.</td></tr>
                          <tr><td><code>voucher::clerk</code></td><td className="gd-wrap">View and process voucher sales, no configuration access.</td></tr>
                          <tr><td><code>aletter::admin</code></td><td className="gd-wrap">Create and edit admission letter templates.</td></tr>
                          <tr><td><code>admreport::admin</code></td><td className="gd-wrap">Generate admissions system reports.</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {(roleFilter === "all" || roleFilter === "ais") && (
                  <div className="gd-block">
                    <h2>Academics (AIS) roles</h2>
                    <div className="gd-tablewrap">
                      <table>
                        <thead><tr><th>Tag</th><th className="gd-wrap">Grants</th></tr></thead>
                        <tbody>
                          <tr><td><code>calendar::admin</code></td><td className="gd-wrap">Full calendar/session management, including activation and the SMS reminder actions.</td></tr>
                          <tr><td><code>student::admin</code></td><td className="gd-wrap">Full student record management, including deletion.</td></tr>
                          <tr><td><code>student::registry</code></td><td className="gd-wrap">Edit student records; view finance.</td></tr>
                          <tr><td><code>student::finance</code></td><td className="gd-wrap">View a student's finance statement only.</td></tr>
                          <tr><td><code>student::clerk</code></td><td className="gd-wrap">View-only student access.</td></tr>
                          <tr><td><code>sheet::admin</code></td><td className="gd-wrap">Full assessment sheet lifecycle: create, upload, publish, reverse.</td></tr>
                          <tr><td><code>sheet::dean</code></td><td className="gd-wrap">Publish assessment sheets.</td></tr>
                          <tr><td><code>sheet::hod</code></td><td className="gd-wrap">Reverse and assign assessment sheets for their department.</td></tr>
                          <tr><td><code>sheet::pg-registry</code> / <code>ug-registry</code></td><td className="gd-wrap">Upload, reverse, and assign sheets for that category.</td></tr>
                          <tr><td><code>mysheet::assessor</code></td><td className="gd-wrap">Enter and submit scores for courses they teach (My Sheets).</td></tr>
                          <tr><td><code>resit::admin</code></td><td className="gd-wrap">Full resit session management: create sessions, close/publish, assign.</td></tr>
                          <tr><td><code>resit::assessor</code></td><td className="gd-wrap">Capture resit scores for their own courses (My Resits).</td></tr>
                          <tr><td><code>resit::clerk</code></td><td className="gd-wrap">Assign resit courses; view-only otherwise.</td></tr>
                          <tr><td><code>program::admin</code></td><td className="gd-wrap">Manage programmes, departments, faculties, and programme changes.</td></tr>
                          <tr><td><code>curriculum::admin</code></td><td className="gd-wrap">Manage curriculum structures.</td></tr>
                          <tr><td><code>course::admin</code></td><td className="gd-wrap">Manage the course catalogue.</td></tr>
                          <tr><td><code>scheme::admin</code></td><td className="gd-wrap">Manage grading/fee schemes.</td></tr>
                          <tr><td><code>backlog::admin</code></td><td className="gd-wrap">Manage student backlogs (outstanding failed courses).</td></tr>
                          <tr><td><code>deferment::admin</code></td><td className="gd-wrap">Full deferment management.</td></tr>
                          <tr><td><code>deferment::clerk</code></td><td className="gd-wrap">Create and edit deferments.</td></tr>
                          <tr><td><code>graduation::admin</code></td><td className="gd-wrap">Full graduation session management, imports, and clean-list.</td></tr>
                          <tr><td><code>graduation::registry</code></td><td className="gd-wrap">Print certificates.</td></tr>
                          <tr><td><code>graduation::clerk</code></td><td className="gd-wrap">Publish graduation actions.</td></tr>
                          <tr><td><code>transwift::admin</code></td><td className="gd-wrap">Manage transcript/document requests.</td></tr>
                          <tr><td><code>transwift::clerk</code></td><td className="gd-wrap">Trigger transwift processing.</td></tr>
                          <tr><td><code>sletter::admin</code></td><td className="gd-wrap">Manage academic (service) letter templates.</td></tr>
                          <tr><td><code>circular::admin</code></td><td className="gd-wrap">Send circulars/notices.</td></tr>
                          <tr><td><code>circular::clerk</code></td><td className="gd-wrap">Create circulars.</td></tr>
                          <tr><td><code>hrm::admin</code></td><td className="gd-wrap">Manage staff, jobs, units, and assign user roles.</td></tr>
                          <tr><td><code>logs::admin</code></td><td className="gd-wrap">Delete progression/registration/evaluation log entries.</td></tr>
                          <tr><td><code>acareport::admin</code></td><td className="gd-wrap">Generate academic system reports.</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {(roleFilter === "all" || roleFilter === "fms") && (
                  <div className="gd-block">
                    <h2>Finance (FMS) roles</h2>
                    <div className="gd-tablewrap">
                      <table>
                        <thead><tr><th>Tag</th><th className="gd-wrap">Grants</th></tr></thead>
                        <tbody>
                          <tr><td><code>dashboard::clerk</code></td><td className="gd-wrap">View the finance dashboard.</td></tr>
                          <tr><td><code>bill::admin</code></td><td className="gd-wrap">Full bill management: create, edit, delete, publish/revoke, attach/detach students.</td></tr>
                          <tr><td><code>bill::clerk</code></td><td className="gd-wrap">View-only: bills, activity, receivers.</td></tr>
                          <tr><td><code>charge::admin</code></td><td className="gd-wrap">Full charge management: create, edit, delete.</td></tr>
                          <tr><td><code>charge::clerk</code></td><td className="gd-wrap">View-only charges.</td></tr>
                          <tr><td><code>account::admin</code></td><td className="gd-wrap">View accounts, retire balances, charge late-registration fines.</td></tr>
                          <tr><td><code>account::clerk</code></td><td className="gd-wrap">View-only student accounts.</td></tr>
                          <tr><td><code>debtor::clerk</code></td><td className="gd-wrap">View-only debtors list.</td></tr>
                          <tr><td><code>payment::admin</code></td><td className="gd-wrap">Record, edit, delete, and convert fee payments.</td></tr>
                          <tr><td><code>payment::clerk</code></td><td className="gd-wrap">View-only fee payments.</td></tr>
                          <tr><td><code>transaction::admin</code></td><td className="gd-wrap">Record, edit, delete, and convert non-fee ("other") payments.</td></tr>
                          <tr><td><code>transaction::clerk</code></td><td className="gd-wrap">View-only other payments.</td></tr>
                          <tr><td><code>vsale::clerk</code></td><td className="gd-wrap">View-only voucher sales.</td></tr>
                          <tr><td><code>vprice::admin</code></td><td className="gd-wrap">Manage voucher prices.</td></tr>
                          <tr><td><code>vprice::clerk</code></td><td className="gd-wrap">View-only voucher prices.</td></tr>
                          <tr><td><code>scost::admin</code></td><td className="gd-wrap">Manage service costs.</td></tr>
                          <tr><td><code>scost::clerk</code></td><td className="gd-wrap">View-only service costs.</td></tr>
                          <tr><td><code>finreport::admin</code></td><td className="gd-wrap">Generate financial system reports.</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="gd-callout gd-callout-note"><span className="gd-ic">Note</span><div>Applicants and students don't hold any of these tags — their access comes entirely from being signed in as themselves; each self-service screen only ever shows their own record.</div></div>
              </section>
            )}

            {active === "faq" && (
              <section className="gd-page-section gd-active">
                <p className="gd-lede">Answers to the questions that come up most across all three modules.</p>

                <div className="gd-search-box">
                  <span className="gd-si">⌕</span>
                  <input type="text" placeholder="Search the FAQ…" value={faqQuery} onChange={(e) => setFaqQuery(e.target.value)} />
                </div>

                <FaqGroup title="Accounts & access" query={q} items={[
                  ["I signed in but see \"Access denied\" or an empty menu — why?", "Your account has no permission tags for that area yet. Each menu item and page only appears for the specific tag(s) listed in Roles & Duties — ask whoever holds hrm::admin to assign the ones you need."],
                  ["Does my username need to match exactly, including capitalisation?", "No — sign-in is case-insensitive, so MKOFI and mkofi both work. Stray leading/trailing spaces (easy to introduce when copy-pasting) are trimmed automatically too."],
                  ["An applicant/student can't get past the login screen — what usually causes this?", "Almost always a wrong serial/PIN (applicants) or ID/password (students) pair, or a voucher/account that hasn't been issued yet. If credentials are confirmed correct and it still fails, it's worth checking that the account genuinely exists in that role's underlying table before assuming it's a permissions issue."],
                  ["Can one person be both a staff member and a student?", "Yes — staff and student accounts are separate logins even for the same person (e.g. a graduate assistant who is also enrolled). Use the appropriate sign-in option for what you're trying to do."],
                ]} />

                <FaqGroup title="Admissions" query={q} items={[
                  ["Why can't I admit a shortlisted applicant?", "The Admit form now shows a specific reason instead of a generic error — most commonly: the applicant hasn't completed Personal Information or Guardian Information, their phone number is missing, no fee bill has been configured for the chosen programme/year/session, or the applicant's admission round has no academic session linked to it (common for very old, no-longer-active admission rounds). The message tells you exactly which one it is."],
                  ["I admitted someone by mistake — can I undo it?", "Not from the Admit screen — re-running admission on an already-admitted applicant is blocked specifically because it would reset their student account password. Undoing a real admission needs a direct data correction; treat the confirmation dialog on the Admit button as final."],
                  ["An admission letter is showing a blank signature or signatory — how do I fix it?", "This was a known issue with letters carrying an old, differently-hosted file reference and has been fixed — the signature image and signatory text should now render correctly on every letter. If you still see it blank on a specific letter, that's worth flagging directly rather than assuming it's expected."],
                  ["The \"View Document\" link on a printed application form doesn't open anything — is that expected?", "No, and this has also been fixed for documents uploaded through the current system. It can still happen for a small number of very old, pre-migration document records whose original files were never copied into this environment — those are effectively unrecoverable, not a live bug."],
                ]} />

                <FaqGroup title="Academics" query={q} items={[
                  ["Who actually receives the Registration/Resit Reminder SMS, and can I preview the list first?", "Clicking either button first shows you the exact recipient count in a confirmation dialog before anything is sent — nothing goes out until you confirm. Registration Reminder targets everyone with no course registration for that specific semester; Resit Reminder targets students with a resit course from that semester that's neither registered nor taken (deduplicated, so one text per student even with multiple outstanding courses)."],
                  ["Why does My Resits only show some courses and not others?", "My Resits is scoped to the courses you're personally responsible for as an assessor (resit::assessor) — it's not a full resit roster. resit::admin sees everything via the Resit Session/Resit Module screens instead."],
                  ["A student says their results aren't showing — what's the usual cause?", "Results only appear on the Student Portal once the course's assessment sheet has been published (Assessment Sheet module). If a sheet is still in draft, submitted-but-unpublished, or was reversed, the student won't see anything yet — check the sheet's status before assuming it's a display bug."],
                ]} />

                <FaqGroup title="Finance" query={q} items={[
                  ["A student paid but their balance hasn't updated — what do I check first?", "Confirm the payment was recorded against the correct Student ID on Fees Payments (not Other Payments — those are separate categories, e.g. graduation or resit fees, and won't touch the academic fee balance). Then check the student's statement on Student Accounts for the actual ledger entry."],
                  ["What's the difference between retiring an account and just letting the balance sit?", "Retire zeroes out a balance permanently (e.g. a written-off or resolved-outside-the-system debt) — it's a one-way action, not a payment. Use it only when you're certain the balance shouldn't be collected, not as a way to \"clear\" something you plan to revisit."],
                  ["Where do I find a printable receipt for a payment?", "Open the payment from Fees Payments (or Other Payments) — its detail page is the two-page official receipt itself, with a Print button."],
                ]} />

                <footer className="gd-page-end">Can't find an answer here? The behaviour described throughout this guide reflects the system as currently deployed — if something doesn't match what you're seeing, it's worth confirming directly rather than assuming the guide is wrong.</footer>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ id, active, onClick, label }: { id: SectionId; active: SectionId; onClick: (id: SectionId) => void; label: string }) {
  return (
    <button className={`gd-navitem ${active === id ? "gd-active" : ""}`} onClick={() => onClick(id)}>
      <span className="gd-dot"></span>{label}
    </button>
  );
}

function LinkTo({ id, onClick, children }: { id: SectionId; onClick: (id: SectionId) => void; children: React.ReactNode }) {
  return (
    <a href={`#${id}`} onClick={(e) => { e.preventDefault(); onClick(id); }}>{children}</a>
  );
}

function Shot({ name, alt, caption }: { name: string; alt: string; caption: string }) {
  return (
    <figure className="gd-shot">
      <img src={img(name)} alt={alt} loading="lazy" />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

function FaqGroup({ title, items, query }: { title: string; items: [string, string][]; query: string }) {
  const filtered = items.filter(([q, a]) => !query || (q + " " + a).toLowerCase().includes(query));
  if (!filtered.length) return null;
  return (
    <div className="gd-faq-group">
      <h2>{title}</h2>
      {filtered.map(([q, a], i) => (
        <details className="gd-faq" key={i} open={!!query}>
          <summary>{q}</summary>
          <div className="gd-faq-a"><p>{a}</p></div>
        </details>
      ))}
    </div>
  );
}

export default Guide;
