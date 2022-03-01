import React, { Component } from "react";
import { Navigate } from "react-router-dom";

export default class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = { logged: window.localStorage.getItem("logged") };
  }

  render() {
    const { logged } = this.state;
    if (logged === "true") {
      return <></>;
    } else {
      return <Navigate to="/login" />;
    }
  }
}
