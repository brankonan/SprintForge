import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const features = [
  {
    icon: "\u2692",
    title: "Sprint Planning",
    desc: "Forge focused development sprints with clear goals, deadlines, and purpose.",
  },
  {
    icon: "\u25A6",
    title: "Kanban Board",
    desc: "Drag tasks through To Do, In Progress, and Done on a visual board.",
  },
  {
    icon: "\u25CE",
    title: "Progress Tracking",
    desc: "Watch real-time progress bars and stats as your sprint takes shape.",
  },
  {
    icon: "\u2197",
    title: "Public Portfolios",
    desc: "Showcase finished sprints to the world with a shareable portfolio page.",
  },
];

export default function LandingPage() {
  const isLoggedIn = !!localStorage.getItem("token");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`landing-page ${visible ? "landing-visible" : ""}`}>
      <div className="landing-glow" />

      <nav className="landing-nav">
        <span className="landing-logo">
          <span className="logo-icon">{"\u2692"}</span> SprintForge
        </span>
        <div className="landing-nav-links">
          <Link to="/explore" className="nav-link">
            Explore
          </Link>
          {isLoggedIn ? (
            <Link to="/dashboard" className="btn-landing-primary">
              Dashboard
            </Link>
          ) : (
            <Link to="/login" className="btn-landing-primary">
              Sign In
            </Link>
          )}
        </div>
      </nav>

      <section className="landing-hero">
        <div className="hero-badge">Built for student developers</div>
        <h1>
          Forge Your
          <br />
          <span className="hero-accent">Sprint Workflow</span>
        </h1>
        <p className="hero-subtitle">
          Plan sprints. Track progress. Build a portfolio that proves your work.
        </p>
        <div className="hero-buttons">
          {isLoggedIn ? (
            <Link to="/dashboard" className="btn-hero-primary">
              Go to Dashboard
              <span className="btn-arrow">{"\u2192"}</span>
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-hero-primary">
                Start Building
                <span className="btn-arrow">{"\u2192"}</span>
              </Link>
              <Link to="/login" className="btn-hero-secondary">
                I have an account
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="landing-features">
        <div className="features-label">What you get</div>
        <div className="feature-grid">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="feature-card"
              style={{ animationDelay: `${0.1 + i * 0.08}s` }}
            >
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-cta">
        <div className="cta-inner">
          <h2>Ready to forge something?</h2>
          <p>Join students who track their dev progress and showcase real work.</p>
          <Link
            to={isLoggedIn ? "/dashboard" : "/register"}
            className="btn-hero-primary"
          >
            {isLoggedIn ? "Open Dashboard" : "Create Free Account"}
            <span className="btn-arrow">{"\u2192"}</span>
          </Link>
        </div>
      </section>

      <footer className="landing-footer">
        <Link to="/explore">Browse Public Portfolios</Link>
        <span className="footer-sep">{"\u00B7"}</span>
        <span>SprintForge {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
