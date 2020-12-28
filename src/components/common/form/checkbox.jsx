import React from "react";

const Checkbox = ({ name, label, type, error, onChange, ...rest }) => {
  return (
    <div className="form-group">
      <input
        type={type}
        id={name}
        name={name}
        value={name}
        onClick={onChange}
      />
      <label htmlFor={name}> {label}</label>
    </div>
  );
};

export default Checkbox;
