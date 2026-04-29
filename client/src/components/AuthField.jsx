export default function AuthField({ id, label, type = "text", filled, registration, error, autoComplete }) {
  return (
    <div className={`sfa-field ${filled ? "sfa-field--filled" : ""}`}>
      <input
        id={id}
        type={type}
        placeholder=" "
        autoComplete={autoComplete}
        {...registration}
      />
      <label htmlFor={id}>{label}</label>
      <div className="sfa-field__line" />
      {error && <span className="sfa-field__error">{error}</span>}
    </div>
  );
}
