import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "../utils/authService";
import Logo from "../assets/img/logo.webp";
import "./Guide.css";

type SectionId = "overview" | "ais" | "fms" | "aisp" | "roles" | "faq";

const TITLES: Record<SectionId, [string, string, string]> = {
  overview: ["Guide", "Overview", "What the Unified Portal is and how its parts fit together."],
  ais: ["Academics", "AIS — Academics", "Students, calendars, assessment, resits, and graduation."],
  fms: ["Finance", "FMS — Finance", "Bills, charges, payments, and financial reporting."],
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
  const [roleFilter, setRoleFilter] = useState<"all" | "ais" | "fms">("all");
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
        <div className="gd-brand"><img src={Logo} alt="AKATSICO" className="gd-mark" /> AKATSICO Portal Guide</div>
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
              <img src={Logo} alt="AKATSICO" className="gd-mark" />
              <div>
                <div className="gd-name">AKATSICO Unified Portal</div>
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
            <NavItem id="ais" active={active} onClick={go} label="Academics (AIS)" />
            <NavItem id="fms" active={active} onClick={go} label="Finance (FMS)" />
          </div>

          <div className="gd-navgroup">
            <div className="gd-navlabel">Self-service</div>
            <NavItem id="aisp" active={active} onClick={go} label="Student Portal" />
          </div>

          <div className="gd-navgroup">
            <div className="gd-navlabel">Reference</div>
            <NavItem id="roles" active={active} onClick={go} label="Roles & Duties" />
            <NavItem id="faq" active={active} onClick={go} label="FAQ" />
          </div>

          <div className="gd-sidebar-foot">AKATSICO &middot; Unified Portal (ehub) &middot; Internal reference</div>
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
                <p className="gd-lede">The Unified Portal is one login surface over two back-office systems — Academics and Finance — plus a self-service portal for students. This guide explains what each part does, who is allowed to do it, and how the pieces hand off to one another.</p>

                <div className="gd-stat-row">
                  <div className="gd-stat"><div className="gd-n">2</div><div className="gd-l">Staff modules</div></div>
                  <div className="gd-stat"><div className="gd-n">1</div><div className="gd-l">Self-service portal</div></div>
                  <div className="gd-stat"><div className="gd-n">60+</div><div className="gd-l">Distinct permission tags</div></div>
                  <div className="gd-stat"><div className="gd-n">1</div><div className="gd-l">Login, all systems</div></div>
                </div>

                <div className="gd-block">
                  <h2>How a person moves through the system</h2>
                  <div className="gd-block-dek">The same person can pass through both back-office modules as their status changes — this is the spine the rest of the guide hangs off.</div>
                  <div className="gd-flow">
                    <div className="gd-node">Active student (AIS)</div><span className="gd-arrow">→</span>
                    <div className="gd-node">Billed &amp; pays fees (FMS)</div><span className="gd-arrow">→</span>
                    <div className="gd-node">Graduates (AIS)</div>
                  </div>
                  <p>A student record is created directly in AIS (Students module), then also gets a Student Portal (AISP) login, and their financial record lives in FMS from that point forward — the staff modules are not silos, they are stages of one lifecycle.</p>
                </div>

                <div className="gd-block">
                  <h2>The two modules, at a glance</h2>
                  <div className="gd-module-grid">
                    <div className="gd-module-chip"><div className="gd-mc-title">AIS — Academics</div><div className="gd-mc-role">Students, courses, calendars, assessment, resits, graduation</div></div>
                    <div className="gd-module-chip"><div className="gd-mc-title">FMS — Finance</div><div className="gd-mc-role">Bills, charges, payments, receipts, debtors, financial reports</div></div>
                  </div>
                </div>

                <div className="gd-block">
                  <h2>Signing in</h2>
                  <p>Every user — staff or student — signs in from the same landing page using one of two options: <b>Sign In with Staff Credentials</b> (username + password, for AIS/FMS staff) or <b>Sign In with Student Access</b> (student ID + password, for enrolled students). What you land on afterwards depends entirely on the permission tags attached to your account — see <LinkTo id="roles" onClick={go}>Roles &amp; Duties</LinkTo>.</p>
                </div>

                <div className="gd-callout gd-callout-note"><span className="gd-ic">Note</span><div>This guide mirrors each module's own navigation menu, so the section order here matches what you'll actually see in the sidebar once you're signed in with the matching role.</div></div>
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
                  <p>Today / this week / this month / this year collection totals, a revenue mix by payment type, and a month-by-month breakdown across every payment category — academic fees, resits, graduation, transcripts, and more.</p>
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
                    <div className="gd-module-chip"><div className="gd-mc-title">Service Costs</div><div className="gd-mc-role">Set the price of priced services (e.g. transcript fee).</div></div>
                    <div className="gd-module-chip"><div className="gd-mc-title">System Reports</div><div className="gd-mc-role">Filterable exports for periodic financial reporting and reconciliation.</div></div>
                  </div>
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
                  <button className={roleFilter === "ais" ? "gd-active" : ""} onClick={() => setRoleFilter("ais")}>Academics (AIS)</button>
                  <button className={roleFilter === "fms" ? "gd-active" : ""} onClick={() => setRoleFilter("fms")}>Finance (FMS)</button>
                </div>

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
                  ["A student can't get past the login screen — what usually causes this?", "Almost always a wrong ID/password pair, or an account that hasn't been issued yet. If credentials are confirmed correct and it still fails, it's worth checking that the account genuinely exists in that role's underlying table before assuming it's a permissions issue."],
                  ["Can one person be both a staff member and a student?", "Yes — staff and student accounts are separate logins even for the same person (e.g. a graduate assistant who is also enrolled). Use the appropriate sign-in option for what you're trying to do."],
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
