import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState("");
  const [isPortfolioPublic, setIsPortfolioPublic] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
      setBio(data.bio || "");
      setIsPortfolioPublic(data.isPortfolioPublic || false);
    } catch {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);

    try {
      const { data } = await api.put("/auth/profile", { bio, isPortfolioPublic });
      setUser(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <main className="dashboard-content">
          <p className="loading-text">Loading profile...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-content">
        <div className="profile-page">
          <div className="profile-card">
            <div className="card-header">
              <div>
                <h2>
                  {user.firstName} {user.lastName}
                </h2>
                <span className="profile-role">{user.role}</span>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && (
              <div className="success-message">Profile saved successfully.</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell other students about yourself and your projects..."
                  maxLength={500}
                  rows={4}
                />
                <span className="char-count">{bio.length}/500</span>
              </div>

              <div className="toggle-row">
                <div className="toggle-info">
                  <span className="toggle-label">Public Portfolio</span>
                  <span className="toggle-desc">
                    Allow others to view your sprints on the Explore page
                  </span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={isPortfolioPublic}
                    onChange={(e) => setIsPortfolioPublic(e.target.checked)}
                  />
                  <span className="toggle-thumb" />
                </label>
              </div>

              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </form>

            {isPortfolioPublic && user?.userId && (
              <div className="profile-link">
                <a
                  href={`/portfolio/${user.userId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View your public portfolio →
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
