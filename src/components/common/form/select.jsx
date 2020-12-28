import React from "react";

const Select = ({ name, label, options, error, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <select name={name} id={name} {...rest} className="form-control">
        <option defaultValue hidden>
          --Please select {label} --
        </option>
        {options.map((option) => (
          <option key={option._id || option} value={option._id || option}>
            {option.name || option}
          </option>
        ))}
      </select>
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Select;
