import React from "react";

const TextArea = ({ name, label, error, size, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <textarea
        {...rest}
        name={name}
        id={name}
        className="form-control"
        rows="5"
      />
      {error && <div className="alert alert-warning">{error}</div>}
    </div>
  );
};

export default TextArea;
