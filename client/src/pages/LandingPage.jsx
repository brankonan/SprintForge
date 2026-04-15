import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

// ── Ticker items ──────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  "Sprint Planning", "Kanban Boards", "Task Tracking",
  "Portfolio Proof", "Progress Analytics", "Artifact Management",
  "No Standups Required", "Just Ship It",
];

// ── Engineering specs ─────────────────────────────────────────────────────────
const SPECS = [
  { key: "KANBAN_BOARD",       val: "TRUE" },
  { key: "TASK_PRIORITIES",    val: "HIGH | MEDIUM | LOW" },
  { key: "SPRINT_ANALYTICS",   val: "REAL_TIME" },
  { key: "PORTFOLIO_EXPORT",   val: "PUBLIC_URL" },
  { key: "ARTIFACTS",          val: "LINKS · DOCS · PRS" },
  { key: "JIRA_REQUIRED",      val: "false" },
  { key: "STANDUPS_NEEDED",    val: "false" },
  { key: "PRICE",              val: "$0 / MONTH" },
];

// ── Features ──────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    num: "01",
    tag: "CORE",
    title: "Kanban-first sprint board",
    desc: "To Do, In Progress, Done. Set priorities, attach due dates, link artifacts. No ceremony, no overhead — just the board.",
  },
  {
    num: "02",
    tag: "ANALYTICS",
    title: "Progress that speaks for itself",
    desc: "Real-time completion bars, per-column task counts, sprint velocity at a glance. Know exactly where you stand.",
  },
  {
    num: "03",
    tag: "PORTFOLIO",
    title: "Every sprint = proof of work",
    desc: "Completed sprints become your public record. Share a URL. Let the work speak instead of your bullet points.",
  },
  {
    num: "04",
    tag: "NO_BS",
    title: "Built for solo devs who ship",
    desc: "No seat limits, no enterprise tiers, no feature gating. Everything works on day one. You build, it tracks.",
  },
];

// ── Showcase tabs ─────────────────────────────────────────────────────────────
const TABS = [
  {
    id: "plan",
    label: "Plan",
    title: "Structure before chaos",
    desc: "Create a sprint with a name, goal, and timeline in under a minute. Add tasks with priorities and due dates. Start with intention.",
  },
  {
    id: "build",
    label: "Build",
    title: "Ship with the board open",
    desc: "Drag tasks across columns as you work. Attach artifacts — PR links, deployed URLs, docs — directly to tasks. The record writes itself.",
  },
  {
    id: "ship",
    label: "Ship",
    title: "Portfolio that does the talking",
    desc: "Mark a sprint complete and it lives forever on your public profile. Developers land jobs with momentum, not promises.",
  },
];

