import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

function Field({ id, label, type = "text", value, onChange, required, autoComplete }) {
  return (
    <div className={`sfa-field ${value ? "sfa-field--filled" : ""}`}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" "
        required={required}
        autoComplete={autoComplete}
      />
      <label htmlFor={id}>{label}</label>
      <div className="sfa-field__line" />
    </div>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.register(form.firstName, form.lastName, form.email, form.password);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sfa-layout">
      <div className="sfa-brand">
        <div className="sfa-brand__noise" />
        <div className="sfa-brand__grid" />
        <div className="sfa-brand__glow" />

        <div className="sfa-brand__inner">
          <Link to="/" className="sfa-brand__logo">
            <span className="sfa-brand__hex">⬡</span>SprintForge
          </Link>

          <div className="sfa-brand__headline">
            <span className="sfa-brand__word sfa-brand__word--outline">Sprint</span>
            <div className="sfa-brand__rule" />
            <span className="sfa-brand__word sfa-brand__word--fill">Forge</span>
          </div>

          <p className="sfa-brand__sub">
            The sprint tool built for developers<br />who actually ship.
          </p>

          <ul className="sfa-brand__specs">
            {[
              ["KANBAN_BOARD",     "TRUE"],
              ["PORTFOLIO",        "PUBLIC_URL"],
              ["STANDUPS_NEEDED",  "false"],
              ["PRICE",            "$0 / MONTH"],
            ].map(([k, v]) => (
              <li key={k} className="sfa-brand__spec-row">
                <span className="sfa-brand__spec-key">{k}</span>
                <span className="sfa-brand__spec-dots" />
                <span className="sfa-brand__spec-val">{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="sfa-panel">
        <div className="sfa-panel__inner">
          <div className="sfa-panel__head">
            <p className="sfa-panel__eyebrow">// new account</p>
            <h1 className="sfa-panel__title">Create Account</h1>
            <p className="sfa-panel__sub">
              Set up your forge. Free, forever.
            </p>
          </div>

          {error && (
            <div className="sfa-error">
              <span className="sfa-error__icon">!</span>
              {error}
            </div>
          )}

          <form className="sfa-form" onSubmit={handleSubmit}>
            <div className="sfa-form__row">
              <Field
                id="firstName"
                label="First name"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                required
                autoComplete="given-name"
              />
              <Field
                id="lastName"
                label="Last name"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                required
                autoComplete="family-name"
              />
            </div>

            <Field
              id="email"
              label="Email address"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              autoComplete="email"
            />
            <Field
              id="password"
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              autoComplete="new-password"
            />

            <button type="submit" className="sfa-submit" disabled={loading}>
              {loading ? (
                <span className="sfa-submit__dots">
                  <span /><span /><span />
                </span>
              ) : (
                <>
                  Create account
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M2.5 7.5h10M8.5 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="sfa-switch">
            Already have an account?{" "}
            <Link to="/login" className="sfa-switch__link">
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
