import React, { useState } from "react";

const CheckInput = ({ label, name, ...rest }) => {
  const [enabled, setEnabled] = useState(true);
  return (
    <div className="form-group">
      <label
        style={{ marginLeft: "0.4rem", marginBottom: "0.8rem" }}
        htmlFor={name}
      >
        {label}
      </label>
      <div class="input-group mb-3">
        <input
          className="form-control"
          disabled={!enabled}
          style={{ minHeight: "3rem" }}
          type="text"
          id={name}
          {...rest}
        />
        <div class="input-group-text">
          <input
            class="form-check-input mt-0"
            type="checkbox"
            value=""
            checked={enabled}
            aria-label="Checkbox for following text input"
            onChange={(e) => {
              setEnabled(e.target.checked);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckInput;