// ────────────────────────────────────────────────────────────────────────────
// Nav
// ────────────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(
        `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const fn = () => {
      const s = document.documentElement.scrollTop;
      const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrolled(s > 24);
      setProgress(h > 0 ? (s / h) * 100 : 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`sfn ${scrolled ? "sfn--on" : ""}`}>
      <div className="sfn__bar" style={{ width: `${progress}%` }} />
      <div className="sfn__inner">
        <Link to="/" className="sfn__logo">
          <span className="sfn__hex">⬡</span>SprintForge
        </Link>
        <div className="sfn__time">{time}</div>
        <div className="sfn__links">
          <a href="#features" className="sfn__link">Features</a>
          <a href="#showcase" className="sfn__link">Product</a>
          <Link to="/login" className="sfn__link">Login</Link>
          <Link to="/register" className="sfn__cta">
            Forge it <span className="sfn__arr">↗</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Hero
// ────────────────────────────────────────────────────────────────────────────
function Hero() {
  const [in_, setIn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setIn(true), 80); return () => clearTimeout(t); }, []);

  return (
    <section className={`sfh ${in_ ? "sfh--in" : ""}`}>
      <div className="sfh__noise" />
      <div className="sfh__grid" />
      <div className="sfh__glow" />

      <div className="sfh__inner">
        {/* Left column */}
        <div className="sfh__left">
          <p className="sfh__eyebrow">
            <span className="sfh__eyebrow-dot" />
            // Built different. Actually.
          </p>

          <h1 className="sfh__headline">
            <span className="sfh__word sfh__word--outline">Sprint</span>
            <div className="sfh__divider" />
            <span className="sfh__word sfh__word--fill">Forge</span>
          </h1>

          <p className="sfh__sub">
            Plan, build, and ship sprints.<br />
            No project manager needed.<br />
            Just you, the board, and the deadline.
          </p>

          <div className="sfh__actions">
            <Link to="/register" className="sfh__btn-primary">
              Start forging
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M2.5 7.5h10M8.5 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <a href="#showcase" className="sfh__btn-ghost">See the product</a>
          </div>

          <ul className="sfh__specs">
            {[
              ["∞", "sprints"],
              ["100%", "open source"],
              ["$0", "forever"],
            ].map(([n, l]) => (
              <li key={l} className="sfh__spec">
                <span className="sfh__spec-n">{n}</span>
                <span className="sfh__spec-l">{l}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right column — kanban board */}
        <div className="sfh__right">
          <div className="sfh__board-aura" />
          <div className="sfh__board">
            <div className="sfh__board-bar">
              <div className="sfh__dots">
                <span /><span /><span />
              </div>
              <span className="sfh__board-name">Q2 Sprint — Week 3</span>
              <span className="sfh__badge sfh__badge--active">● Active</span>
            </div>

            <div className="sfh__board-cols">
              {[
                {
                  h: "Todo", cls: "todo",
                  tasks: [
                    { t: "Auth flow redesign", p: "high" },
                    { t: "API rate limiting", p: "med" },
                  ],
                },
                {
                  h: "In Progress", cls: "prog",
                  tasks: [
                    { t: "Dashboard v2", p: "high" },
                    { t: "Sprint retro UI", p: "low" },
                  ],
                },
                {
                  h: "Done", cls: "done",
                  tasks: [
                    { t: "CI/CD setup", p: "med" },
                    { t: "DB migration", p: "high" },
                  ],
                },
              ].map((col) => (
                <div key={col.h} className="sfh__col">
                  <div className={`sfh__col-h sfh__col-h--${col.cls}`}>
                    {col.h} <span>{col.tasks.length}</span>
                  </div>
                  {col.tasks.map((tk) => (
                    <div key={tk.t} className="sfh__task">
                      <span className="sfh__task-t">{tk.t}</span>
                      <span className={`sfh__task-p sfh__task-p--${tk.p}`}>{tk.p}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="sfh__board-foot">
              <div className="sfh__prog-track">
                <div className="sfh__prog-fill" />
              </div>
              <span className="sfh__prog-txt">67% complete</span>
            </div>
          </div>
        </div>
      </div>

      <div className="sfh__scroll-hint">
        <span>scroll</span>
        <div className="sfh__scroll-line" />
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Ticker
// ────────────────────────────────────────────────────────────────────────────
function Ticker() {
  return (
    <div className="sft">
      <div className="sft__track">
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span key={i} className="sft__item">
            {item.toUpperCase()}
            <span className="sft__sep">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Spec Sheet
// ────────────────────────────────────────────────────────────────────────────
function SpecSheet() {
  return (
    <section className="sfspec">
      <div className="sfspec__inner">
        <div className="sfspec__label">
          <span>SPEC SHEET</span>
          <span className="sfspec__ver">v2.0 / OPEN_SOURCE</span>
        </div>
        <div className="sfspec__grid">
          {SPECS.map(({ key, val }) => (
            <div key={key} className="sfspec__row">
              <span className="sfspec__key">{key}</span>
              <span className="sfspec__dots" />
              <span className="sfspec__val">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Features
// ────────────────────────────────────────────────────────────────────────────
function Features() {
  return (
    <section className="sff" id="features">
      <div className="sff__inner">
        <div className="sff__header">
          <p className="sff__label">// features</p>
          <h2 className="sff__title">
            Everything you need.
            <span className="sff__title-ghost"> Nothing you don't.</span>
          </h2>
        </div>
        <div className="sff__grid">
          {FEATURES.map((f) => (
            <div key={f.num} className="sff__card">
              <span className="sff__card-watermark">{f.num}</span>
              <div className="sff__card-top">
                <span className="sff__tag">{f.tag}</span>
              </div>
              <h3 className="sff__card-h">{f.title}</h3>
              <p className="sff__card-p">{f.desc}</p>
              <div className="sff__card-edge" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Showcase mocks
// ────────────────────────────────────────────────────────────────────────────
function MockPlan() {
  return (
    <div className="sfm sfm--plan">
      <div className="sfm__bar">
        <span className="sfm__dot" />
        <span>new_sprint.json</span>
      </div>
      <div className="sfm__body">
        {[
          ["sprint_name", '"Q2 Feature Push"'],
          ["goal", '"Ship auth + dashboard"'],
          ["start_date", '"2025-04-14"'],
          ["end_date", '"2025-04-28"'],
          ["status", '"planned"'],
        ].map(([k, v]) => (
          <div key={k} className="sfm__line">
            <span className="sfm__key">{k}</span>
            <span className="sfm__colon">:</span>
            <span className="sfm__val">{v}</span>
          </div>
        ))}
        <div className="sfm__btn">POST /api/sprint →</div>
      </div>
    </div>
  );
}

function MockBuild() {
  return (
    <div className="sfm sfm--build">
      <div className="sfm__bar">
        <span className="sfm__dot sfm__dot--orange" />
        <span>Q2 Feature Push</span>
        <span className="sfm__badge-active">● Active</span>
      </div>
      <div className="sfm__cols">
        {[
          { h: "TODO", cls: "todo", tasks: ["Onboarding flow", "Rate limiting"] },
          { h: "IN PROGRESS", cls: "prog", tasks: ["Dashboard v2", "Auth refactor"] },
          { h: "DONE", cls: "done", tasks: ["DB schema", "CI pipeline"] },
        ].map((col) => (
          <div key={col.h} className="sfm__col">
            <div className={`sfm__col-h sfm__col-h--${col.cls}`}>{col.h}</div>
            {col.tasks.map((t) => (
              <div key={t} className="sfm__task">{t}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function MockShip() {
  return (
    <div className="sfm sfm--ship">
      <div className="sfm__bar">
        <span className="sfm__dot sfm__dot--green" />
        <span>@devuser — public profile</span>
      </div>
      <div className="sfm__body">
        <div className="sfm__profile">
          <div className="sfm__avatar">DV</div>
          <div>
            <div className="sfm__pname">Dev User</div>
            <div className="sfm__prole">FULL-STACK DEVELOPER</div>
          </div>
          <div className="sfm__public-badge">PUBLIC</div>
        </div>
        {[["Q2 Feature Push", "12 tasks", "completed"], ["Auth System v2", "8 tasks", "completed"], ["API Overhaul", "15 tasks", "completed"]].map(
          ([name, tasks, status]) => (
            <div key={name} className="sfm__sprint-row">
              <span className="sfm__sprint-name">{name}</span>
              <span className="sfm__sprint-tasks">{tasks}</span>
              <span className="sfm__sprint-done">✓ {status}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Showcase
// ────────────────────────────────────────────────────────────────────────────
function Showcase() {
  const [active, setActive] = useState("plan");
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => {
      setActive((cur) => {
        const i = TABS.findIndex((t) => t.id === cur);
        return TABS[(i + 1) % TABS.length].id;
      });
    }, 3800);
    return () => clearInterval(id);
  }, [auto]);

  const tab = TABS.find((t) => t.id === active);
  const MOCK = { plan: <MockPlan />, build: <MockBuild />, ship: <MockShip /> };

  return (
    <section className="sfs" id="showcase">
      <div className="sfs__inner">
        <p className="sfs__label">// how it works</p>
        <div className="sfs__shell">
          <div className="sfs__tabs">
            {TABS.map((t, i) => (
              <button
                key={t.id}
                className={`sfs__tab ${active === t.id ? "is-active" : ""}`}
                onClick={() => { setActive(t.id); setAuto(false); }}
              >
                <span className="sfs__tab-n">0{i + 1}</span>
                <span>{t.label}</span>
                {active === t.id && <div className="sfs__tab-bar" />}
              </button>
            ))}
          </div>
          <div className="sfs__body">
            <div className="sfs__text" key={active}>
              <h3>{tab.title}</h3>
              <p>{tab.desc}</p>
            </div>
            <div className="sfs__mock" key={active + "_m"}>
              {MOCK[active]}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// CTA  (full bleed inversion — orange bg, black text)
// ────────────────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="sfcta">
      <div className="sfcta__noise" />
      <div className="sfcta__inner">
        <p className="sfcta__label">// ready?</p>
        <h2 className="sfcta__headline">
          Less Slack.<br />
          <span className="sfcta__headline-outline">More Ship.</span>
        </h2>
        <p className="sfcta__sub">
          Free, open source, and built by a developer who was tired of the alternatives.
        </p>
        <div className="sfcta__actions">
          <Link to="/register" className="sfcta__btn">
            Create free account
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M2.5 7.5h10M8.5 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link to="/login" className="sfcta__ghost">Already have an account →</Link>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Footer
// ────────────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="sffoot">
      <div className="sffoot__inner">
        <div className="sffoot__brand">
          <span className="sffoot__logo">⬡ SprintForge</span>
          <p className="sffoot__tagline">Built to ship. Built to show.</p>
        </div>
        <nav className="sffoot__links">
          <Link to="/explore">Explore</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </nav>
        <p className="sffoot__copy">© {new Date().getFullYear()} SprintForge</p>
      </div>
    </footer>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Root
// ────────────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="sf-land">
      <Nav />
      <Hero />
      <Ticker />
      <SpecSheet />
      <Features />
      <Showcase />
      <CTA />
      <Footer />
    </div>
  );
}
