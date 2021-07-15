import React from "react";
import "./table_switches.css";
import Switch from "../../components/Switch";

const TableSwitches = ({ label, lines, name, ...rest }) => {
  return (
    <div className="form-check table-switches" id={name}>
      <label
        className="form-check-label table-switches-label"
        htmlFor={name}
        style={{ marginLeft: "0.4rem", marginBottom: "1.6rem" }}
      >
        {label}
      </label>
      <div className="table-switches-data" id={name}>
        {lines.map((line, index) => (
          <Switch
            key={index}
            label={line.label}
            name={`${name}-${line.name}`}
            id={`${name}-${line.name}`}
            onChange={(e) => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default TableSwitches;
