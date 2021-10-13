import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Nav extends Component {
  state = {
      isFormActive: false,
      isStatisticsActive: false,
      isCoachingsActive: false
  }
  constructor(props) {
    super(props);

    this.state.isFormActive = this.props.active === "form"
    this.state.isSurveysActive = this.props.active === "surveys"
    this.state.isCoachingsActive = this.props.active === "coachings"
  }
  render() {
    const isActive = this.state;
    return (
      <ul 
        className="nav nav-tabs justify-content-end"
        style={{marginBottom: '1.6rem'}}
      >
        <li className="nav-item">
          <Link id="form-link" className={`nav-link ${isActive.isFormActive?"active":null}`} to="/">Formularios</Link>

        </li>
        <li className="nav-item">
          <Link id="survey-link" className={`nav-link ${isActive.isSurveysActive?"active":null}`} to="/relevamientos">Relevamientos</Link>
        </li>
        <li className="nav-item">
          <Link id="coaching-link" className={`nav-link ${isActive.isCoachingsActive?"active":null}`} to="coachings">Coachings</Link>
        </li>
      </ul>
    );
  }
};

