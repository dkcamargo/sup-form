import React, { useState } from "react";

const CheckSelect = ({ label, name, options, loadOption, dependent, ...rest }) => {
  const [enabled, setEnabled] = useState(true);
  return (
    <div className="form-group">
      <label
        htmlFor={name}
        style={{ marginLeft: "0.4rem", marginBottom: "0.8rem" }}
      >
        {label}
      </label>
      <div className="input-group mb-3">
        <select
          className="form-control"
          style={{ minHeight: "3rem" }}
          disabled={!enabled}
          id={name}
          {...rest}
        >
          <option value="0" hidden>
            Elegí una opción
          </option>
          <option value="" hidden></option>
          {options.length === 0 ? (
            <option value="*" disabled={true}>
              {loadOption}
            </option>
          ) : (
            options.map((option, index) => {
              return (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              );
            })
          )}
        </select>
        <div className="input-group-text">
            <input
              className="form-check-input mt-0"
              type="checkbox"
              value=""
              checked={enabled}
              aria-label="Checkbox for following text input"
              id={`${name}-enabled`}
              onChange={(e) => {
                if(e.target.checked === true) {
                  document.getElementById(name).value = "0";
                  if(dependent) {
                    document.getElementById(`${dependent}-enabled`).checked = true;                 
                    document.getElementById(dependent).disabled = false;
                    document.getElementById(dependent).value = "0";
                  }
                } else {
                  document.getElementById(name).value = "";
                  if(dependent) {
                    document.getElementById(`${dependent}-enabled`).checked = false;                  
                    document.getElementById(dependent).disabled = true;
                    document.getElementById(dependent).value = "";                  
                  }
                }
                setEnabled(e.target.checked);
              }}
            />
          </div>
      </div>
    </div>
  );
};

export default CheckSelect;
