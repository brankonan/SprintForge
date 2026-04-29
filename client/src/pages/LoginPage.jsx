import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { authService } from "../services/authService";
import AuthField from "../components/AuthField";

export default function LoginPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const res = await authService.login(data.email, data.password);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res));
      navigate("/dashboard");
    } catch (err) {
      setServerError(err.response?.data?.message || "Login failed. Check your credentials.");
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
            <p className="sfa-panel__eyebrow">// welcome back</p>
            <h1 className="sfa-panel__title">Sign In</h1>
            <p className="sfa-panel__sub">
              Continue building. Your sprints are waiting.
            </p>
          </div>

          {serverError && (
            <div className="sfa-error">
              <span className="sfa-error__icon">!</span>
              {serverError}
            </div>
          )}

          <form className="sfa-form" onSubmit={handleSubmit(onSubmit)}>
            <AuthField
              id="email"
              label="Email address"
              type="email"
              filled={!!watch("email")}
              registration={register("email", { required: "Email is required" })}
              error={errors.email?.message}
              autoComplete="email"
            />
            <AuthField
              id="password"
              label="Password"
              type="password"
              filled={!!watch("password")}
              registration={register("password", { required: "Password is required" })}
              error={errors.password?.message}
              autoComplete="current-password"
            />

            <button type="submit" className="sfa-submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="sfa-submit__dots">
                  <span /><span /><span />
                </span>
              ) : (
                <>
                  Sign in
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M2.5 7.5h10M8.5 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="sfa-switch">
            No account yet?{" "}
            <Link to="/register" className="sfa-switch__link">
              Create one →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
