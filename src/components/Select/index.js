import React from 'react';


const Select = ({
    label,
    name,
    options,
    ...rest
}) => {
  return (
    <div className="form-group">
        <label htmlFor={name}>{label}</label>
        <select className="form-control" id={name} {...rest} >
          <option value="0" hidden>Elegí una opción</option>
          {options.length === 0 ?
              <option value="" disabled={true}>Cargando</option>
            : options.map(option => {
              return <option key={option.value} value={option.value}>{option.label}</option>
            })
          }
        </select>
    </div>
  );
}

export default Select;