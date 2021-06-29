import React from 'react';


const Input = ({
    label,
    name,
    ...rest
}) => {
  return (
    <div className="form-group">
        <label htmlFor={name}>{label}</label>
        <input className="form-control" style={{minHeight: '3rem'}} type="text" id={name} {...rest}/>
    </div>
  );
}

export default Input;