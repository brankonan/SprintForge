import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { sprintService } from "../services/sprintService";
import { userService } from "../services/userService";
import { formatDate } from "../utils/formatDate";

const Icons = {
  dashboard: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  plus: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  explore: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 5.5L9 9l-3.5 1.5L7 7l3.5-1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  ),
  profile: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5.5" r="2.75" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.5 13.5c0-2.485 2.462-4.5 5.5-4.5s5.5 2.015 5.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  logout: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M5.5 13H2.5a1 1 0 01-1-1V3a1 1 0 011-1h3M10 10.5l3-3-3-3M13 7.5H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  arrow: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  edit: (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M9 2l2 2-7 7H2V9l7-7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  ),
  trash: (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M2 3.5h9M4.5 3.5V2.5a1 1 0 011-1h2a1 1 0 011 1v1M5.5 6v4M7.5 6v4M3.5 3.5l.5 7a1 1 0 001 1h4a1 1 0 001-1l.5-7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const NAV_ITEMS = [
  { to: "/dashboard",      label: "Dashboard",   icon: Icons.dashboard },
  { to: "/sprints/create", label: "New Sprint",  icon: Icons.plus      },
  { to: "/explore",        label: "Explore",     icon: Icons.explore   },
  { to: "/profile",        label: "Profile",     icon: Icons.profile   },
];

function getGreeting(name) {
  const h = new Date().getHours();
  const prefix = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  return `${prefix}, ${name}`;
}

function ProgressRing({ pct = 0, size = 96, stroke = 7 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(pct, 100) / 100) * circ;
  return (
    <svg width={size} height={size} className="sfd-ring" aria-hidden>
      <defs>
        <linearGradient id="sfd-rg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="#1e2236" strokeWidth={stroke}
      />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="url(#sfd-rg)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{
          transform: "rotate(-90deg)",
          transformOrigin: "50% 50%",
          transition: "stroke-dashoffset 1.4s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      />
    </svg>
  );
}

function Sidebar({ user }) {
  const { pathname } = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "?";

  return (
    <aside className="sfd-sidebar">
      <Link to="/" className="sfd-sidebar__logo">
        <span className="sfd-sidebar__hex">⬡</span>
        <span className="sfd-sidebar__wordmark">SprintForge</span>
      </Link>

      <nav className="sfd-sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`sfd-nav-item ${pathname === item.to ? "is-active" : ""}`}
          >
            <span className="sfd-nav-item__icon">{item.icon}</span>
            <span className="sfd-nav-item__label">{item.label}</span>
            {pathname === item.to && <span className="sfd-nav-item__pip" />}
          </Link>
        ))}
      </nav>

      <div className="sfd-sidebar__foot">
        <div className="sfd-sidebar__user">
          <div className="sfd-sidebar__avatar">{initials}</div>
          <div className="sfd-sidebar__user-meta">
            <span className="sfd-sidebar__user-name">
              {user ? `${user.firstName} ${user.lastName}` : "—"}
            </span>
            <span className="sfd-sidebar__user-role">
              {user?.role || "Developer"}
            </span>
          </div>
        </div>
        <button className="sfd-sidebar__logout" onClick={logout} title="Sign out">
          {Icons.logout}
        </button>
      </div>
    </aside>
  );
}

function StatPill({ label, value, accent }) {
  return (
    <div className={`sfd-stat ${accent ? "sfd-stat--accent" : ""}`}>
      <span className="sfd-stat__val">{value}</span>
      <span className="sfd-stat__label">{label}</span>
    </div>
  );
}

