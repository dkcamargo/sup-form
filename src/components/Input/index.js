import React from "react";

const Input = ({ label, name, ...rest }) => {
  return (
    <div className="form-group">
      <label style={{ marginLeft: "0.4rem", marginBottom: "0.8rem" }} htmlFor={name}>
        {label}
      </label>
      <input
        className="form-control"
        style={{ minHeight: "3rem" }}
        type="text"
        id={name}
        {...rest}
      />
    </div>
  );
};

export default Input;
