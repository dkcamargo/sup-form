import React, { useState } from "react";

const CheckInput = ({ label, name, info, ...rest }) => {
  const [enabled, setEnabled] = useState(true);
  return (
    <div className="form-group">
      <label
        style={{ marginLeft: "0.4rem", marginBottom: "0.8rem" }}
        htmlFor={name}
      >
        {label}
      </label>
      <div className="input-group mb-3">
        <input
          className="form-control"
          disabled={!enabled}
          style={{ minHeight: "3rem" }}
          type="text"
          id={name}
          {...rest}
        />
        <div className="input-group-text">
          <input
            className="form-check-input mt-0"
            type="checkbox"
            value=""
            checked={enabled}
            aria-label="Checkbox for following text input"
            onChange={(e) => {
              document.getElementById(name).value = "";
              setEnabled(e.target.checked);
            }}
          />
        </div>
      </div>
      {!enabled && info ? (
        <div
          style={{ fontSize: "1.2rem" }}
          className="alert alert-info"
          role="alert"
        >
          {info}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CheckInput;