function CommandPanel({ sprint, progress, onOpen }) {
  const pct = progress?.percentage ?? 0;
  const todo = progress?.todo ?? 0;
  const inProg = progress?.inProgress ?? 0;
  const done = progress?.done ?? 0;
  const total = progress?.total ?? 0;

  const segTodo = total > 0 ? (todo / total) * 100 : 0;
  const segProg = total > 0 ? (inProg / total) * 100 : 0;
  const segDone = total > 0 ? (done / total) * 100 : 0;

  return (
    <div className="sfd-command" onClick={() => onOpen(sprint.id)}>
      <div className="sfd-command__glow" />

      <div className="sfd-command__left">
        <div className="sfd-command__eyebrow">
          <span className="sfd-command__pulse" />
          Active sprint
        </div>
        <h2 className="sfd-command__title">{sprint.title}</h2>
        {sprint.goal && (
          <p className="sfd-command__goal">{sprint.goal}</p>
        )}
        {sprint.description && !sprint.goal && (
          <p className="sfd-command__goal">{sprint.description}</p>
        )}

        {total > 0 && (
          <div className="sfd-command__seg-wrap">
            <div className="sfd-command__seg">
              <div className="sfd-command__seg-fill sfd-command__seg-fill--done"  style={{ width: `${segDone}%` }} />
              <div className="sfd-command__seg-fill sfd-command__seg-fill--prog"  style={{ width: `${segProg}%` }} />
              <div className="sfd-command__seg-fill sfd-command__seg-fill--todo"  style={{ width: `${segTodo}%` }} />
            </div>
            <div className="sfd-command__seg-legend">
              <span className="sfd-seg-key sfd-seg-key--done">{done} done</span>
              <span className="sfd-seg-key sfd-seg-key--prog">{inProg} in progress</span>
              <span className="sfd-seg-key sfd-seg-key--todo">{todo} todo</span>
            </div>
          </div>
        )}

        <div className="sfd-command__meta-row">
          <span className="sfd-command__dates">
            {formatDate(sprint.startDate)} → {formatDate(sprint.endDate)}
          </span>
          <button className="sfd-command__open">
            Open board {Icons.arrow}
          </button>
        </div>
      </div>

      <div className="sfd-command__right">
        <div className="sfd-command__ring-wrap">
          <ProgressRing pct={pct} size={100} stroke={7} />
          <div className="sfd-command__ring-label">
            <span className="sfd-command__ring-pct">{pct}%</span>
            <span className="sfd-command__ring-sub">complete</span>
          </div>
        </div>
        <div className="sfd-command__total-tasks">
          {total} task{total !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}

const STATUS_META = {
  planned:   { cls: "planned",   label: "Planned",   dot: "#5A5E7A" },
  active:    { cls: "active",    label: "Active",    dot: "#00D2FF" },
  completed: { cls: "completed", label: "Completed", dot: "#22d3a0" },
};

function SprintRow({
  sprint,
  onNavigate,
  onStartEdit,
  onDelete,
  onStatusChange,
  isEditing,
  editForm,
  setEditForm,
  onSaveEdit,
  onCancelEdit,
  editLoading,
  editError,
}) {
  const meta = STATUS_META[sprint.status?.toLowerCase()] || STATUS_META.planned;

  if (isEditing) {
    return (
      <div className="sfd-row sfd-row--editing" onClick={(e) => e.stopPropagation()}>
        <form className="sfd-edit-form" onSubmit={onSaveEdit}>
          {editError && <div className="sfd-edit-error">{editError}</div>}
          <div className="sfd-edit-grid">
            <input
              className="sfd-edit-input"
              placeholder="Sprint title"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              required maxLength={100}
            />
            <input
              className="sfd-edit-input"
              placeholder="Goal (optional)"
              value={editForm.goal}
              onChange={(e) => setEditForm({ ...editForm, goal: e.target.value })}
              maxLength={200}
            />
            <input
              className="sfd-edit-input"
              placeholder="Description (optional)"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              maxLength={500}
            />
            <div className="sfd-edit-dates">
              <input
                className="sfd-edit-input"
                type="date"
                value={editForm.startDate}
                onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                required
              />
              <input
                className="sfd-edit-input"
                type="date"
                value={editForm.endDate}
                onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="sfd-edit-actions">
            <button type="submit" className="sfd-edit-save" disabled={editLoading}>
              {editLoading ? "Saving…" : "Save changes"}
            </button>
            <button type="button" className="sfd-edit-cancel" onClick={onCancelEdit}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div
      className="sfd-row"
      onClick={() => onNavigate(sprint.id)}
      role="button"
      tabIndex={0}
    >
      <div className="sfd-row__status">
        <span
          className={`sfd-row__dot sfd-row__dot--${meta.cls}`}
          title={meta.label}
        />
      </div>

      <div className="sfd-row__main">
        <span className="sfd-row__title">{sprint.title}</span>
        {sprint.goal && (
          <span className="sfd-row__goal">{sprint.goal}</span>
        )}
      </div>

      <div className="sfd-row__progress">
        <div className="sfd-row__bar">
          <div
            className={`sfd-row__bar-fill sfd-row__bar-fill--${meta.cls}`}
            style={{ width: meta.cls === "completed" ? "100%" : meta.cls === "active" ? "45%" : "0%" }}
          />
        </div>
      </div>

      <div className="sfd-row__dates">
        <span>{formatDate(sprint.startDate)}</span>
        <span className="sfd-row__dates-sep">→</span>
        <span>{formatDate(sprint.endDate)}</span>
      </div>

      <div className="sfd-row__badge-wrap" onClick={(e) => e.stopPropagation()}>
        <select
          className={`sfd-row__select sfd-row__select--${meta.cls}`}
          value={sprint.status}
          onChange={(e) => onStatusChange(sprint.id, e.target.value, e)}
        >
          <option value="Planned">Planned</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="sfd-row__actions" onClick={(e) => e.stopPropagation()}>
        <button
          className="sfd-row__btn sfd-row__btn--edit"
          onClick={(e) => onStartEdit(sprint, e)}
          title="Edit"
        >
          {Icons.edit}
        </button>
        <button
          className="sfd-row__btn sfd-row__btn--delete"
          onClick={(e) => onDelete(sprint.id, e)}
          title="Delete"
        >
          {Icons.trash}
        </button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="sfd-empty">
      <div className="sfd-empty__icon">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect x="4" y="10" width="32" height="24" rx="4" stroke="#252840" strokeWidth="2" />
          <path d="M12 10V7a2 2 0 012-2h12a2 2 0 012 2v3" stroke="#252840" strokeWidth="2" />
          <path d="M20 20v6M17 23h6" stroke="#00D2FF" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
      <p className="sfd-empty__title">No sprints yet</p>
      <p className="sfd-empty__sub">Create your first sprint and start shipping.</p>
      <Link to="/sprints/create" className="sfd-empty__btn">
        Create sprint {Icons.arrow}
      </Link>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeProgress, setActiveProgress] = useState(null);
  const [userStats, setUserStats] = useState(null);

  const [editingSprint, setEditingSprint] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", goal: "", startDate: "", endDate: "" });
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { navigate("/login"); return; }
    setUser(JSON.parse(stored));
    fetchSprints();
    userService.getStats().then(setUserStats).catch((err) => console.error("Failed to load stats:", err));
  }, [navigate]);

  const fetchSprints = async () => {
    try {
      const data = await sprintService.getMy();
      setSprints(data);
      const active = data.find((s) => s.status?.toLowerCase() === "active");
      if (active) {
        sprintService.getProgress(active.id)
          .then((p) => setActiveProgress(p))
          .catch(() => {});
      }
    } catch {
      console.error("Failed to fetch sprints");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSprint = async (sprintId, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this sprint? All tasks and artifacts will be permanently removed.")) return;
    try {
      await sprintService.delete(sprintId);
      setSprints((prev) => prev.filter((s) => s.id !== sprintId));
    } catch { console.error("Failed to delete sprint"); }
  };

  const handleStartEdit = (sprint, e) => {
    e.stopPropagation();
    setEditingSprint(sprint.id);
    setEditForm({
      title: sprint.title,
      description: sprint.description || "",
      goal: sprint.goal || "",
      startDate: sprint.startDate?.split("T")[0] || "",
      endDate: sprint.endDate?.split("T")[0] || "",
    });
    setEditError("");
  };

  const handleCancelEdit = (e) => {
    e?.stopPropagation();
    setEditingSprint(null);
    setEditError("");
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditError("");
    setEditLoading(true);
    try {
      const data = await sprintService.update(editingSprint, {
        title: editForm.title,
        description: editForm.description || null,
        goal: editForm.goal || null,
        startDate: editForm.startDate,
        endDate: editForm.endDate,
      });
      setSprints((prev) => prev.map((s) => (s.id === editingSprint ? { ...s, ...data } : s)));
      setEditingSprint(null);
    } catch (err) {
      setEditError(err.response?.data?.message || "Failed to update sprint.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleStatusChange = async (sprintId, newStatus, e) => {
    e.stopPropagation();
    try {
      await sprintService.updateStatus(sprintId, newStatus);
      setSprints((prev) => prev.map((s) => (s.id === sprintId ? { ...s, status: newStatus } : s)));
    } catch { console.error("Failed to update sprint status"); }
  };

  const activeSprint = sprints.find((s) => s.status?.toLowerCase() === "active");
  const railSprints = sprints.filter((s) => s.id !== activeSprint?.id);

  const stats = {
    total: sprints.length,
    active: sprints.filter((s) => s.status?.toLowerCase() === "active").length,
    completed: sprints.filter((s) => s.status?.toLowerCase() === "completed").length,
    planned: sprints.filter((s) => s.status?.toLowerCase() === "planned").length,
  };

  return (
    <div className="sfd-layout">
      <Sidebar user={user} />

      <div className="sfd-main">
        <header className="sfd-header">
          <div className="sfd-header__left">
            <h1 className="sfd-header__greeting">
              {user ? getGreeting(user.firstName) : "Loading…"}
            </h1>
            <p className="sfd-header__sub">
              {sprints.length > 0
                ? `You have ${stats.active} active sprint${stats.active !== 1 ? "s" : ""} running.`
                : "Ready to start your first sprint?"}
            </p>
          </div>
          <div className="sfd-header__stats">
            <StatPill label="Total sprints" value={stats.total} />
            <StatPill label="Active"        value={stats.active}    accent />
            <StatPill label="Completed"     value={stats.completed} />
            <StatPill label="Tasks done"    value={userStats ? `${userStats.doneTasks}/${userStats.totalTasks}` : "—"} />
            <StatPill label="Completion"    value={userStats ? `${userStats.completionRate}%` : "—"} accent />
          </div>
        </header>

        <div className="sfd-content">
          {loading ? (
            <div className="sfd-loading">
              <div className="sfd-loading__dot" />
              <div className="sfd-loading__dot" />
              <div className="sfd-loading__dot" />
            </div>
          ) : sprints.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {activeSprint && (
                <section className="sfd-section">
                  <CommandPanel
                    sprint={activeSprint}
                    progress={activeProgress}
                    onOpen={(id) => navigate(`/sprints/${id}`)}
                  />
                </section>
              )}

              {railSprints.length > 0 && (
                <section className="sfd-section">
                  <div className="sfd-section__head">
                    <h2 className="sfd-section__title">
                      {activeSprint ? "All sprints" : "Sprints"}
                    </h2>
                    <Link to="/sprints/create" className="sfd-section__cta">
                      New sprint {Icons.plus}
                    </Link>
                  </div>

                  <div className="sfd-rail">
                    {railSprints.map((sprint) => (
                      <SprintRow
                        key={sprint.id}
                        sprint={sprint}
                        onNavigate={(id) => !editingSprint && navigate(`/sprints/${id}`)}
                        onStartEdit={handleStartEdit}
                        onDelete={handleDeleteSprint}
                        onStatusChange={handleStatusChange}
                        isEditing={editingSprint === sprint.id}
                        editForm={editForm}
                        setEditForm={setEditForm}
                        onSaveEdit={handleSaveEdit}
                        onCancelEdit={handleCancelEdit}
                        editLoading={editLoading}
                        editError={editError}
                      />
                    ))}
                  </div>
                </section>
              )}

              {activeSprint && railSprints.length === 0 && (
                <div className="sfd-only-active">
                  <Link to="/sprints/create" className="sfd-section__cta">
                    {Icons.plus} Start another sprint
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
