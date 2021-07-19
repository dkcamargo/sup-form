import React from "react";

const Select = ({ label, name, options, loadOption, ...rest }) => {
  return (
    <div className="form-group">
      <label
        htmlFor={name}
        style={{ marginLeft: "0.4rem", marginBottom: "0.8rem" }}
      >
        {label}
      </label>
      <select
        className="form-control"
        style={{ minHeight: "3rem" }}
        id={name}
        {...rest}
      >
        <option value="0" hidden>
          Elegí una opción
        </option>
        {options.length === 0 ? (
          <option value="" disabled={true}>
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
    </div>
  );
};

export default Select;
