import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userService } from "../services/userService";

export default function ExplorePage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = { limit: 20 };
      if (search.trim()) params.search = search.trim();
      const data = await userService.explore(params);
      setUsers(data);
    } catch {
      console.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>
          <Link to="/">SprintForge</Link>
        </h1>
        <div className="header-right">
          {isLoggedIn ? (
            <Link to="/dashboard" className="btn-secondary">
              Dashboard
            </Link>
          ) : (
            <Link to="/login" className="btn-secondary">
              Sign In
            </Link>
          )}
        </div>
      </header>

      <main className="dashboard-content">
        <div className="section-header">
          <h2>Explore Portfolios</h2>
        </div>

        <div className="explore-search">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="loading-text">Loading portfolios...</p>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <p>No public portfolios found.</p>
          </div>
        ) : (
          <div className="sprint-grid">
            {users.map((user) => (
              <div
                key={user.id}
                className="explore-card"
                onClick={() => navigate(`/portfolio/${user.id}`)}
              >
                <div className="explore-name">
                  {user.firstName} {user.lastName}
                </div>
                <div className="explore-role">{user.role}</div>
                {user.bio && (
                  <div className="explore-bio">
                    {user.bio.length > 80
                      ? user.bio.substring(0, 80) + "..."
                      : user.bio}
                  </div>
                )}
                <div className="explore-stats">
                  {user.sprintCount} {user.sprintCount === 1 ? "sprint" : "sprints"}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
