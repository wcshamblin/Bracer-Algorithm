import React from "react";

const NumInput = ({ name, label, error, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input {...rest} name={name} id={name} className="form-control col-1" />
      {error && <div className="alert alert-warning">{error}</div>}
    </div>
  );
};

export default NumInput;
