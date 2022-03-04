import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Nav({ active }) {

  const [isFormActive, setFormActive] = useState(false);
  const [isSurveyActive, setSurveyActive] = useState(false);
  const [isCoachingsActive, setCoachingsActive] = useState(false);  

  useEffect(()=>{
    setFormActive(active === "form")
    setSurveyActive(active === "surveys")
    setCoachingsActive(active === "coachings")
  }, [active]);
  
  
  return (
    <ul 
      className="nav nav-tabs justify-content-end"
      style={{marginBottom: '1.6rem'}}
    >
      <li className="nav-item">
        <Link id="form-link" className={`nav-link ${isFormActive?"active":null}`} to="/">Formularios</Link>

      </li>
      <li className="nav-item">
        <Link id="survey-link" className={`nav-link ${isSurveyActive?"active":null}`} to="/relevamientos">Relevamientos</Link>
      </li>
      <li className="nav-item">
        <Link id="coaching-link" className={`nav-link ${isCoachingsActive?"active":null}`} to="/coachings">Coachings</Link>
      </li>
    </ul>
  );}

export default Nav;
