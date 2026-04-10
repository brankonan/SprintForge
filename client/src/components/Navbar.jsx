import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ backLink, backLabel }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="dashboard-header">
      <h1>
        <Link to="/dashboard">SprintForge</Link>
      </h1>
      <div className="header-right">
        {backLink && (
          <Link to={backLink} className="btn-secondary">
            {backLabel || "Back"}
          </Link>
        )}
        <Link to="/profile" className="btn-secondary">
          Profile
        </Link>
        <button className="btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
