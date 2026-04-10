import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";


export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
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
                onClick={() => navigate(`/sprints/${sprint.id}`)}
                style={{ cursor: "pointer" }}
              >
                <h3>{sprint.title}</h3>
                {sprint.goal && <p className="sprint-goal">{sprint.goal}</p>}
                {sprint.description && <p className="sprint-desc">{sprint.description}</p>}
                <div className="sprint-dates">
                  <span>{new Date(sprint.startDate).toLocaleDateString()}</span>
                  <span> — </span>
                  <span>{new Date(sprint.endDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
