import React from "react";

const Select = ({ label, name, options, loadOption, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name} style={{ marginLeft: "0.4rem" }}>
        {label}
      </label>
      <select className="form-control" id={name} {...rest}>
        <option value="0" hidden>
          Elegí una opción
        </option>
        {options.length === 0 ? (
          <option value="" disabled={true}>
            {loadOption}
          </option>
        ) : (
          options.map((option) => {
            return (
              <option key={option.value} value={option.value}>
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
