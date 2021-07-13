import React from "react";

const Textarea = ({ label, name, ...rest }) => {
  return (
    <div
      className="form-floating"
      style={{
        width: "95%",
        alignSelf: "center",
        marginBottom: "2.4rem",
        borderColor: "#0d6efd"
      }}
    >
      <textarea
        placeholder={label}
        style={{
          fontSize: "1.6rem",
          color: "#000",
          minHeight: "4.2rem",
          height: "12.8rem",
          borderColor: "#0d6efd77",
          paddingTop: "2.4rem"
        }}
        className="form-control"
        id={name}
        {...rest}
      />
      <label for={name}>{label}</label>
    </div>
  );
};

export default Textarea;
