import React, { useState, Fragment } from "react";
import "./table_check_toggle_buttons.css";
import { ButtonGroupLabel } from "./table_check_toggle_buttons.js";

const TableCheckToggleButtons = ({
  label,
  columns,
  lines,
  name,
  onChange,
  ...rest
}) => {
  const [checked, setChecked] = useState(false);
  const handleCheck = (e) => {
    console.log(!document.getElementById(e.target.htmlFor).checked);
    setChecked(!document.getElementById(e.target.htmlFor).checked);
  };

  return (
    <div className="form-check inline-table-check-toggle">
      <label
        className="form-check-label inline-table-check-toggle-label"
        htmlFor={name}
        style={{ marginLeft: "0.4rem", marginBottom: "1.6rem" }}
      >
        {label}
      </label>
      <div className="table-check-table-data" id={name}>
        {lines.map((line, index) => (
          <Fragment key={index}>
            <label
              className="form-check-label inline-table-check-toggle-label"
              htmlFor={line.name}
              style={{
                marginLeft: "1.2rem",
                marginBottom: "1.2rem",
                marginTop: "1.6rem"
              }}
            >
              {line.label}
            </label>
            <div
              className="btn-group inline-table-check-toggle-buttons"
              role="group"
              aria-label="Basic table check toggle button group"
              style={{ marginBottom: "1.2rem" }}
              id={`${line.name}-buttons`}
            >
              {columns.map((column, index) => (
                <Fragment key={index}>
                  <input
                    type="checkbox"
                    className="btn-check"
                    id={`${line.name}-${column.name}`}
                    {...rest}
                    value={column.value}
                    onFocus={(e) => e.target.blur()}
                    onChange={onChange}
                  />

                  <ButtonGroupLabel
                    as="label"
                    onTouchEnd={handleCheck}
                    checked={checked}
                    className="btn btn-outline-primary table-check"
                    htmlFor={`${line.name}-${column.name}`}
                    onFocus={(e) => e.target.blur()}
                  >
                    {column.label}
                  </ButtonGroupLabel>
                </Fragment>
              ))}
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default TableCheckToggleButtons;
