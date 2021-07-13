import React from "react";
import "./switch_toggle_buttons.css";
const SwitchToggleButtons = ({ label, options, labelStyle, name, ...rest }) => {
  return (
    <div className="form-check inline-switch-toggle">
      <label
        className="form-check-label inline-switch-toggle-label"
        htmlFor={name}
        style={labelStyle}
      >
        {label}
      </label>
      <div
        className="btn-group inline-switch-toggle-buttons"
        role="group"
        aria-label="Basic radio toggle button group"
      >
        {options.map((option, index) => (
          <>
            <input
              key={index}
              type="radio"
              className="btn-check"
              name={name}
              id={option.name}
              autoComplete="off"
              {...rest}
              value={option.value}
            />
            <label
              className="btn btn-outline-primary btn-lg"
              htmlFor={option.name}
            >
              {option.label}
            </label>
          </>
        ))}
      </div>
    </div>
  );
};

export default SwitchToggleButtons;
