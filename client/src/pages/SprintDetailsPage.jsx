import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { sprintService } from "../services/sprintService";
import { taskService } from "../services/taskService";
import { artifactService } from "../services/artifactService";
import { formatDate } from "../utils/formatDate";

const STATUS_COLUMNS = ["Todo", "InProgress", "Done"];

const STATUS_LABELS = {
  Todo: "To Do",
  InProgress: "In Progress",
  Done: "Done",
};

const PRIORITY_CLASSES = {
  High: "priority-high",
  Medium: "priority-medium",
  Low: "priority-low",
};

export default function SprintDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  // Add task form
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Edit task
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState("Medium");
  const [editError, setEditError] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Artifacts
  const [artifactTaskId, setArtifactTaskId] = useState(null);
  const [artifactTitle, setArtifactTitle] = useState("");
  const [artifactUrl, setArtifactUrl] = useState("");
  const [artifactType, setArtifactType] = useState("Other");
  const [artifactSubmitting, setArtifactSubmitting] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    fetchTasks();
    fetchProgress();
  }, [id]);

  const fetchTasks = async () => {
    try {
      const data = await taskService.getBySprint(id);
      setTasks(data);
    } catch {
      console.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const data = await sprintService.getProgress(id);
      setProgress(data);
    } catch {
      console.error("Failed to fetch progress");
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    try {
      const payload = { title, description: description || null, priority };
      if (dueDate) payload.dueDate = dueDate;

      const data = await taskService.create(id, payload);
      setTasks((prev) => [...prev, data]);
      fetchProgress();
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setDueDate("");
      setShowForm(false);
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to add task.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateStatus(id, taskId, newStatus);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
      fetchProgress();
    } catch {
      console.error("Failed to update status");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await taskService.delete(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      fetchProgress();
    } catch {
      console.error("Failed to delete task");
    }
  };

  const startEditing = (task) => {
    setEditingTask(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditPriority(task.priority);
    setEditError("");
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setEditError("");
  };

  const toggleArtifactForm = (taskId) => {
    if (artifactTaskId === taskId) {
      setArtifactTaskId(null);
    } else {
      setArtifactTaskId(taskId);
      setArtifactTitle("");
      setArtifactUrl("");
      setArtifactType("Other");
    }
  };

  const handleAddArtifact = async (e, taskId) => {
    e.preventDefault();
    setArtifactSubmitting(true);

    try {
      const data = await artifactService.create(taskId, {
        title: artifactTitle,
        url: artifactUrl,
        type: artifactType,
      });
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, artifacts: [...(t.artifacts || []), data] }
            : t
        )
      );
      setArtifactTaskId(null);
    } catch (err) {
      console.error("Failed to add artifact", err);
    } finally {
      setArtifactSubmitting(false);
    }
  };

  const handleDeleteArtifact = async (taskId, artifactId) => {
    if (!window.confirm("Remove this artifact link?")) return;
    try {
      await artifactService.delete(artifactId);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, artifacts: (t.artifacts || []).filter((a) => a.id !== artifactId) }
            : t
        )
      );
    } catch {
      console.error("Failed to delete artifact");
    }
  };

  const handleEditTask = async (e) => {
    e.preventDefault();
    setEditError("");
    setEditSubmitting(true);

    try {
      const data = await taskService.update(editingTask, {
        title: editTitle,
        description: editDescription || null,
        priority: editPriority,
      });
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask ? { ...t, ...data } : t))
      );
      setEditingTask(null);
    } catch (err) {
      setEditError(err.response?.data?.message || "Failed to update task.");
    } finally {
      setEditSubmitting(false);
    }
  };

  const tasksByStatus = (status) => tasks.filter((t) => t.status === status);

  return (
    <div className="sprint-details-page">
      <Navbar backLink="/dashboard" backLabel="Back to Dashboard" />

      <main className="sprint-details-content">
        <div className="section-header">
          <h2>Tasks</h2>
          <button
            className="btn-primary"
            style={{ width: "auto" }}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "+ Add Task"}
          </button>
        </div>

        {progress && (
          <div className="progress-section">
            <div className="progress-header">
              <span className="progress-label">Sprint Progress</span>
              <span className="progress-percentage">{progress.percentage}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            <div className="progress-stats">
              <span className="stat stat-todo">Todo: {progress.todo}</span>
              <span className="stat stat-inprogress">In Progress: {progress.inProgress}</span>
              <span className="stat stat-done">Done: {progress.done}</span>
            </div>
          </div>
        )}

        {showForm && (
          <div className="add-task-form">
            {formError && <div className="error-message">{formError}</div>}
            <form onSubmit={handleAddTask}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="taskTitle">Title</label>
                  <input
                    id="taskTitle"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task title"
                    maxLength={100}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="taskPriority">Priority</label>
                  <select
                    id="taskPriority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="taskDesc">Description</label>
                <input
                  id="taskDesc"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description"
                  maxLength={500}
                />
              </div>

              <div className="form-group" style={{ maxWidth: "220px" }}>
                <label htmlFor="taskDue">Due Date</label>
                <input
                  id="taskDue"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? "Adding..." : "Add Task"}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <p className="loading-text">Loading tasks...</p>
        ) : (
          <div className="board">
            {STATUS_COLUMNS.map((status) => (
              <div key={status} className="board-column">
                <div className={`column-header column-${status.toLowerCase()}`}>
                  <span>{STATUS_LABELS[status]}</span>
                  <span className="task-count">{tasksByStatus(status).length}</span>
                </div>

                <div className="column-tasks">
                  {tasksByStatus(status).length === 0 ? (
                    <p className="empty-column">No tasks</p>
                  ) : (
                    tasksByStatus(status).map((task) => (
                      <div key={task.id} className="task-card">
                        {editingTask === task.id ? (
                          <form className="edit-task-form" onSubmit={handleEditTask}>
                            {editError && <div className="error-message">{editError}</div>}
                            <div className="form-group">
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                maxLength={100}
                                required
                              />
                            </div>
                            <div className="form-group">
                              <input
                                type="text"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                placeholder="Description"
                                maxLength={500}
                              />
                            </div>
                            <div className="form-group">
                              <select
                                value={editPriority}
                                onChange={(e) => setEditPriority(e.target.value)}
                              >
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                              </select>
                            </div>
                            <div className="edit-actions">
                              <button type="submit" className="btn-save" disabled={editSubmitting}>
                                {editSubmitting ? "Saving..." : "Save"}
                              </button>
                              <button type="button" className="btn-cancel" onClick={cancelEditing}>
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <div className="task-header">
                              <span className="task-title">{task.title}</span>
                              <span className={`priority-badge ${PRIORITY_CLASSES[task.priority]}`}>
                                {task.priority}
                              </span>
                            </div>
                            {task.description && (
                              <p className="task-desc">{task.description}</p>
                            )}
                            {task.dueDate && (
                              <p className="task-due">
                                Due: {formatDate(task.dueDate)}
                              </p>
                            )}
                            {task.artifacts && task.artifacts.length > 0 && (
                              <div className="artifact-list">
                                {task.artifacts.map((a) => (
                                  <span key={a.id} className="artifact-pill">
                                    <a href={a.url} target="_blank" rel="noopener noreferrer">
                                      {a.title}
                                    </a>
                                    <button
                                      className="artifact-delete"
                                      onClick={() => handleDeleteArtifact(task.id, a.id)}
                                    >
                                      ×
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}

                            {artifactTaskId === task.id && (
                              <form
                                className="add-artifact-form"
                                onSubmit={(e) => handleAddArtifact(e, task.id)}
                              >
                                <input
                                  type="text"
                                  placeholder="Title"
                                  value={artifactTitle}
                                  onChange={(e) => setArtifactTitle(e.target.value)}
                                  maxLength={100}
                                  required
                                />
                                <input
                                  type="url"
                                  placeholder="https://..."
                                  value={artifactUrl}
                                  onChange={(e) => setArtifactUrl(e.target.value)}
                                  required
                                />
                                <select
                                  value={artifactType}
                                  onChange={(e) => setArtifactType(e.target.value)}
                                >
                                  <option value="GitHub">GitHub</option>
                                  <option value="Website">Website</option>
                                  <option value="Document">Document</option>
                                  <option value="Other">Other</option>
                                </select>
                                <button
                                  type="submit"
                                  className="btn-primary"
                                  disabled={artifactSubmitting}
                                >
                                  {artifactSubmitting ? "..." : "Add"}
                                </button>
                              </form>
                            )}

                            <select
                              className="status-select"
                              value={task.status}
                              onChange={(e) => handleStatusChange(task.id, e.target.value)}
                            >
                              <option value="Todo">To Do</option>
                              <option value="InProgress">In Progress</option>
                              <option value="Done">Done</option>
                            </select>
                            <div className="task-actions">
                              <button className="btn-edit" onClick={() => startEditing(task)}>
                                Edit
                              </button>
                              <button
                                className="btn-edit"
                                onClick={() => toggleArtifactForm(task.id)}
                              >
                                {artifactTaskId === task.id ? "Cancel" : "Add Link"}
                              </button>
                              <button className="btn-delete" onClick={() => handleDeleteTask(task.id)}>
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
