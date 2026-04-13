import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit sprint
  const [editingSprint, setEditingSprint] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    goal: "",
    startDate: "",
    endDate: "",
  });
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(stored));
    fetchSprints();
  }, [navigate]);

  const fetchSprints = async () => {
    try {
      const { data } = await api.get("/sprint/my");
      setSprints(data);
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
      await api.delete(`/sprint/${sprintId}`);
      setSprints((prev) => prev.filter((s) => s.id !== sprintId));
    } catch {
      console.error("Failed to delete sprint");
    }
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
    e.stopPropagation();
    setEditingSprint(null);
    setEditError("");
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditError("");
    setEditLoading(true);

    try {
      const { data } = await api.put(`/sprint/${editingSprint}`, {
        title: editForm.title,
        description: editForm.description || null,
        goal: editForm.goal || null,
        startDate: editForm.startDate,
        endDate: editForm.endDate,
      });
      setSprints((prev) =>
        prev.map((s) => (s.id === editingSprint ? { ...s, ...data } : s))
      );
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
      await api.patch(`/sprint/${sprintId}/status`, { status: newStatus });
      setSprints((prev) =>
        prev.map((s) => (s.id === sprintId ? { ...s, status: newStatus } : s))
      );
    } catch {
      console.error("Failed to update sprint status");
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-content">
        <div className="section-header">
          <h2>My Sprints</h2>
          <Link to="/sprints/create" className="btn-primary" style={{ width: "auto" }}>
            + New Sprint
          </Link>
        </div>

        {loading ? (
          <p className="loading-text">Loading sprints...</p>
        ) : sprints.length === 0 ? (
          <div className="empty-state">
            <p>No sprints yet. Create your first sprint to get started.</p>
          </div>
        ) : (
          <div className="sprint-grid">
            {sprints.map((sprint) => (
              <div
                key={sprint.id}
                className="sprint-card"
                onClick={() => !editingSprint && navigate(`/sprints/${sprint.id}`)}
                style={{ cursor: editingSprint === sprint.id ? "default" : "pointer" }}
              >
                {editingSprint === sprint.id ? (
                  <form className="sprint-edit-form" onSubmit={handleSaveEdit} onClick={(e) => e.stopPropagation()}>
                    {editError && <div className="error-message">{editError}</div>}
                    <div className="form-group">
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        placeholder="Sprint title"
                        maxLength={100}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        value={editForm.goal}
                        onChange={(e) => setEditForm({ ...editForm, goal: e.target.value })}
                        placeholder="Sprint goal"
                        maxLength={200}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        placeholder="Description"
                        maxLength={500}
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <input
                          type="date"
                          value={editForm.startDate}
                          onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="date"
                          value={editForm.endDate}
                          onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="edit-actions">
                      <button type="submit" className="btn-save" disabled={editLoading}>
                        {editLoading ? "Saving..." : "Save"}
                      </button>
                      <button type="button" className="btn-cancel" onClick={handleCancelEdit}>
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <span className={`sprint-status-badge status-${sprint.status?.toLowerCase()}`}>
                      {sprint.status}
                    </span>
                    <h3>{sprint.title}</h3>
                    {sprint.goal && <p className="sprint-goal">{sprint.goal}</p>}
                    {sprint.description && <p className="sprint-desc">{sprint.description}</p>}
                    <div className="sprint-dates">
                      <span>{new Date(sprint.startDate).toLocaleDateString()}</span>
                      <span> — </span>
                      <span>{new Date(sprint.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="sprint-card-actions">
                      <select
                        className="status-select-inline"
                        value={sprint.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleStatusChange(sprint.id, e.target.value, e)}
                      >
                        <option value="Planned">Planned</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <button className="btn-edit" onClick={(e) => handleStartEdit(sprint, e)}>
                        Edit
                      </button>
                      <button className="btn-delete" onClick={(e) => handleDeleteSprint(sprint.id, e)}>
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
