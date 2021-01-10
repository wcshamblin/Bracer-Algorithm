import React from "react";

const NumInput = ({ name, label, error, disabled, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        {...rest}
        name={name}
        id={name}
        style={{ cursor: `${disabled ? "not-allowed" : ""}` }}
        disabled={disabled}
        className="form-control"
      />
      {error && <div className="alert alert-warning">{error}</div>}
    </div>
  );
};

export default NumInput;
