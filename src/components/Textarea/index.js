import React from "react";

const Textarea = ({ label, name, ...rest }) => {
  return (
    <div
      className="input-group input-group-lg"
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
          borderColor: "#0d6efd77"
        }}
        className="form-control"
        id={name}
        {...rest}
      />
    </div>
  );
};

export default Textarea;
