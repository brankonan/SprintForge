import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { userService } from "../services/userService";
import { formatDate } from "../utils/formatDate";

export default function PortfolioPage() {
  const { userId } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    fetchPortfolio();
  }, [userId]);

  const fetchPortfolio = async () => {
    try {
      const data = await userService.getPortfolio(userId);
      setPortfolio(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Portfolio is private or user not found."
      );
    } finally {
      setLoading(false);
    }
  };

  const getProgress = (sprint) => {
    if (sprint.taskCount === 0) return 0;
    return Math.round((sprint.doneCount / sprint.taskCount) * 100);
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>
          <Link to="/">SprintForge</Link>
        </h1>
        <div className="header-right">
          <Link to="/explore" className="btn-secondary">
            Explore
          </Link>
          {isLoggedIn && (
            <Link to="/dashboard" className="btn-secondary">
              Dashboard
            </Link>
          )}
        </div>
      </header>

      <main className="dashboard-content">
        {loading ? (
          <p className="loading-text">Loading portfolio...</p>
        ) : error ? (
          <div className="empty-state">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="portfolio-header">
              <h2>
                {portfolio.firstName} {portfolio.lastName}
              </h2>
              <div className="portfolio-role">{portfolio.role}</div>
              {portfolio.bio && (
                <div className="portfolio-bio">{portfolio.bio}</div>
              )}
            </div>

            <div className="section-header">
              <h2>Sprints</h2>
            </div>

            {portfolio.sprints.length === 0 ? (
              <div className="empty-state">
                <p>No sprints yet.</p>
              </div>
            ) : (
              <div className="sprint-grid">
                {portfolio.sprints.map((sprint) => (
                  <div key={sprint.id} className="sprint-card">
                    <h3>{sprint.title}</h3>
                    {sprint.goal && (
                      <p className="sprint-goal">{sprint.goal}</p>
                    )}
                    <div className="sprint-dates">
                      <span>
                        {formatDate(sprint.startDate)}
                      </span>
                      <span> — </span>
                      <span>
                        {formatDate(sprint.endDate)}
                      </span>
                    </div>
                    <div className="progress-section">
                      <div className="progress-header">
                        <span className="progress-label">Progress</span>
                        <span className="progress-percentage">
                          {getProgress(sprint)}%
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${getProgress(sprint)}%` }}
                        />
                      </div>
                      <div className="progress-stats">
                        <span className="stat stat-done">
                          Done: {sprint.doneCount}
                        </span>
                        <span className="stat">
                          Total: {sprint.taskCount}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
