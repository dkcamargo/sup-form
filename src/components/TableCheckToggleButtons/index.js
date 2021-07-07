import React from "react";
import "./table_check_toggle_buttons.css";
const TableCheckToggleButtons = ({ label, columns, lines, name, ...rest }) => {
  // const handleInputChange = (event) => {
  //   console.log(event);
  //   const thisInput = document.getElementById(event.target.id);
  //   console.log(thisInput);
  //   thisInput.setAttribute("checked", !thisInput.checked);
  // };
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
        {lines.map((line) => (
          <>
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
            <hr />
            {columns.map((column) => (
              <div
                className="form-check inline-table-check-toggle-buttons"
                role="group"
                aria-label="Basic table check toggle button group"
                style={{ marginBottom: "1.2rem" }}
                id={`${line.name}-buttons`}
              >
                <label
                  className="form-check-label table-check"
                  for={`${line.name}-${column.name}`}
                  onFocus={(e) => e.target.blur()}
                  onTouchEnd={(e) => {
                    e.target.blur();
                  }}
                >
                  {column.label}
                </label>
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`${line.name}-${column.name}`}
                  autocomplete="off"
                  {...rest}
                  value={column.value}
                  onFocus={(e) => e.target.blur()}
                />
              </div>
            ))}
          </>
        ))}
      </div>
    </div>
  );
};

export default TableCheckToggleButtons;
